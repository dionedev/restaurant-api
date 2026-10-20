import { Router } from "express";
import { validadeSchema } from "./middlewares/validadeSchema";
import {
  authUserSchema,
  createUserSchema,
} from "./schemas/user/createUserSchema";
import { CreateUserController } from "./controller/user/CreateUserController";
import { AuthUserController } from "./controller/user/AuthUserController";
import { DetailUserController } from "./controller/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controller/category/CreateCategoryController";
import { ListCategoryController } from "./controller/category/ListCategoryController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategorySchema } from "./schemas/category/createCategorySchema";

const router = Router();
const createUserController = new CreateUserController();
const authUserController = new AuthUserController();
const detailUserController = new DetailUserController();
const createCategoryController = new CreateCategoryController();
const listCategoryController = new ListCategoryController();

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

router.get("/me", isAuthenticated, detailUserController.handle);

router.get("/category", isAuthenticated, listCategoryController.handle);

router.post(
  "/category",
  validadeSchema(createCategorySchema),
  isAuthenticated,
  isAdmin,
  createCategoryController.handle,
);

export { router };
