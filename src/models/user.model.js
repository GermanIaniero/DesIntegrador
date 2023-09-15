import mongoose from "mongoose";

const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    social:  String,
    rol: {type: String, required:true, default:"usuario", enum:['usuario','admin']},
    cartid: {type: mongoose.Schema.Types.ObjectId, ref:'cart'}, 
    password: String
}))

export default UserModel