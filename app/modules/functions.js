const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

function hashPassword(password){
    const salt = bcrypt.genSaltSync(13);
    return bcrypt.hashSync(password , salt)
}

function compareDataWithHash(data , hash){
    return bcrypt.compareSync(data , hash)
}

function jwtTokenGenerator(payload){
    const token = jwt.sign(payload , process.env.SECRET_KEY , {expiresIn : "3 days"})
    return token
}

function refreshTokenGenerator(user_id){
    return new Promise(async(resolve , reject)=>{
        const user = await UserModel.findById(user_id);
        const payload = {
            username : user.username
        } 
        jwt.sign(payload , process.env.REFRESH_TOKEN_SECTERT_KEY , {expiresIn : "30 days"} , (err,token)=>{
            if(err) reject("خطای سرور")
            resolve(token)
        })
        
    })
}

function jwtTokenVerification(token) {
    const verification = jwt.verify(token , process.env.SECRET_KEY);
    if(!verification?.username) throw "لطفا وارد حساب خود شوید"
    return verification
}

function refreshTokenVerification(token) {
    const verification = jwt.verify(token , process.env.REFRESH_TOKEN_SECTERT_KEY);
    if(!verification?.username) throw "لطفا وارد حساب خود شوید"
    return verification
}

module.exports = {
    hashPassword ,
    compareDataWithHash,
    jwtTokenGenerator ,
    jwtTokenVerification ,
    refreshTokenGenerator ,
    refreshTokenVerification
}