import express from "express";
import {
  getAllNotes,
  createNewNote,
  updateExistingNote,
  deleteExistingNote,
} from "../controllers/note.controller";
import {
  registerUser,
  loginUser
} from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getAllNotes);
router.post("/", authMiddleware, createNewNote);
router.put("/:id", authMiddleware, updateExistingNote);
router.delete("/:id", authMiddleware, deleteExistingNote);


export default router;