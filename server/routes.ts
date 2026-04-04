import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { setupAuth } from "./auth";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "client/public/uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storageConfig,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  setupAuth(app);

  // Serve uploads statically (though client/public is already served by Vite, 
  // we might need this if we were serving strictly from backend, but Vite handles it in dev.
  // In prod, serveStatic handles it. We just need to make sure the path is correct).
  // The files will be at /uploads/filename.ext
  
  // === TEACHERS ===

  app.get(api.teachers.list.path, async (req, res) => {
    const teachers = await storage.getTeachers();
    res.json(teachers);
  });

  app.get(api.teachers.get.path, async (req, res) => {
    const teacher = await storage.getTeacher(Number(req.params.id));
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  });

  app.post(api.teachers.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const isAdmin = ["2025100000379@seu.edu.bd", "2025100000403@seu.edu.bd"].includes(user.email);
    if (!isAdmin && user.role !== "moderator") {
      return res.status(403).json({ message: "Forbidden: Admin or Moderator only" });
    }
    try {
      const input = api.teachers.create.input.parse(req.body);
      const teacher = await storage.createTeacher(input);
      res.status(201).json(teacher);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.put(api.teachers.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const isAdmin = ["2025100000379@seu.edu.bd", "2025100000403@seu.edu.bd"].includes(user.email);
    if (!isAdmin && user.role !== "moderator") {
      return res.status(403).json({ message: "Forbidden: Admin or Moderator only" });
    }
    try {
      const input = api.teachers.update.input.parse(req.body);
      const updated = await storage.updateTeacher(Number(req.params.id), input);
      if (!updated) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete(api.teachers.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const isAdmin = ["2025100000379@seu.edu.bd", "2025100000403@seu.edu.bd"].includes(user.email);
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }
    const id = Number(req.params.id);
    const success = await storage.deleteTeacher(id);
    if (!success) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(204).send();
  });

  // User Roles Management (Admin Only)
  app.patch("/api/admin/users/role", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const user = req.user as any;
    const isAdmin = ["2025100000379@seu.edu.bd", "2025100000403@seu.edu.bd"].includes(user.email);
    if (!isAdmin) return res.status(403).send("Forbidden: Admin only");

    const { email, role } = req.body;
    if (!email || !role) return res.status(400).send("Missing email or role");

    const updated = await storage.updateUserRole(email, role);
    if (!updated) return res.status(404).send("User not found");

    res.json(updated);
  });

  // === REVIEWS ===

  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviewsByTeacherId(Number(req.params.teacherId));
    
    // Filter sensitive info based on role
    const isAdmin = req.isAuthenticated() && (req.user as any).email === "2025100000379@seu.edu.bd";
    
    const sanitized = reviews.map(r => ({
      ...r,
      studentUsername: isAdmin ? r.studentEmail : "Anonymous Student",
      studentEmail: isAdmin ? r.studentEmail : undefined
    }));

    res.json(sanitized);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to submit a review" });
    }
    try {
      const input = api.reviews.create.input.parse(req.body);
      const studentId = (req.user as any).id;
      
      // Check if already reviewed for this specific course
      const existing = await storage.getReviewByStudentTeacherCourse(studentId, input.teacherId, input.courseTaken);
      if (existing) {
        return res.status(409).json({ message: "You have already submitted a review for this faculty in this course." });
      }

      if (!input.termsAccepted) {
        return res.status(400).json({ message: "You must agree to the Terms & Conditions before submitting a review." });
      }

      const review = await storage.createReview({ ...input, studentId });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.put(api.reviews.update.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const reviewId = Number(req.params.id);
      const existing = await storage.getReview(reviewId);
      if (!existing) {
        return res.status(404).json({ message: "Review not found" });
      }

      const isAdmin = (req.user as any).email === "2025100000379@seu.edu.bd";
      
      // Admin can only edit their own reviews. Students can only edit their own reviews.
      if (existing.studentId !== (req.user as any).id) {
        return res.status(403).json({ message: "You can only edit your own reviews" });
      }

      const input = api.reviews.update.input.parse(req.body);
      const updated = await storage.updateReview(reviewId, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete(api.reviews.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const reviewId = Number(req.params.id);
    const existing = await storage.getReview(reviewId);
    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isAdmin = (req.user as any).email === "2025100000379@seu.edu.bd";
    const isOwner = existing.studentId === (req.user as any).id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: You cannot delete this review" });
    }

    await storage.deleteReview(reviewId);
    res.status(204).send();
  });

  // === PYQS ===

  app.get(api.pyqs.list.path, async (req, res) => {
    const pyqs = await storage.getPyqsByTeacherId(Number(req.params.teacherId));
    res.json(pyqs);
  });

  app.post(api.pyqs.create.path, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File is too large. Max size is 10MB." });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const isAdmin = ["2025100000379@seu.edu.bd", "2025100000403@seu.edu.bd"].includes(user.email);
    if (!isAdmin && user.role !== "moderator") {
      return res.status(403).json({ message: "Forbidden: Admin or Moderator only" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Manual parsing since it's FormData
      const teacherId = Number(req.body.teacherId);
      const courseCode = String(req.body.courseCode);
      const semester = req.body.semester as "Spring" | "Summer" | "Fall";
      const examType = req.body.examType as "Mid" | "Final" | "Quiz";
      const year = Number(req.body.year);
      const uploadedBy = (req.user as any).id;
      const fileUrl = `/uploads/${req.file.filename}`;

      console.log("Creating PYQ with data:", { teacherId, courseCode, semester, examType, year, fileUrl, uploadedBy });

      if (!teacherId || !courseCode || !year || !semester || !examType) {
         return res.status(400).json({ message: "Missing required fields in request body" });
      }

      const pyq = await storage.createPyq({
        teacherId,
        courseCode,
        semester,
        examType,
        year,
        fileUrl,
        uploadedBy
      });
      
      res.status(201).json(pyq);
    } catch (err) {
      console.error("PYQ Upload Database Error:", err);
      res.status(500).json({ message: err instanceof Error ? err.message : "Internal server error during database save" });
    }
  });

  // Seed Data
  if (process.env.NODE_ENV !== "production") {
    // Basic seed if needed
  }

  return httpServer;
}
