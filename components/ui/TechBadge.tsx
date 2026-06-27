// components/ui/TechBadge.tsx
import { cn } from "@/lib/utils";

interface Tech {
  name: string;
  category?: string;
}

interface TechBadgeProps {
  tech: Tech;
  size?: "sm" | "md";
  className?: string;
}

const categoryClass: Record<string, string> = {
  language: "badge-language",
  framework: "badge-framework",
  database:  "badge-database",
  tool:      "badge-tool",
  platform:  "badge-platform",
};

export function TechBadge({ tech, size = "md", className }: TechBadgeProps) {
  const cat = tech.category?.toLowerCase() ?? "other";
  const colorClass = categoryClass[cat] ?? "badge-other";

  return (
    <span
      className={cn(
        "badge",
        colorClass,
        size === "sm" && "text-[10px] px-1.5 py-0.5",
        className
      )}
    >
      {tech.name}
    </span>
  );
}

// import { cn, getTechColor } from "@/lib/utils";
// import { Tech } from "@/types";

// interface TechBadgeProps {
//   tech: Tech;
//   size?: "sm" | "md";
//   onClick?: () => void;
//   active?: boolean;
// }

// const categoryClass: Record<string, string> = {
//   language: "badge-language",
//   framework: "badge-framework",
//   database: "badge-database",
//   tool: "badge-tool",
//   platform: "badge-other",
//   other: "badge-other",
// };

// export function TechBadge({ tech, size = "md", onClick, active }: TechBadgeProps) {
//   const color = getTechColor(tech.name);
//   const cls = categoryClass[tech.category] || "badge-other";

//   const Tag = onClick ? "button" : "span";

//   return (
//     <Tag
//       onClick={onClick}
//       className={cn(
//         "badge",
//         cls,
//         size === "sm" && "text-[11px] px-1.5 py-0.5",
//         onClick && "cursor-pointer hover:opacity-80 transition-opacity",
//         active && "ring-2 ring-current ring-offset-1"
//       )}
//     >
//       <span
//         className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
//         style={{ backgroundColor: color }}
//       />
//       {tech.name}
//     </Tag>
//   );
// }

// // Compact dot-only version for card overlays
// export function TechDot({ tech }: { tech: Tech }) {
//   const color = getTechColor(tech.name);
//   return (
//     <span
//       className="w-2 h-2 rounded-full flex-shrink-0"
//       style={{ backgroundColor: color }}
//       title={tech.name}
//     />
//   );
// }
