import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/types";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey };
}

const { url, anonKey } = getSupabaseEnv();

const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const getCachedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,description,image_url,github_url,demo_url,tags,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data ?? [];
  },
  ["projects-public-list"],
  {
    revalidate: 300,
    tags: ["projects"],
  },
);
