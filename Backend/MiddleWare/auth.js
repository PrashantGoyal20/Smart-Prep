import jwt from "jsonwebtoken";
import { User } from "../Controller/AuthDB.js";

export const authenticator=async(req,res,next)=>{
    const { token } = req.cookies;
    console.log("Authenticating...")
  if (!token) {
    return next(res.status(200).json({success:false,message:"Not authorized to access this resource"}));

  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.user = decoded;
  

  next();
}