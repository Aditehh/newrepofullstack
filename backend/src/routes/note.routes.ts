import express from "express";
import {
  getAllNotes,
  createNewNote,
  updateExistingNote,
  deleteExistingNote,
} from "../controllers/note.controller";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNewNote);
router.put("/:id", updateExistingNote);
router.delete("/:id", deleteExistingNote);

export default router;