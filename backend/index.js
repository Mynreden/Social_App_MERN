import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import path from "path"
import mongoose from "mongoose"
import dotenv from "dotenv"
import multer from "multer"
import { register } from "./controllers/auth.js"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import postRouter from "./routes/post.js"

//Some code to get variables from .env file
dotenv.config()

// Debug mode
const useLocalDB = true


// Some constants
const port = process.env.PORT || 3001
const app = express()
const staticDir = path.join(process.cwd(), 'public')
const mongoUrl = useLocalDB ? process.env.MONGO_LOCAL_URL : process.env.MONGO_URL
const serverSelectionTimeoutMS = 1000 // Time in milliseconds twat server will wait to connect to db

// CORS allowed urls
const whitelist = ['localhost:3001', undefined] // urls that can use API(I don know what to do with undefined)
const cors_config = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) != -1){
            return callback(null, true)
        }
        else{
            return callback(new Error("Not allowed by CORS"))
        }
    }
}

// Middlewares
app.use(helmet()) // I dont understand it(something for security)
app.use(morgan("common")) // For logging requests
app.use(cors(cors_config)) // For getting access to API from another domains
app.use(express.json()) // For parsing application/json requests
app.use(bodyParser.urlencoded({extended: true})) // For parsing application/x-www-form-urlencoded requests
app.use('/public', express.static(staticDir)); // We can get elements such as media by url. 
                                               //Example: https://localhost:3001/static/photo/id.png


// Routes
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)

app.get('/', (req, res) => {
    res.send("Hello")
})
                                        
// MongoDB connection
let db = mongoose.Mongoose;
try {
    db = await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS });
} catch (err) {
    console.error(err)
    mongoose.disconnect()
    process.abort()
} 

mongoose.connection.on('connected', () => { // send message after connection
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});


app.listen(port, () =>{
    console.log(`Listening in localhost:${port}`);
})