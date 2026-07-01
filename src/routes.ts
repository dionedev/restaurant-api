import { Router } from "express";
import { CreateUserController } from "./controller/user/CreateUserController";
import { validadeSchema } from "./middlewares/validadeSchema";
import { createUserSchema } from "./schemas/user/createUserSchema";

const router = Router();
const createUserController = new CreateUserController();

router.post(
  "/users",
  validadeSchema(createUserSchema),
  createUserController.handle,
);

export { router };
