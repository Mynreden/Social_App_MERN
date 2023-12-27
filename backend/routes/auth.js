import { Router } from "express";
import { login } from "../controllers/auth.js"

const router = Router()

router.post("/login", login) // that controller will work in localhost:3001/auth/login

export default router;
