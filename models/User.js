import mongoose from 'mongoose';

//user objects are used for authentication of the managers of the holiday apartments

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    //USER, ADVANCED_USER, ADMIN
    roles: Array
})

const UserModel = mongoose.model("User", userSchema);

export{UserModel};