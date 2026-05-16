import { Request, Response, NextFunction } from "express";


export const asyncHandler = (
    fn: Function  // this shit is the controller function
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        Promise.resolve(  // means run controller function
            fn(req, res, next)
        ).catch(next);
    }
}

// if successful => nothing happens and request completes normally
// else promise rejects -> .catch(next) -> runs -> automatically forwards error to error middleware without try/catch