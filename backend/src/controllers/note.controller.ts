import { Request, Response } from "express";
import * as noteService from "../services/note.service"
import { createNoteSchema, updateNoteSchema } from "../validators/note.validator";
import AppError from "../utils/AppError";
import { logger } from "../utils/logger";



export const getAllNotes = async (req: Request, res: Response) => {

    try {
        logger.info({ note: (req as any).body }, "request received")
        const userId = (req as any).userId;

        const page = Number(req.query.page) || 1;
        // console.log("REQ PAGE:", page);
        logger.info({ page: req.query.page }, "opened page number")

        const limit = Number(req.query.limit) || 10;

        const search = String(req.query.search) || "";

        const notes = await noteService.getNotes(
            userId,
            page,
            limit,
            search
        );
        logger.info({ userId, page, count: notes.length }, "response note page generated")
        res.json(notes);
    } catch (error) {
        console.log(error);
        logger.error({
            error
        }, "note request failed")
        res.status(500).json({
            success: false,
            message: String(error)
        })
    }
}


export const createNewNote = async (req: Request, res: Response) => {
    try {

        const parsed = createNoteSchema.parse(req.body)
        const userId = (req as any).userId;



        logger.info({ userId }, "create note request reveived")

        const result = await noteService.createNote(
            parsed.title,
            parsed.content,
            userId,
            parsed.file
        );


        logger.info({
            noteId: result.id,
            title: result.title,
            content: result.content,
            file: result.file,
            userId
        },
            "note created")

        res.status(201).json(result);
    } catch (error) {
        logger.error({
            error
        }, "note creation failed")

        res.status(400).json({
            success: false,
            message: String(error)
        })
    }

}

export const updateExistingNote = async (req: Request, res: Response) => {
    try {

        const userId = (req as any).userId;
        logger.info({ userId }, "update request received")
        const { id } = req.params;
        const parsed = updateNoteSchema.parse(req.body);

        const updated = await noteService.updateNote(
            id,
            parsed.title,
            parsed.content,
            userId


        );
        logger.info({
            noteId: id,
            title: updated.title,
            userId
        }, "update note done")

        res.status(201).json(updated);
    } catch (error) {
        logger.error({ error }, "update note failed");
        res.status(400).json({
            success: false,
            message: String(error)
        })
    }


};

export const deleteExistingNote = async (req: Request, res: Response) => {
    try {

        const userId = (req as any).userId
        const { id } = req.params;


        const deleted = await noteService.deleteNote(id, userId);
        res.json(deleted);
        logger.info("Note deleted")
    } catch (error) {
        logger.error({ error }, "deletion failed")
        res.status(400).json({
            success: false,
            message: String(error)
        })
    }
};


export const uploadFile = async (
    req: Request, res: Response
) => {
    console.log(req.file)

    return res.status(200).json({
        success: true,
        file: req.file
    })
}

