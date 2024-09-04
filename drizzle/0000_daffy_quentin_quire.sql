CREATE TABLE IF NOT EXISTS "organization_member_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationSlug" text NOT NULL,
	"receiver" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_member" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationSlug" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userName" text,
	"email" text NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_userName_unique" UNIQUE("userName"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member_requests" ADD CONSTRAINT "organization_member_requests_organizationSlug_organizations_slug_fk" FOREIGN KEY ("organizationSlug") REFERENCES "public"."organizations"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member_requests" ADD CONSTRAINT "organization_member_requests_receiver_users_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organizationSlug_organizations_slug_fk" FOREIGN KEY ("organizationSlug") REFERENCES "public"."organizations"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
