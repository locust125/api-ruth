import { Router } from "express";
import * as user from "../controllers/user.controller.js";
import * as verify from "../middleware/authJwt.js";
import {validateCreateUser}  from "../validators/users.js"

const router = Router();

router.put("/update/user/:id",validateCreateUser,verify.verifyToken,user.updateUser);


export default router;
