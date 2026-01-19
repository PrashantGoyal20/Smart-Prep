import {User} from "./AuthDB.js";
import ErrorHandler from "../MiddleWare/error.js";

export const logout = async(req, res) => {
   const {token} = req.cookies
res.clearCookie('token', {
    httpOnly: true,
    secure: true,    
    sameSite: "none",
  });
  res.status(200).json({
    sucsess:true,
    message: 'Logged out successfully' });

}

export const register = async (req, res, next) => {
    try{

  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("Please fill out all credentials"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    res.status(400).json({success:false,message:"User already registered!"});
    return next(new ErrorHandler("User already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password
  });
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,    
    sameSite: "none",
  };
  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    message: "User Registeration and Token generated successfully"
  });
}catch(err){
    res.status(400).json({success:false,message:err.message})
}

};


export const login = async(req, res) => {
try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email }).select("+password");

    if (!exist) return next(new ErrorHandler("Please enter correct credentials"));
    
    const match = await exist.matchPassword(password);
    if (!match) return next(new ErrorHandler("Please enter correct password"));
    const token = exist.getSignedJwtToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,    
      sameSite: "none",
    }
    res.status(200).cookie("token", token, options).json({
      success: true,
      user: exist,
      message: "User Login and Token generated successfully",
      token,
    })

  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "User Login failed",
    })
  }
}

export const getuser=async(req,res)=>{
    try {  
  const {id} = req.user;
  const user=await User.findById(id);
  if(!user) return res.status(404).json({success:false,message:"User not found"})
  res.status(200).json({
    success: true,
    user,
  })
    
  } catch (error) {
    res.status(404).json({
      success:false
    })
  }

}