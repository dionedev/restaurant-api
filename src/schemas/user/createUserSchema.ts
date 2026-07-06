import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: "O nome precisa ter no mínimo 2 caracteres" }),
    email: z.email({ message: "Email inválido" }),
    password: z
      .string("A senha é obrigatória")
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
      .regex(/[a-z].*[A-Z]|[A-Z].*[a-z]/, {
        message: "A senha deve conter letras maiúsculas e minúsculas",
      }),
  }),
});

const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: "Email inválido" }),
    password: z
      .string("A senha é obrigatória")
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
  }),
});

export { createUserSchema, authUserSchema };
