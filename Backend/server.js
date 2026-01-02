import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import speechRoute from "./Routes/Speech.js"
import mongoose from "mongoose"
import session from "express-session"

const app=express()
dotenv.config()

app.use(
  cors({
    origin: [process.env.FRONTEND_URL,process.env.TRANSFORMERS_API_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/speech',speechRoute)

const PORT=process.env.PORT
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  replicaSet: process.env.MONGO_REPLICA_SET
})
  .then(app.listen(PORT, async () => {
    console.log("Mongoose Connected")
    const client = mongoose.connection.getClient();
   }))

