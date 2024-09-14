CREATE TABLE IF NOT EXISTS "organization_board" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"title" text NOT NULL,
	"authorId" text NOT NULL,
	"isFavorite" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_board" ADD CONSTRAINT "organization_board_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_board" ADD CONSTRAINT "organization_board_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
