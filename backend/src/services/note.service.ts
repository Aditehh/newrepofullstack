//business logic
//talks to the database and things like that ig
import { prisma } from "../db";
import { logger } from "../utils/logger";



export const getNotes = async (
    userId: string,
    page: number,
    limit: number,
    search: string
) => {

    const skip =
        (page - 1) * limit;

    return await prisma.note.findMany({
        where: {
            userId,

            ...(search && {

                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },

                    {
                        content: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },

        skip, // skip belongs on the service because it is a database and business logic and not a HTTP logic my nigga bitch
        take: limit,

        orderBy: { createdAt: "desc" },
    });
};


export const createNote = async (title: string, content: string, userId: string, file: string | null) => {

    return await prisma.note.create({

        data: {
            title,
            content,
            userId,
            file
        },

    });

};


export const updateNote = async (
    id: string | string[],
    title?: string,
    content?: string,
    userId?: string,

) => {

    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.update({
        where: {
            id: noteId,
            userId
        },
        data: {
            ...(title != undefined && ({ title })),
            ...(content != undefined && ({ content })),

        },
    });
};

export const deleteNote = async (id: string | string[], userId: string,) => {
    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.delete({
        where: {
            id: noteId,
            userId
        },
    });
};

