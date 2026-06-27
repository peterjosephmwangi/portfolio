/**
 * Seed script: populates MongoDB with sample projects.
 * Run with: npx tsx src/lib/seed.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const MONGO_URI="mongodb+srv://peter:peter1995@cluster0.o4tmp.mongodb.net/portfolio"

if (!MONGO_URI) throw new Error("MONGO_URI not set");

// Inline schema to avoid import issues in script context
const TechSchema = new mongoose.Schema(
  { name: String, category: String, color: String },
  { _id: false }
);
const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    description: String,
    longDescription: String,
    stack: [TechSchema],
    tags: [String],
    imageUrls: [String],
    imagePublicIds: [String],
    thumbnailUrl: String,
    liveUrl: String,
    repoUrl: String,
    featured: Boolean,
    status: String,
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

function slug(s) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
}

const SAMPLES = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with cart, payments, and admin dashboard.",
    stack: [
      { name: "TypeScript", category: "language" },
      { name: "Next.js", category: "framework" },
      { name: "Stripe", category: "tool" },
      { name: "MongoDB", category: "database" },
    ],
    tags: ["ecommerce", "fullstack", "web"],
    featured: true,
    status: "completed",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/ecommerce",
  },
  {
    title: "Real-time Chat App",
    description: "WebSocket-powered chat with rooms, presence, and message history.",
    stack: [
      { name: "JavaScript", category: "language" },
      { name: "Node.js", category: "framework" },
      { name: "Socket.io", category: "tool" },
      { name: "Redis", category: "database" },
    ],
    tags: ["chat", "realtime", "websocket"],
    featured: true,
    status: "completed",
    repoUrl: "https://github.com/example/chat",
  },
  {
    title: "ML Data Pipeline",
    description: "ETL pipeline for processing and transforming large datasets for ML training.",
    stack: [
      { name: "Python", category: "language" },
      { name: "Apache Airflow", category: "tool" },
      { name: "PostgreSQL", category: "database" },
      { name: "Docker", category: "tool" },
    ],
    tags: ["ml", "data", "pipeline", "python"],
    featured: false,
    status: "completed",
    repoUrl: "https://github.com/example/pipeline",
  },
  {
    title: "Mobile Fitness Tracker",
    description: "Cross-platform mobile app for workout tracking with charts and history.",
    stack: [
      { name: "Dart", category: "language" },
      { name: "Flutter", category: "framework" },
      { name: "Firebase", category: "database" },
    ],
    tags: ["mobile", "fitness", "flutter"],
    featured: true,
    status: "completed",
    liveUrl: "https://apps.apple.com/example",
  },
  {
    title: "GraphQL API Gateway",
    description: "Unified GraphQL gateway aggregating multiple microservices.",
    stack: [
      { name: "TypeScript", category: "language" },
      { name: "Apollo Server", category: "framework" },
      { name: "GraphQL", category: "tool" },
      { name: "PostgreSQL", category: "database" },
    ],
    tags: ["api", "graphql", "microservices"],
    featured: false,
    status: "completed",
    repoUrl: "https://github.com/example/graphql-gateway",
  },
  {
    title: "Rust CLI Tool",
    description: "High-performance CLI for processing and transforming JSON/CSV files.",
    stack: [
      { name: "Rust", category: "language" },
      { name: "Clap", category: "tool" },
      { name: "Serde", category: "tool" },
    ],
    tags: ["cli", "rust", "performance"],
    featured: false,
    status: "completed",
    repoUrl: "https://github.com/example/rustcli",
  },
  {
    title: "DevOps Dashboard",
    description: "Internal dashboard for monitoring CI/CD pipelines and deployment status.",
    stack: [
      { name: "Go", category: "language" },
      { name: "React", category: "framework" },
      { name: "Kubernetes", category: "platform" },
      { name: "Prometheus", category: "tool" },
    ],
    tags: ["devops", "monitoring", "kubernetes"],
    featured: false,
    status: "in-progress",
  },
  {
    title: "Browser Extension",
    description: "Chrome extension for saving and organising web snippets with tags.",
    stack: [
      { name: "TypeScript", category: "language" },
      { name: "React", category: "framework" },
      { name: "Chrome APIs", category: "platform" },
    ],
    tags: ["extension", "browser", "productivity"],
    featured: false,
    status: "completed",
    liveUrl: "https://chrome.google.com/example",
    repoUrl: "https://github.com/example/extension",
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  let created = 0;
  let skipped = 0;

  for (const s of SAMPLES) {
    const projectSlug = slug(s.title);
    const existing = await Project.findOne({ slug: projectSlug });
    if (existing) {
      console.log(`  SKIP  ${s.title}`);
      skipped++;
      continue;
    }
    await Project.create({ ...s, slug: projectSlug, thumbnailUrl: "" });
    console.log(`  CREATE ${s.title}`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
