const { UserModel } = require("../../models/user");
const { jwtTokenVerification } = require("../../modules/functions");
const jwt= require("jsonwebtoken")

const checkLogin = async (req,res,next)=>{
    try {
        const authorization = req?.headers?.authorization;
        if(!authorization) throw "لطفا وارد حساب خود شوید"
        let token = authorization.split(" ")[1]
        if(!token) throw "لطفا وارد حساب خود شوید"
        const result = jwtTokenVerification(token);
        const {username} = result;
        const user = await UserModel.findOne({username} , {password : 0})
        if(!user) throw "لطفا وارد حساب خود شوید"
        req.user = user;
        next()
    } catch (error) {
        next(error)
    }
   
}

module.exports = {
    checkLogin
}