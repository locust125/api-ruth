import { Router } from "express";
import * as login from "../controllers/login.controller.js"
import { verifyDuplicateEmail } from "../middleware/verifySignup.js";
import {validateCreateUser}  from "../validators/users.js"

const router = Router();


router.post("/register",validateCreateUser,verifyDuplicateEmail,login.signUpUser );
router.post("/login", login.sigInUser);



export default router;