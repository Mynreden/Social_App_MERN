import { Router } from "express";
import { login, register } from "../controllers/auth.js"
import multer from "multer";

const router = Router()
// upload files
const storage = multer.diskStorage({ // in this line we define Strorage for multer
    destination: (req, file, callback) => {
        callback(null, "../public/avatars") // callback(err: Error, destination: String)
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname) // callback(err: Error, detination: String)
    }
})
const upload = multer({storage}) // multer middlware uses form data files and transform it into req.file(upload.sindle()) 
                                 // or req.files(upload.array())


// Routes
router.post('/register', upload.single('picture'), register) // route for registration
router.get("/login", login) // that controller will work in localhost:3001/auth/login

export default router;
