import Post from "../models/PostModel";
import User from "../models/UserModel"


export const createPost = async (req, res) => {
    try {
        const { userId,
            description,
            picturePath } = req.body;
        const currentUser = await User.findById(userId);   
        const newPost = new Post({
            userId,
            description,
            picturePath,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            location: currentUser.location,
            userPicturePath: currentUser.picturePath,
            likes: {},
            comments: []
        })
        const savedUser = await newPost.save();
        return res.status(200).json(savedUser);
    }
    catch (err) {
        return res.status(409).json({err: err.message})
    } 
}

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    }
    catch (err) {
        return res.status(404).json({err: err.message})
    } 
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({userId});
        return res.status(200).json(posts);
    }
    catch (err) {
        return res.status(404).json({err: err.message})
    }
}

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const {userId} = req.body;
        const post = await Post.findById(postId);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const updatedPost = Post.findByIdAndUpdate(
            postId,
            {likes: post.likes},
            {new: true}) // it needs to return updated object
        return res.status(200).json(updatedPost);
    }
    catch (err) {
        return res.status(404).json({err: err.message})
    }
}