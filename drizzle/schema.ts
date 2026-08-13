import { pgTable, integer, pgEnum, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const roles = pgEnum("role", ["user", "admin", "teacher", "student"]);
export const questionType = pgEnum("type", ["multiple_choice", "true_false"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roles("role").default("student").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  period: varchar("period", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  subjectId: integer("subjectId").notNull(),
  classId: integer("classId").notNull(),
  teacherId: integer("teacherId").notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  durationMinutes: integer("durationMinutes").notNull().default(60),
  status: varchar("status", { length: 64 }).default("student").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  authorId: integer("authorId").notNull(),
  statement: text("statement").notNull(),
  type: questionType("type").notNull(),
  options: text("options"),
  correctAnswer: varchar("correctAnswer", { length: 100 }).notNull(),
  points: integer("points").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const examQuestions = pgTable("examQuestions", {
  id: serial("id").primaryKey(),
  examId: integer("examId").notNull(),
  questionId: integer("questionId").notNull(),
  position: integer("position").notNull().default(1),
});

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  examId: integer("examId").notNull(),
  studentId: integer("studentId").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  submittedAt: timestamp("submittedAt"),
  score: integer("score"),
  completed: boolean("completed").notNull().default(false),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attemptId").notNull(),
  questionId: integer("questionId").notNull(),
  answer: varchar("answer", { length: 100 }),
  isCorrect: boolean("isCorrect"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Exam = typeof exams.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;