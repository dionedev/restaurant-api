import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ error: "Categoria precisa ser um texto" }).min(2, {
      error: "Nome da categoria precisa ter no mínimo 2 caracteres",
    }),
  }),
});
