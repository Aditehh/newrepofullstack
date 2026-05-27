import { Request, Response } from "express";
import * as noteService from "../services/note.service"
import { createNoteSchema, updateNoteSchema } from "../validators/note.validator";
import AppError from "../utils/AppError";



export const getAllNotes = async (req: Request, res: Response) => {

    try {

        const userId = (req as any).userId;

        const page = Number(req.query.page) || 1;
        console.log("REQ PAGE:", page);

        const limit = Number(req.query.limit) || 10;

        const search = String(req.query.search) || "";

        const notes = await noteService.getNotes(
            userId,
            page,
            limit,
            search
        );
        res.json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: String(error)
        })
    }
}


export const createNewNote = async (req: Request, res: Response) => {

    const parsed = createNoteSchema.parse(req.body)
    const userId = (req as any).userId;
    const note = await noteService.createNote(
        parsed.title,
        parsed.content,
        userId
    );

    res.status(201).json(note);

}

export const updateExistingNote = async (req: Request, res: Response) => {

    const userId = (req as any).userId;
    const { id } = req.params;
    const parsed = updateNoteSchema.parse(req.body);

    const updated = await noteService.updateNote(
        id,
        parsed.title,
        parsed.content,
        userId

    );

    res.status(201).json(updated);


};

export const deleteExistingNote = async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { id } = req.params;


    const deleted = await noteService.deleteNote(id, userId);
    res.json(deleted);
};


