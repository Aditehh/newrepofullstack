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


    console.log("getnotes service called ")

    const cacheKey = `notes:${userId}:page:${page}:limit:${limit}:search:${search?.trim() || ""}`;
    console.log("cachekey is ", cacheKey)
    console.log("Redis open? ", redisClient.isOpen)
    const cache = await redisClient.get(cacheKey);
    console.log("cache is ", cache)


    if (cache) {
        logger.info("CACHE HIT");
        console.log("CACHE HITT")
        return JSON.parse(cache);
    }

    logger.info("CACHE MISS")
    console.log("CACHE MISS")
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

    const newNotes = await prisma.note.create({

        data: {
            title,
            content,
            userId,
            fileUrl,
            filePublicId
        },


    });

    const keys = await redisClient.keys(`notes:${userId}:*`);

    console.log("found cache keys ", keys)

    if (keys.length > 0) {
        await redisClient.del(keys)
    };

    return newNotes;

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

