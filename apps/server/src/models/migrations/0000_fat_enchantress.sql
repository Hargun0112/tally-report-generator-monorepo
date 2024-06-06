CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(128) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"can_create" boolean DEFAULT false NOT NULL,
	"can_read" boolean DEFAULT false NOT NULL,
	"can_update" boolean DEFAULT false NOT NULL,
	"can_delete" boolean DEFAULT false NOT NULL,
	"can_import" boolean DEFAULT false NOT NULL,
	"can_export" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission_role" (
	"permission_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assignedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "permission_role_permission_id_role_id_pk" PRIMARY KEY("permission_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assignedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "user_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permission_role" ADD CONSTRAINT "permission_role_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permission_role" ADD CONSTRAINT "permission_role_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
