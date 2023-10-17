import mongoose from "mongoose";
const {Schema,model} = mongoose;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
},{timestamps:true});
const User = model("User",UserSchema);

export default User;