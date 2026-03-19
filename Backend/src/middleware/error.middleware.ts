import { Request,Response, NextFunction } from "express";
import { IsUnknown } from "mongoose";
import { HttpStatus } from "../constants/status.constant.js";
import { HttpResponse } from "../constants/messages.constant.js";

export const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);

    if(err instanceof Error){
        return res.status(HttpStatus.BAD_REQUEST).json({
            success:false,
            message: err.message
        })
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:HttpResponse.SERVER_ERROR
    })
}