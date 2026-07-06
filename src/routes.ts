import { Router } from "express";
import { validadeSchema } from "./middlewares/validadeSchema";
import {
  authUserSchema,
  createUserSchema,
} from "./schemas/user/createUserSchema";
import { CreateUserController } from "./controller/user/CreateUserController";
import { AuthUserController } from "./controller/user/AuthUserController";

const router = Router();
const createUserController = new CreateUserController();
const authUserController = new AuthUserController();

router.post(
  "/users",
  validadeSchema(createUserSchema),
  createUserController.handle,
);

router.post(
  "/session",
  validadeSchema(authUserSchema),
  authUserController.handle,
);

export { router };
