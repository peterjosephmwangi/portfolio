import mongoose, { Schema, Document, Model } from "mongoose";

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
