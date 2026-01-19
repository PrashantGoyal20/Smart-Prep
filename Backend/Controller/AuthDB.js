import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    
   name:{
        type:String,
        required:true
        
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:[true,"Please enter your phone number"],
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    date:{
        type:Date,
        default:Date.now
    }

})

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRY});
}

export const User = mongoose.model("User", UserSchema);