import { NextFunction, Request, Response } from "express";
import * as noteService from "../services/note.service"
import { createNoteSchema, updateNoteSchema } from "../validators/note.validator";
import AppError from "../utils/AppError";
import { logger } from "../utils/logger";
import { uploadToCloudinary } from "../services/upload.service";
import { file, object, string, success } from "zod";
import { delteFromCloudinary } from "../services/upload.service";
import cloudinary from "../config/cloudinary";


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


export const createNewNote = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = createNoteSchema.parse(req.body)
        const userId = (req as any).userId;

        const file = req.file;


        // const filePath = file ? `/uploads/${file.filename}` : null;


        let cloudUrl = null;

        if (file) {
            cloudUrl = await uploadToCloudinary(
                file.path
            )
        }
        console.log("file path is ", file?.path)

        const filePublicId = cloudUrl?.filePublicId ?? null;
        const fileUrl = cloudUrl?.fileUrl ?? null

        console.log("body", req.body)
        console.log("file", req.file)
        console.log("file path", req.file?.path)
        console.log("fileUrl is ", fileUrl)
        console.log("cloudUrl is ", cloudUrl);



        logger.info({ userId }, "create note request reveived")

        const result = await noteService.createNote(
            parsed.title,
            parsed.content,
            userId,
            fileUrl,
            filePublicId,
        );
        console.log("result is ", result);

        logger.info({
            noteId: result.id,
            title: result.title,
            content: result.content,
            fileUrl: result.fileUrl,
            userId,
            filepublicIdis: filePublicId
        },
            "note created")

        res.status(201).json(result);

    } catch (error) {
        logger.error({
            error
        }, "note creation failed")

        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong"

        })
        // next(error);
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

        const userId = (req as any).userId;
        // const { public_id } = req.body;
        const { id } = req.params;
        // const file = req.file;

        // if (!public_id) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Public Id not found"
        //     })
        // }

        // const result = await cloudinary.uploader.destroy(public_id)



        const result = await noteService.deleteNote(id, userId)

        res.status(201).json(result)

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

