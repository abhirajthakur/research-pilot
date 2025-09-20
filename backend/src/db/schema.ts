import {
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const taskStatusEnum = pgEnum("task_status", [
  "queued",
  "running",
  "completed",
  "failed",
  "completed_with_warnings",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const researchRequests = pgTable("research_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  topic: text("topic").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workflowLogs = pgTable("workflow_logs", {
  id: serial("id").primaryKey(),
  requestId: uuid("request_id")
    .notNull()
    .references(() => researchRequests.id, { onDelete: "cascade" }),
  step: varchar("step", { length: 50 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const researchResults = pgTable("research_results", {
  id: serial("id").primaryKey(),
  requestId: uuid("request_id")
    .notNull()
    .references(() => researchRequests.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull(),
  articles: jsonb("articles")
    .$type<{ title: string; url: string; summary: string }[]>()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(researchRequests),
}));

export const researchRequestsRelations = relations(
  researchRequests,
  ({ one, many }) => ({
    user: one(users, {
      fields: [researchRequests.userId],
      references: [users.id],
    }),
    logs: many(workflowLogs),
    results: many(researchResults),
  }),
);

export const workflowLogsRelations = relations(workflowLogs, ({ one }) => ({
  request: one(researchRequests, {
    fields: [workflowLogs.requestId],
    references: [researchRequests.id],
  }),
}));

export const researchResultsRelations = relations(
  researchResults,
  ({ one }) => ({
    request: one(researchRequests, {
      fields: [researchResults.requestId],
      references: [researchRequests.id],
    }),
  }),
);
