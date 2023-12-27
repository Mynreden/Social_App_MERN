import mongoose from "mongoose"

let userSchema = new mongoose.Schema({ // Scheme how nodeJs will interact with MongoDB. In this part we define attributes of model
    firstName: {type: String, maxLength: 50, minLength: 2, require: true},
    lastName: {type: String, maxLength: 50, minLength: 2, require: true},
    friends: {type: Array, default: []},
    email: {type: String, maxLength: 100, unique: true, require: true},
    password: {type: String, minLength: 2, require: true},
    picturePath: {type: String, default: ""},
    location: { type: String },
    occupation: {type: String},
    viewedProfile: {type: Number, default: 0},
    impressions: {type: Number, default: 0}
}, {timestamps: true} // automatically adds 2 properties createdAt and updatedAt
);

const User = mongoose.model("UserModel", userSchema); // Created model using this schema
export default User;