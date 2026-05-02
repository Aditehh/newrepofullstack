//business logic
//talks to the database and things like that ig
import { prisma } from "../db";

export const getNotes = async () => {
    return await prisma.note.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const createNote = async (title: string, content: string) => {
    return await prisma.note.create({

        data: { title, content },

    });
};

export const updateNote = async (
    id: string | string[],
    title?: string,
    content?: string
) => {
    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.update({
        where: { id: noteId },
        data: {
            ...(title != undefined && ({ title })),
            ...(content != undefined && ({ content }))
        },
    });
};

export const deleteNote = async (id: string | string[]) => {
    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.delete({
        where: { id: noteId },
    });
};