import {genSalt, hash, compare} from "bcrypt" // for encrypting 
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"


export const register = async (req, res, cb) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation} = req.body // getting attributes from request
        const salt = await genSalt(10);
        const passwordEncrypted = await hash(password, salt); // encrypt password for security

        const newUser = new User({ // creting User object
            firstName,
            lastName,
            email,
            password: passwordEncrypted,
            picturePath: req.file.filename,
            friends,
            location,
            occupation,
            viewedProfile: undefined,
            impressions: undefined
        })
        const savedUser = await newUser.save(); // save it to database 
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const login = async (req, res, cb) => {
    try {
        const {email,
            password} = req.body // getting attributes from request
        const currentUser = await User.findOne({email})
        if (!currentUser) {
            return res.status(400).json({message: "User with this email doesn`t exist"})
        }
        const isPasswordCorrect = await compare(password, currentUser.password); // check is password correct
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Password is incorrect"})
        }
        const token = jwt.sign({id: currentUser._id }, process.env.JWT_SECRET_KEY) // creating token for security
        delete currentUser.password // deleting passwort attribute from object
        res.status(200).json({token, user: currentUser}) // send to client token and user info
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}