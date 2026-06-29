import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDemoCredential {
  role: string;
  label: string;
  username?: string;
  password: string;
  description?: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  stack: Array<{
    name: string;
    category: "language" | "framework" | "database" | "tool" | "platform" | "other";
    color?: string;
  }>;
  tags: string[];
  imageUrls: string[];
  imagePublicIds: string[];
  thumbnailUrl: string;
  thumbnailPublicId?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  startDate?: Date;
  endDate?: Date;
  viewCount: number;
  demoCredentials: IDemoCredential[];
  createdAt: Date;
  updatedAt: Date;
}

const TechSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["language", "framework", "database", "tool", "platform", "other"],
      default: "other",
    },
    color: String,
  },
  { _id: false }
);

// Stored as plaintext intentionally — these are demo/test credentials
// meant to be displayed to visitors, not real user account secrets.
const DemoCredentialSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },       // e.g. "admin", "secretary", "member"
    label: { type: String, required: true, trim: true },      // e.g. "Admin Account"
    username: { type: String, trim: true },                   // optional — only for username+password systems
    password: { type: String, required: true },               // plaintext — intentional for demo display
    description: { type: String, trim: true, maxlength: 200 }, // e.g. "Full access to dashboard"
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 300 },
    longDescription: { type: String, maxlength: 5000 },
    stack: { type: [TechSchema], default: [] },
    tags: { type: [String], default: [] },
    imageUrls: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    thumbnailUrl: { type: String, default: "" },
    thumbnailPublicId: String,
    liveUrl: String,
    repoUrl: String,
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    startDate: Date,
    endDate: Date,
    viewCount: { type: Number, default: 0 },
    demoCredentials: { type: [DemoCredentialSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance with 200+ projects
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });
ProjectSchema.index({ "stack.name": 1 });
ProjectSchema.index({ "stack.category": 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 10, tags: 5, description: 1 } }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;