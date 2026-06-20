//business logic
//talks to the database and things like that ig
import { redisClient } from "../config/redis";
import { prisma } from "../db";
import { logger } from "../utils/logger";




export const getNoteById = async (
    noteId: string,
    userId: string
) => {
    return await prisma.note.findFirst({
        where: {
            id: noteId,
            userId: userId,
        },
    });
};







export const getNotes = async (
    userId: string,
    page: number,
    limit: number,
    search: string
) => {

    const skip =
        (page - 1) * limit;




    const cacheKey = `notes:${userId}:page:${page}:limit:${limit}:search:${search}`;

    const cache = await redisClient.get(cacheKey);


    if (cache) {
        logger.info("CACHE HIT");
        return JSON.parse(cache);
    }




    logger.info("CACHE MISS")
    logger.info("QUERYING DATABASE");
    
    const notes = await prisma.note.findMany({
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


    await redisClient.set(cacheKey, JSON.stringify(notes));

    return notes;

};


export const createNote = async (title: string, content: string, userId: string, fileUrl: string | null, filePublicId: string | null) => {

    return await prisma.note.create({

        data: {
            title,
            content,
            userId,
            fileUrl,
            filePublicId
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


export const deleteNote = async (id: string | string[], userId: string) => {

    const noteId = Array.isArray(id) ? id[0] : id;

    return await prisma.note.delete({
        where: {
            id: noteId,
            userId,

        },
    });
};

