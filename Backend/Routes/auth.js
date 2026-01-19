import express from "express"
import { getuser, login, logout, register } from "../Controller/auth.js";
import { authenticator } from "../MiddleWare/auth.js";

const route=express.Router()

route.post("/login",login)
route.post("/register",register)
route.post("/logout",logout)
route.get("/getuser",authenticator,getuser)

export default route;