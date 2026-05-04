//business logic
//talks to the database and things like that ig
import { prisma } from "../db";


export const getNotes = async (userId: string) => {
    return await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const createNote = async (title: string, content: string, userId: string) => {
    return await prisma.note.create({

        data: {
            title,
            content,
            userId
        },

    });
};


export const updateNote = async (
    id: string | string[],
    title?: string,
    content?: string,
    userId?: string
) => {
    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.update({
        where: {
            id: noteId,
            userId
        },
        data: {
            ...(title != undefined && ({ title })),
            ...(content != undefined && ({ content }))
        },
    });
};

export const deleteNote = async (id: string | string[], userId: string) => {
    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.delete({
        where: {
            id: noteId,
            userId
        },
    });
};