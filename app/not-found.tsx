import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-7xl font-bold text-zinc-200 dark:text-zinc-800">404</div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Page not found
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-2">
        <ArrowLeft size={16} />
        Back to projects
      </Link>
    </div>
  );
}
