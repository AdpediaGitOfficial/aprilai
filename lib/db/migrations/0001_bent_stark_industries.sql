-- pgvector must exist before any `vector` column is created.
CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TABLE "document_chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"user_id" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"content_type" text DEFAULT 'text/plain' NOT NULL,
	"byte_size" integer DEFAULT 0 NOT NULL,
	"chunk_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'ready' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "document_chunks_document_id_idx" ON "document_chunks" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "documents_user_id_idx" ON "documents" USING btree ("user_id");--> statement-breakpoint
-- Approximate-nearest-neighbor index for cosine similarity search over embeddings.
CREATE INDEX IF NOT EXISTS "document_chunks_embedding_idx" ON "document_chunks" USING hnsw ("embedding" vector_cosine_ops);