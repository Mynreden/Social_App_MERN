import { Router } from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/user.js"
import { verifyToken } from "../middlewares/auth.js";

const router = Router()

router.use(verifyToken)
router.get("/:id", getUser)
router.get("/:id/friends", getUserFriends)

router.patch

export default router;
