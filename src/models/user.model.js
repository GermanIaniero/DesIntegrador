import mongoose from "mongoose";

const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    rol: {type: String, required:true, default:"usuario", enum:['usuario','admin']},
    password: String
}))

export default UserModel