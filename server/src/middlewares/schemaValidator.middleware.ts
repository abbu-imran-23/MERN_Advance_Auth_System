/******************* Imports *********************/
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";

/** Schema Validator **/
const validateSchema =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.issues[0].message,
      });
    }
  };

export default validateSchema;
