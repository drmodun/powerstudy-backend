ALTER TYPE "subjects" ADD VALUE 'literature';--> statement-breakpoint
ALTER TYPE "subjects" ADD VALUE 'art';--> statement-breakpoint
ALTER TYPE "subjects" ADD VALUE 'biology';--> statement-breakpoint
ALTER TYPE "subjects" ADD VALUE 'chemistry';--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD COLUMN "language" text DEFAULT 'en' NOT NULL;