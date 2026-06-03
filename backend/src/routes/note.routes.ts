import express from "express";
import {
  getAllNotes,
  createNewNote,
  updateExistingNote,
  deleteExistingNote,
} from "../controllers/note.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { notesLimiter } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { createNoteSchema } from "../validators/note.validator";

const router = express.Router();

router.get("/", authMiddleware, getAllNotes);
router.post("/", authMiddleware, validate(createNoteSchema), createNewNote);
router.put("/:id", authMiddleware, updateExistingNote);
router.delete("/:id", authMiddleware, deleteExistingNote);


export default router;