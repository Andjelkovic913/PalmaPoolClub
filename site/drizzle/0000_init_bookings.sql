CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visit_date" date NOT NULL,
	"ticket" text DEFAULT 'day' NOT NULL,
	"arrival" text DEFAULT 'full' NOT NULL,
	"adults" integer NOT NULL,
	"children" integer NOT NULL,
	"under4" integer NOT NULL,
	"sunbeds" integer NOT NULL,
	"total_rsd" integer NOT NULL,
	"guest_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"decision_token" text NOT NULL,
	"decided_at" timestamp with time zone,
	"ip" text,
	CONSTRAINT "bookings_decision_token_unique" UNIQUE("decision_token")
);
--> statement-breakpoint
CREATE TABLE "day_capacity" (
	"day" date PRIMARY KEY NOT NULL,
	"capacity" integer NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE INDEX "bookings_visit_date_idx" ON "bookings" USING btree ("visit_date");--> statement-breakpoint
CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
--
-- SECURITY: shut the tables off from Supabase's public API.
--
-- Supabase exposes every table in the `public` schema through PostgREST, and
-- the anon key is by definition public — it ships in any browser bundle that
-- uses it. Without this, that key would read every booking: guests' names,
-- phone numbers and email addresses.
--
-- This app never uses PostgREST. It connects as the `postgres` role over the
-- session pooler, and that role BYPASSES row-level security, so enabling RLS
-- with no policies at all blocks the public API completely while the
-- application keeps full access. No policy is missing here — the absence of
-- policies is the lock.
--
-- If anyone later wants the Supabase JS client or the dashboard's anon access,
-- they must add explicit policies and think about what they are exposing.
--
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "day_capacity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
REVOKE ALL ON TABLE "bookings" FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON TABLE "day_capacity" FROM anon, authenticated;