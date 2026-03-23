import { createClient } from "@supabase/supabase-js";

const TABLE_NAME = "regex_scores";

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  const client = getSupabaseAdminClient();
  if (!client) {
    return Response.json({ enabled: false, globalBest: null }, { status: 200 });
  }

  const { data, error } = await client
    .from(TABLE_NAME)
    .select("score")
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return Response.json({ enabled: false, globalBest: null }, { status: 200 });
  }

  return Response.json(
    {
      enabled: true,
      globalBest: typeof data?.score === "number" ? data.score : 0,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

type RegexScorePayload = {
  score: number;
};

export async function POST(request: Request) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return Response.json({ enabled: false, globalBest: null }, { status: 200 });
  }

  let payload: RegexScorePayload;
  try {
    payload = (await request.json()) as RegexScorePayload;
  } catch {
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  const normalizedScore = Number(payload.score);
  if (!Number.isFinite(normalizedScore) || normalizedScore < 0) {
    return Response.json({ message: "Invalid score." }, { status: 400 });
  }

  const { error: insertError } = await client.from(TABLE_NAME).insert({
    score: Math.round(normalizedScore),
  });

  if (insertError) {
    return Response.json({ enabled: false, globalBest: null }, { status: 200 });
  }

  const { data, error: bestError } = await client
    .from(TABLE_NAME)
    .select("score")
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bestError) {
    return Response.json({ enabled: true, globalBest: Math.round(normalizedScore) }, { status: 200 });
  }

  return Response.json(
    {
      enabled: true,
      globalBest: typeof data?.score === "number" ? data.score : Math.round(normalizedScore),
    },
    { status: 200 },
  );
}
