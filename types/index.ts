export type TechCategory =
  | "language"
  | "framework"
  | "database"
  | "tool"
  | "platform"
  | "other";

export interface Tech {
  name: string;
  category: TechCategory;
  color?: string; // optional hex for badge
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  stack: Tech[];
  tags: string[];
  imageUrls: string[];
  thumbnailUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchFilters {
  query?: string;
  languages?: string[];
  frameworks?: string[];
  tags?: string[];
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "title" | "featured";
}

export type ThemeMode = "light" | "dark" | "system";
