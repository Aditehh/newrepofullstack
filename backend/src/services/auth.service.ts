import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { logger } from "../utils/logger";



const JWT_SECRET = process.env.JWT_SECRET!;
console.log("authservice jwt is ", JWT_SECRET)


export const register = async (email: string, password: string) => {

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error(
      "user already exists"
    )

  }

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

  // if (!user) throw new Error("User not found");
  if (!user) {
    throw new AppError(
      "User not found",
      404
    )
  }

  const valid = await bcrypt.compare(password, user.password);

  // if (!valid) throw new Error("Invalid password");
  if (!valid) {
    throw new AppError(
      "Invalid password",
      401
    )
  }


  const accessToken = jwt.sign( // this shit is short lived 
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  )

  const refreshToken = jwt.sign( //this shit is long lived 
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  )


  // const token = jwt.sign(
  //   { userId: user.id },
  //   JWT_SECRET,
  //   { expiresIn: "1d" }
  // );

  return { accessToken, refreshToken, email };
};