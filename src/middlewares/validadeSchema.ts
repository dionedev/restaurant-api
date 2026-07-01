import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { issue } from "zod/v4/core/util.cjs";

export const validadeSchema =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Erro validação",
          details: error.issues.map((issue) => ({
            campo: issue.path.slice(1).join("."),
            message: issue.message,
          })),
        });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };
