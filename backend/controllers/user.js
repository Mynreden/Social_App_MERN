import User from "../models/UserModel.js";

export const getUser = async (req, res) => { // get USer info from DB
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if (!user) return res.status(404).json({message: "User not found"})
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const getUserFriends = async (req, res) => { // getting frineds of user
    try {
        const id = req.params.id
        const user = await User.findById(id)

        if (!user) return res.status(404).json({message: "User not found"})

        let friends = await Promise.all(user.friends.map((id) => { // Promise.all() wait for complete all promises
                                                                   // in given iterable object(array)
            return User.findById(id)
        }))
        friends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {//use only this data of friends
            return {id: _id, firstName, lastName, occupation, location, picturePath}
        })
        res.status(200).json(friends)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const {userId, friendId} = req.params
        const user = await User.findById(userId)
        const friend = await User.findById(friendId)
        if (!friend || !user) return res.status(404).json({message: "User not found"})
        if (user.friends.includes(friendId)){ // if user already have this friend he will be deleted from friend list
            user.friends.filter((id) => {return id !== friendId})
            friend.friends.filter((id) => {return id !== userId})
        } else { // Adding friend id to User friends Array
            user.friends.push(friendId)
            friend.friends.push(userId)
        }
        user.save()
        friend.save()
        res.status(200).json({message: "Added or removed successfully"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}