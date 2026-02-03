import { db } from "../server/db";
import { users, teachers, reviews, pyqs } from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function runSeed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(reviews);
  await db.delete(pyqs);
  await db.delete(teachers);
  await db.delete(users);

  const adminPassword = await hashPassword("admin");
  const [admin] = await db.insert(users).values({
    username: "admin",
    password: adminPassword,
    role: "admin",
    email: "admin@university.edu"
  }).returning();
  console.log("Created admin user");

    const studentPassword = await hashPassword("student");
    const [student] = await db.insert(users).values({
      username: "student",
      password: studentPassword,
      role: "student",
      email: "student@university.edu"
    }).returning();
    console.log("Created student user");

    // Teachers
    const [t1] = await db.insert(teachers).values({
      fullName: "Dr. Alan Turing",
      department: "Computer Science",
      university: "Cambridge",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg",
      coursesTaught: ["Algorithms", "Cryptography"],
    }).returning();

    const [t2] = await db.insert(teachers).values({
      fullName: "Marie Curie",
      department: "Physics",
      university: "Sorbonne",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg",
      coursesTaught: ["Radioactivity", "Chemistry 101"],
    }).returning();
    console.log("Created teachers");

    // Reviews
    await db.insert(reviews).values({
      teacherId: t1.id,
      studentId: student.id,
      personality: "Strict",
      bestFor: "Strong",
      markingStyle: "Strict",
      questionDifficulty: "Hard",
      comment: "Very challenging but rewarding.",
    });
    console.log("Created review");

    // PYQs
    await db.insert(pyqs).values({
      teacherId: t1.id,
      subject: "Algorithms",
      year: 2023,
      fileUrl: "https://example.com/pyq.pdf",
      uploadedBy: admin.id,
    });
    console.log("Created PYQ");
}

runSeed().catch(console.error);
