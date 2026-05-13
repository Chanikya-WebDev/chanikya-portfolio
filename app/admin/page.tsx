import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  addProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/app/actions/projectActions";
import { textVariants } from "@/components/ui/typography";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage projects in your portfolio.",
  alternates: {
    canonical: "/admin",
  },
};

export const runtime = "edge";

async function signOutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id,title,description,image_url,github_url,demo_url,tags,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load projects: ${error.message}`);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn(textVariants({ role: "section-title" }), "text-zinc-50")}>Admin Dashboard</h1>
          <p className={cn(textVariants({ role: "body" }), "mt-2 text-zinc-400")}>
            Add, edit, and remove portfolio projects.
          </p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className={cn(textVariants({ role: "label" }), "rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 transition hover:bg-zinc-900")}
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-none">
        <h2 className={cn(textVariants({ role: "section-title" }), "text-zinc-50")}>Add New Project</h2>
        <form action={addProjectAction} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="new-title" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
              Title
            </label>
            <input
              id="new-title"
              name="title"
              required
              className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <label htmlFor="new-tags" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
              Tags (comma separated)
            </label>
            <input
              id="new-tags"
              name="tags"
              className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
              placeholder="Next.js, Supabase, Tailwind"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="new-description" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
              Description
            </label>
            <textarea
              id="new-description"
              name="description"
              rows={4}
              required
              className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-image-url" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
              Image URL
            </label>
            <input
              id="new-image-url"
              name="imageUrl"
              type="url"
              className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-github-url" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
              GitHub URL
            </label>
            <input
              id="new-github-url"
              name="githubUrl"
              type="url"
              className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="new-demo-url" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
              Demo URL
            </label>
            <input
              id="new-demo-url"
              name="demoUrl"
              type="url"
              className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className={cn(textVariants({ role: "label" }), "inline-flex items-center justify-center rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 transition hover:bg-zinc-300")}
            >
              Create project
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className={cn(textVariants({ role: "section-title" }), "text-zinc-50")}>Existing Projects</h2>
        {projects.length === 0 ? (
          <p className={cn(textVariants({ role: "body" }), "text-zinc-400")}>No projects yet.</p>
        ) : (
          <ul className="space-y-4">
            {(projects as Project[]).map((project) => {
              const updateWithId = updateProjectAction.bind(null, project.id);
              const deleteWithId = deleteProjectAction.bind(null, project.id);

              return (
                <li key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-none">
                  <details>
                    <summary className="cursor-pointer list-none">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className={cn(textVariants({ role: "label" }), "text-zinc-50")}>{project.title}</h3>
                        <span className={cn(textVariants({ role: "metadata" }), "text-zinc-400")}>
                          {project.updated_at || project.created_at
                            ? new Date(project.updated_at || project.created_at || "").toLocaleDateString()
                            : "No timestamp"}
                        </span>
                      </div>
                    </summary>

                    <form action={updateWithId} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-1">
                        <label htmlFor={`title-${project.id}`} className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
                          Title
                        </label>
                        <input
                          id={`title-${project.id}`}
                          name="title"
                          defaultValue={project.title}
                          required
                          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-1">
                        <label htmlFor={`tags-${project.id}`} className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
                          Tags (comma separated)
                        </label>
                        <input
                          id={`tags-${project.id}`}
                          name="tags"
                          defaultValue={(project.tags ?? []).join(", ")}
                          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor={`description-${project.id}`} className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
                          Description
                        </label>
                        <textarea
                          id={`description-${project.id}`}
                          name="description"
                          defaultValue={project.description}
                          rows={4}
                          required
                          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={`imageUrl-${project.id}`} className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
                          Image URL
                        </label>
                        <input
                          id={`imageUrl-${project.id}`}
                          name="imageUrl"
                          type="url"
                          defaultValue={project.image_url ?? ""}
                          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={`githubUrl-${project.id}`} className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
                          GitHub URL
                        </label>
                        <input
                          id={`githubUrl-${project.id}`}
                          name="githubUrl"
                          type="url"
                          defaultValue={project.github_url ?? ""}
                          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor={`demoUrl-${project.id}`} className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
                          Demo URL
                        </label>
                        <input
                          id={`demoUrl-${project.id}`}
                          name="demoUrl"
                          type="url"
                          defaultValue={project.demo_url ?? ""}
                          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none transition focus:border-sky-500")}
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                        <button
                          type="submit"
                          className={cn(textVariants({ role: "label" }), "inline-flex items-center justify-center rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 transition hover:bg-zinc-300")}
                        >
                          Save changes
                        </button>
                        <button
                          type="submit"
                          formAction={deleteWithId}
                          className={cn(textVariants({ role: "label" }), "inline-flex items-center justify-center rounded-md border border-red-400/50 bg-red-500/10 px-4 py-2 text-red-300 transition hover:bg-red-500/20")}
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
