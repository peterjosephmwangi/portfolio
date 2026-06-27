import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

// Map common languages/frameworks to brand colors
const techColors: Record<string, string> = {
  // Languages
  javascript: "#F7DF1E",
  typescript: "#3178C6",
  python: "#3776AB",
  rust: "#CE422B",
  go: "#00ADD8",
  java: "#ED8B00",
  "c#": "#512BD4",
  "c++": "#00599C",
  php: "#777BB4",
  ruby: "#CC342D",
  swift: "#FA7343",
  kotlin: "#7F52FF",
  dart: "#0175C2",
  r: "#276DC3",
  // Frameworks
  react: "#61DAFB",
  nextjs: "#000000",
  vue: "#42B883",
  angular: "#DD0031",
  svelte: "#FF3E00",
  "node.js": "#339933",
  express: "#000000",
  fastapi: "#009688",
  django: "#092E20",
  flask: "#000000",
  laravel: "#FF2D20",
  // Databases
  mongodb: "#47A248",
  postgresql: "#4169E1",
  mysql: "#4479A1",
  redis: "#DC382D",
  sqlite: "#003B57",
  // Tools
  docker: "#2496ED",
  kubernetes: "#326CE5",
  aws: "#FF9900",
  gcp: "#4285F4",
  azure: "#0089D6",
  tailwindcss: "#06B6D4",
  graphql: "#E10098",
};

export function getTechColor(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return techColors[key] || "#6B7280";
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}
