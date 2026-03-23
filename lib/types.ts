export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};
