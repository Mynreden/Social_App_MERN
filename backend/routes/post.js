import multer from "multer"
import { Router } from "express"
import { createPost, getFeedPosts, getUserPosts, likePost } from "../controllers/post.js"
import { verifyToken } from "../middlewares/auth.js"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../public/posts")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
    })
const upload = multer({storage})
const router = Router()

router.post("/create", verifyToken, upload.single("picture"), createPost)
router.get('/feed', verifyToken, getFeedPosts)
router.get('/:userId', getUserPosts)
router.patch('/:postId',verifyToken, likePost)


export default router;