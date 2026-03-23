import { Resend } from "resend";

export const runtime = "edge";

const resend = new Resend(process.env.RESEND_API_KEY);
const RATE_LIMIT_WINDOW_SECONDS = Number(
  process.env.RATE_LIMIT_CONTACT_WINDOW_SECONDS ?? "60",
);
const RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.RATE_LIMIT_CONTACT_MAX_REQUESTS ?? "5",
);

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function getClientIdentifier(request: Request, payload: ContactPayload) {
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(0)
    ?.trim();
  const ip = cfIp || forwarded || "unknown";

  return `${ip}:${payload.email.toLowerCase()}`;
}

function getRateLimitStatus(key: string) {
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;

  // Keep memory bounded in long-lived isolates.
  if (rateLimitStore.size > 1000) {
    for (const [entryKey, entry] of rateLimitStore.entries()) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(entryKey);
      }
    }
  }

  const existing = rateLimitStore.get(key);
  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, fresh);
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { limited: true, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return {
    limited: false,
    remaining: Math.max(RATE_LIMIT_MAX_REQUESTS - existing.count, 0),
    resetAt: existing.resetAt,
  };
}

function validatePayload(payload: ContactPayload) {
  if (!payload.name || !payload.email || !payload.message) {
    return "All fields are required.";
  }

  if (payload.name.length > 100) {
    return "Name is too long.";
  }

  if (payload.message.length < 10 || payload.message.length > 2000) {
    return "Message must be between 10 and 2000 characters.";
  }

  if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
    return "Please enter a valid email address.";
  }

  return null;
}

async function sendWithResend(params: {
  apiKey: string;
  to: string;
  from: string;
  payload: ContactPayload;
}) {
  const { apiKey, to, from, payload } = params;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Portfolio contact from ${payload.name}`,
    replyTo: payload.email,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
  });

  if (!error) {
    return null;
  }

  try {
    const fallbackResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Portfolio contact from ${payload.name}`,
        reply_to: payload.email,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      }),
    });

    if (fallbackResponse.ok) {
      return null;
    }

    const fallbackBody = (await fallbackResponse.json().catch(() => ({}))) as { message?: string };
    return fallbackBody.message || error.message || "Failed to send email.";
  } catch {
    return error.message || "Failed to send email.";
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const validationError = validatePayload(payload);

    if (validationError) {
      return Response.json({ message: validationError }, { status: 400 });
    }

    const rateKey = getClientIdentifier(request, payload);
    const status = getRateLimitStatus(rateKey);

    if (status.limited) {
      const retryAfter = Math.max(Math.ceil((status.resetAt - Date.now()) / 1000), 1);
      return Response.json(
        {
          message: "Too many contact requests. Please try again shortly.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": String(status.remaining),
          },
        },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toAddress = process.env.CONTACT_TO_EMAIL;
    const fromAddress = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    if (!apiKey || !toAddress) {
      return Response.json(
        { message: "Server email configuration is incomplete." },
        { status: 500 },
      );
    }

    const sendError = await sendWithResend({
      apiKey,
      to: toAddress,
      from: fromAddress,
      payload,
    });

    if (sendError) {
      return Response.json({ message: sendError }, { status: 500 });
    }

    return Response.json({ message: "Email sent." }, { status: 200 });
  } catch {
    return Response.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
