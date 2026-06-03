import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async(req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message:"not authorized"})
    }
    try {
        const bearer = token.split(' ')
        const authToken = bearer.length === 2 ? bearer[1] : bearer[0]
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET)
        const userId = decoded?.id

        if (!userId) {
            return res.json({success:false,message:"not authorized"})
        }
        req.user = await User.findById(userId).select("-password")
        next();
    } catch(error){
        return res.json({success: false, message:"not authorized"})
    }
}