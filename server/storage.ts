import { 
  users, teachers, reviews, pyqs,
  type User, type InsertUser,
  type Teacher, type InsertTeacher, type TeacherWithReviewCount,
  type Review, type InsertReview,
  type Pyq, type InsertPyq
} from "@shared/schema";
import { db } from "./db";
import { eq, count, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Teachers
  getTeachers(): Promise<TeacherWithReviewCount[]>;
  getTeacher(id: number): Promise<TeacherWithReviewCount | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;

  // Reviews
  getReviewsByTeacherId(teacherId: number): Promise<(Review & { studentUsername: string })[]>;
  getReview(id: number): Promise<Review | undefined>;
  getReviewByStudentAndTeacher(studentId: number, teacherId: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<void>;

  // PYQs
  getPyqsByTeacherId(teacherId: number): Promise<Pyq[]>;
  createPyq(pyq: InsertPyq): Promise<Pyq>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Teachers
  async getTeachers(): Promise<TeacherWithReviewCount[]> {
    // Left join reviews to count them
    const result = await db
      .select({
        teacher: teachers,
        reviewCount: count(reviews.id),
      })
      .from(teachers)
      .leftJoin(reviews, eq(teachers.id, reviews.teacherId))
      .groupBy(teachers.id);

    return result.map(({ teacher, reviewCount }) => ({
      ...teacher,
      reviewCount: Number(reviewCount),
    }));
  }

  async getTeacher(id: number): Promise<TeacherWithReviewCount | undefined> {
    const [result] = await db
      .select({
        teacher: teachers,
        reviewCount: count(reviews.id),
      })
      .from(teachers)
      .leftJoin(reviews, eq(teachers.id, reviews.teacherId))
      .where(eq(teachers.id, id))
      .groupBy(teachers.id);

    if (!result) return undefined;

    return {
      ...result.teacher,
      reviewCount: Number(result.reviewCount),
    };
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [newTeacher] = await db.insert(teachers).values(teacher).returning();
    return newTeacher;
  }

  async updateTeacher(id: number, updates: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const [updated] = await db
      .update(teachers)
      .set(updates)
      .where(eq(teachers.id, id))
      .returning();
    return updated;
  }

  // Reviews
  async getReviewsByTeacherId(teacherId: number): Promise<(Review & { studentUsername: string; studentEmail: string | null })[]> {
    const result = await db
      .select({
        review: reviews,
        student: users,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.studentId, users.id))
      .where(eq(reviews.teacherId, teacherId));

    return result.map(({ review, student }) => ({
      ...review,
      studentUsername: student.username,
      studentEmail: student.email,
    }));
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewByStudentAndTeacher(studentId: number, teacherId: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.studentId, studentId),
          eq(reviews.teacherId, teacherId)
        )
      );
    return review;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: number, updates: Partial<InsertReview>): Promise<Review | undefined> {
    const [updated] = await db
      .update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return updated;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // PYQs
  async getPyqsByTeacherId(teacherId: number): Promise<Pyq[]> {
    return await db.select().from(pyqs).where(eq(pyqs.teacherId, teacherId));
  }

  async createPyq(pyq: InsertPyq): Promise<Pyq> {
    const [newPyq] = await db.insert(pyqs).values(pyq).returning();
    return newPyq;
  }
}

export const storage = new DatabaseStorage();
