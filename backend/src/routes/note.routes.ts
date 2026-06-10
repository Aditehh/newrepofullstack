import express from "express";
import {
  getAllNotes,
  createNewNote,
  updateExistingNote,
  deleteExistingNote,
} from "../controllers/note.controller";
import { upload } from "../middleware/upload.middleware";

import { authMiddleware } from "../middleware/auth.middleware";
import { notesLimiter } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { createNoteSchema } from "../validators/note.validator";

const router = express.Router();

router.get("/", authMiddleware, getAllNotes);
router.post("/", authMiddleware, upload.single("file"), validate(createNoteSchema), createNewNote);
router.put("/:id", authMiddleware, validate(createNoteSchema), updateExistingNote);
router.delete("/:id", authMiddleware, deleteExistingNote);


export default router;