"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

function parseTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getRequiredField(formData: FormData, field: string) {
  const value = formData.get(field)?.toString().trim();

  if (!value) {
    throw new Error(`${field} is required.`);
  }

  return value;
}

function getOptionalField(formData: FormData, field: string) {
  const value = formData.get(field)?.toString().trim();
  return value ? value : null;
}

async function assertAuthenticated() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return supabase;
}

export async function addProjectAction(formData: FormData) {
  const supabase = await assertAuthenticated();

  const title = getRequiredField(formData, "title");
  const description = getRequiredField(formData, "description");
  const imageUrl = getOptionalField(formData, "imageUrl");
  const githubUrl = getOptionalField(formData, "githubUrl");
  const demoUrl = getOptionalField(formData, "demoUrl");
  const tags = parseTags(formData.get("tags")?.toString() ?? "");

  const { error } = await supabase.from("projects").insert({
    title,
    description,
    image_url: imageUrl,
    github_url: githubUrl,
    demo_url: demoUrl,
    tags,
  });

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  const supabase = await assertAuthenticated();

  const title = getRequiredField(formData, "title");
  const description = getRequiredField(formData, "description");
  const imageUrl = getOptionalField(formData, "imageUrl");
  const githubUrl = getOptionalField(formData, "githubUrl");
  const demoUrl = getOptionalField(formData, "demoUrl");
  const tags = parseTags(formData.get("tags")?.toString() ?? "");

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      description,
      image_url: imageUrl,
      github_url: githubUrl,
      demo_url: demoUrl,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProjectAction(projectId: string) {
  const supabase = await assertAuthenticated();

  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
