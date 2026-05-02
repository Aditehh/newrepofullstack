import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
console.log("authservice jwt is ",JWT_SECRET)

export const register = async (email: string, password: string) => {

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });

  return user;
};

export const login = async (email: string, password: string) => {

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};