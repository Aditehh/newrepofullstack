import { z } from "zod";

export const createNoteSchema = z.object({
    title: z.string().trim().min(1, "title is required"),
    content: z.string().trim().min(1, "content is required")
});

export const updateNoteSchema = z.object({
    title: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional()
});

