import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) =>{ // in this func we define own middleware to check is user logged in
    try {
        let token = req.header("Authorization"); // every request have Headers. In this middleware i check
                                                 // if request special header that contain token for auth
                                                 // only authorized clients can make request 
        if (!token) {
            return res.status(500).json({message: "Access Denied"})
        }

        if (token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft()
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = verified // in this line i add to reauest objec parameter "user" that contain
                            // object in format {id: "someId"}. it can be accessed by req.user.id 
        next() // this callback need to go to the next middleware or router
    }
    catch (err) {
        return res.status(500).json({message: err.message})
    }

} 