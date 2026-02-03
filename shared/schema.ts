import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"), // Admin needs to see this
  role: text("role", { enum: ["admin", "student"] }).default("student").notNull(),
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  department: text("department").notNull(),
  university: text("university").notNull(),
  photoUrl: text("photo_url").notNull(), // URL to image
  coursesTaught: text("courses_taught").array().notNull(), // Postgres array
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(), // Foreign key to teachers
  studentId: integer("student_id").notNull(), // Foreign key to users
  personality: text("personality", { enum: ["Friendly", "Strict", "Neutral"] }).notNull(),
  bestFor: text("best_for", { enum: ["Weak", "Average", "Strong"] }).notNull(),
  markingStyle: text("marking_style", { enum: ["Open-minded", "Average", "Strict"] }).notNull(),
  questionDifficulty: text("question_difficulty", { enum: ["Easy", "Medium", "Hard"] }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pyqs = pgTable("pyqs", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(), // Foreign key to teachers
  subject: text("subject").notNull(),
  year: integer("year").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedBy: integer("uploaded_by").notNull(), // Admin user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === RELATIONS ===

export const teachersRelations = relations(teachers, ({ many }) => ({
  reviews: many(reviews),
  pyqs: many(pyqs),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  teacher: one(teachers, {
    fields: [reviews.teacherId],
    references: [teachers.id],
  }),
  student: one(users, {
    fields: [reviews.studentId],
    references: [users.id],
  }),
}));

export const pyqsRelations = relations(pyqs, ({ one }) => ({
  teacher: one(teachers, {
    fields: [pyqs.teacherId],
    references: [teachers.id],
  }),
  uploader: one(users, {
    fields: [pyqs.uploadedBy],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users);
export const insertTeacherSchema = createInsertSchema(teachers);
export const insertReviewSchema = createInsertSchema(reviews).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertPyqSchema = createInsertSchema(pyqs).omit({ 
  id: true, 
  createdAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Pyq = typeof pyqs.$inferSelect;
export type InsertPyq = z.infer<typeof insertPyqSchema>;

// Extended types for frontend
export type TeacherWithReviewCount = Teacher & {
  reviewCount: number;
};

// Request types
export type CreateReviewRequest = InsertReview;
export type UpdateReviewRequest = Partial<InsertReview>;
export type CreateTeacherRequest = InsertTeacher;
export type UpdateTeacherRequest = Partial<InsertTeacher>;
