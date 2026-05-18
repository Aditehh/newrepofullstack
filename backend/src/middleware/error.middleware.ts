import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {


  console.error(err);




  // Zod validation error
  if (err instanceof ZodError) { //checks if this error was created by zod

    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues,
    });

  }


  // Prisma errors (basic)
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  // Default error
  // res.status(err.statusCode || 500).json({
  //   success: false,
  //   message:
  //     err.message ||
  //     "Internal Server Error",
  // });

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.message || "Internal server Error",
  })
};

// normal middleware has (req,res,next) but error middleware has (err, req,res,next)
// four params and thats how express recognizes that this middleware handles errors 