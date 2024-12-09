import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

   

    res.cookie("token", token, {
        httpOnly: true,// cookie cannot be accesed by client side js
        secure: process.env.NODE_ENV === 'production',//cookie will only be sent in https
        sameSite: "strict",//prevent csrf attacks
        maxAge: 7* 24 * 60 * 60 * 1000//cookie will expire in 7 days
    });
   return token;
}