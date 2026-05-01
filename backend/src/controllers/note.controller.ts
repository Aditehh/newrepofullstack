import { Request, Response } from "express";
import * as noteService from "../services/note.service"
import { createNoteSchema, updateNoteSchema } from "../validators/note.validator";


export const getAllNotes = async (req: Request, res: Response) => {
    const notes = await noteService.getNotes();
    res.json(notes);
}

export const createNewNote = async (req: Request, res: Response) => {

    const parsed = createNoteSchema.parse(req.body)
    const note = await noteService.createNote(
        parsed.title,
        parsed.content
    );

    res.status(201).json(note);

}

export const updateExistingNote = async (req: Request, res: Response) => {
  
    const { id } = req.params;   
        const parsed = updateNoteSchema.parse(req.body);

        const updated = await noteService.updateNote(
            id,
            parsed.title,
            parsed.content

        );

        res.status(201).json(updated);


};

export const deleteExistingNote = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await noteService.deleteNote(id);
    res.json(deleted);
};


