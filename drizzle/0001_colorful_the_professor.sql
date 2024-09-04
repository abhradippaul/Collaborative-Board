ALTER TABLE "organization_member_requests" RENAME COLUMN "organizationSlug" TO "organizationId";--> statement-breakpoint
ALTER TABLE "organization_member" RENAME COLUMN "organizationSlug" TO "organizationId";--> statement-breakpoint
ALTER TABLE "organization_member_requests" DROP CONSTRAINT "organization_member_requests_organizationSlug_organizations_slug_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" DROP CONSTRAINT "organization_member_organizationSlug_organizations_slug_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member_requests" ADD CONSTRAINT "organization_member_requests_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
