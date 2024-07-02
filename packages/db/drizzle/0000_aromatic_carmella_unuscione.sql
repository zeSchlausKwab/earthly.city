CREATE TABLE IF NOT EXISTS "communities" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" serial NOT NULL,
	"pubkey" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"content" jsonb NOT NULL,
	"tags" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "features" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" serial NOT NULL,
	"pubkey" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"content" jsonb NOT NULL,
	"tags" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" serial NOT NULL,
	"pubkey" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"content" text NOT NULL,
	"tags" jsonb NOT NULL,
	"event_id" text NOT NULL
);
