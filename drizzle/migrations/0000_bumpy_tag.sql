CREATE TYPE "public"."type" AS ENUM('multiple_choice', 'true_false');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'teacher', 'student');--> statement-breakpoint
CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"attemptId" integer NOT NULL,
	"questionId" integer NOT NULL,
	"answer" varchar(100),
	"isCorrect" boolean
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"examId" integer NOT NULL,
	"studentId" integer NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"submittedAt" timestamp,
	"score" integer,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"code" varchar(40) NOT NULL,
	"period" varchar(80),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "examQuestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"examId" integer NOT NULL,
	"questionId" integer NOT NULL,
	"position" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"subjectId" integer NOT NULL,
	"classId" integer NOT NULL,
	"teacherId" integer NOT NULL,
	"startsAt" timestamp NOT NULL,
	"endsAt" timestamp NOT NULL,
	"durationMinutes" integer DEFAULT 60 NOT NULL,
	"status" "role" DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"authorId" integer NOT NULL,
	"statement" text NOT NULL,
	"type" "type" NOT NULL,
	"options" text,
	"correctAnswer" varchar(100) NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"code" varchar(40) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'student' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
