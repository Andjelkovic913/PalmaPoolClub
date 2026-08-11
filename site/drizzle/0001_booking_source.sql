ALTER TABLE "bookings" ADD COLUMN "source" text DEFAULT 'online' NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "note" text;