import { z } from "zod";

export const createNoteSchema = z.object({
    title: z.string().trim().min(1, "title is required"),
    content: z.string().trim().min(1, "content is required"),
    // file: z.any().optional(),
});

export const updateNoteSchema = z.object({
    title: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional()
});

// new problem when i click the register or login when theres nothing written on it, it does go to the database and hashes the null field into a hashed password

