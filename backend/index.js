import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./connectDB.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config(); //to use the .env file
const app = express(); //express is need to create a server
const PORT = process.env.PORT || 5000; //to use the port from the .env file

app.use(express.json()); //allow us to parse the incoming requests:req.body
app.use(cookieParser()); //to parse the cookies

app.use("/api/auth",authRoutes);

app.listen(5000,()=>{
    connectDB();
    console.log("Server is running on port", PORT);
});
//to run the server we need to run the command node backend/index.js
