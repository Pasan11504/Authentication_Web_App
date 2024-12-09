import bcryptjs from "bcryptjs";
import crypto from "crypto";

//import dotenv from "dotenv";
import {User} from "../models/user.model.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import { log } from "console";
 
//dotenv.config();
export const signup = async (req,res)=>{
    const {name, email, password} = req.body;
    try{
        if(!email || !password || !name){
            throw new Error ("All fields are required");
        }
        const userAlreadyExists = await User.findOne({email});//check if the user already exists
        if(userAlreadyExists){
            return res.status(400).json({sucess:false, message: "User already exists"});
        }
    
        const hashedPassword = await bcryptjs.hash(password, 10);//hash the password 1234 => 1234sdfghjkl

        const verificationToken = Math.floor(100000+ Math.random() * 900000).toString();//generate a random 6 digit number

        const user = await User.create({
            
            email, 
            password: hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 *60* 1000 //24 hours
        })

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);
        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

      // await sendVerificationEmail(user.email, verificationToken);
       // console.log(sendVerificationEmail(user.email, verificationToken));
        
        res.status(201).json({
            success: true, 
            message: "User created successfully",
            user:{
                    ...user._doc,
                    password: undefined
        }
    });
    }catch(error){
        res.status(400).json({success: false, message: error.message});
    }
}

export const verifyEmail = async (req,res)=>{
    const {code}= req.body;
    try{
        const user = await User.findOne(
            {
                verificationToken: code,
                verificationTokenExpiresAt: {$gt: Date.now()}
            }
        );

        if(!user){
            res.status(400).json({success: false, message: "Invalid or expired verification code"});
        }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user:{
            ...user._doc,
            password: undefined,
        }
    })
}catch (error){
    console.log("error in verifyEmail", error);
    
    res.status(500).json({
        success: false, 
        message: error.message
    });
}
};
export const login = async (req,res)=>{

    const{email , password}= req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({sucess: false,message: "invalid Credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(password ,user.password);
        if(!isPasswordValid){
            return res.status(400).json({sucess : false,messagr: "Invalid credentials"});
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            sucess: true,
            message:"Logged in sucessfully",
            user:{
                ...user._doc,
                password: undefined,
            },
        });

    } catch(error){
        console.log("Error in loggin",error);
        res.status(400).json({sucess: false, message: error.message});
        
    }
}

export const logout = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({
        sucess : true,
        message: "Logged out successfully"
    });
  
}
export const forgotPassword = async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        //generate reset password token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hours
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({success: true, message: "Password reset link sent to your email"});

}       
catch(error){
    console.log("Error in forgotPassword", error);
    res.status(400).json({success: false, message: error.message});
}
}

export const resetPassword = async (req,res)=>{
    
    try{
        const {token} = req.params;
        const {password} = req.body;
        const user= await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()},
        });
        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired reset token"});
        }

        //update password
        const hashedpassword = await bcryptjs.hash(password, 10);
        
        user.password = hashedpassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({success: true, message: "Password reset successfully"});

    }catch(error){
        console.log("Error in resetPassword", error);
        res.status(400).json({success: false, message: error.message});
    }
}
export const checkAuth = async (req,res)=>{

    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({sucess: false, message: "user not found"});
        }
        res.status(200).json({sucess: true, user  })

    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({sucess: false, message:error.message});
        
    }
}
