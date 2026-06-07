import "./config/env";
import { PrismaClient } from "./generated/prisma/client";


export const prisma = new PrismaClient();
