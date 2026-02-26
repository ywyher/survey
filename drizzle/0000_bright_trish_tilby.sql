CREATE TYPE "public"."activity_level_enum" AS ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."joint_enum" AS ENUM('knee', 'hip', 'hand', 'shoulder', 'spine');--> statement-breakpoint
CREATE TYPE "public"."occupation_enum" AS ENUM('office_work', 'hard_manual_labor', 'housewife', 'outdoor_work', 'light_to_moderate_activity');--> statement-breakpoint
CREATE TABLE "survey" (
	"id" text PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender_enum" NOT NULL,
	"occupation" "occupation_enum" NOT NULL,
	"is_diagnosed" text NOT NULL,
	"affected_joints" "joint_enum"[],
	"has_chronic_pain" text NOT NULL,
	"activity_level" "activity_level_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
