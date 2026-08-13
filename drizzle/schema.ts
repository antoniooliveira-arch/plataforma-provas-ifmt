import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, datetime } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "teacher", "student"]).default("student").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  period: varchar("period", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  subjectId: int("subjectId").notNull(),
  classId: int("classId").notNull(),
  teacherId: int("teacherId").notNull(),
  startsAt: datetime("startsAt").notNull(),
  endsAt: datetime("endsAt").notNull(),
  durationMinutes: int("durationMinutes").notNull().default(60),
  status: mysqlEnum("status", ["draft", "scheduled", "closed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  statement: text("statement").notNull(),
  type: mysqlEnum("type", ["multiple_choice", "true_false"]).notNull(),
  options: text("options"),
  correctAnswer: varchar("correctAnswer", { length: 100 }).notNull(),
  points: int("points").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const examQuestions = mysqlTable("examQuestions", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("examId").notNull(),
  questionId: int("questionId").notNull(),
  position: int("position").notNull().default(1),
});

export const attempts = mysqlTable("attempts", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("examId").notNull(),
  studentId: int("studentId").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  submittedAt: timestamp("submittedAt"),
  score: int("score"),
  completed: boolean("completed").notNull().default(false),
});

export const answers = mysqlTable("answers", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull(),
  questionId: int("questionId").notNull(),
  answer: varchar("answer", { length: 100 }),
  isCorrect: boolean("isCorrect"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Exam = typeof exams.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
