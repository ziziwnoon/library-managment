const { UserModel } = require("../../models/user");
const { hashPassword, randomNumberGenerator, compareDataWithHash, jwtTokenGenerator, refreshTokenGenerator, refreshTokenVerification } = require("../../modules/functions");
const Controller = require("./controller");
const createError = require("http-errors")

class AuthController extends Controller{
    async register(req,res,next){
        try {
            const {first_name , last_name , username , email , password , mobile} = req.body;
            const hash = hashPassword(password)
            const register = await UserModel.create({
                first_name , last_name , username , email , password : hash , mobile
            })
            if(!register) throw "ثبت نام انجام نشد"
            return res.status(200).json({
                status : 200,
                success : true ,
                message : "حساب کاربری با موفقیت ایجاد شد"
            })
        } catch (error) {
            next(error)
        }
        
    }


    async login(req,res,next){
        try {
            const {username , password} = req.body;
            const user = await UserModel.findOne({username})
            if(!user) throw createError.NotFound("نام کاربری یا رمز اشتباه است")
            const comparePass = compareDataWithHash(password , user.password)
            if(!comparePass) throw createError.NotFound("نام کاربری یا رمز اشتباه است")
            const token = await jwtTokenGenerator({username});
            const refresh_token = await refreshTokenGenerator(user._id)
            user.token = token;
            user.refresh_token = refresh_token;
            user.save();
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    success : true , 
                    message : "با موفقیت وارد شدید",
                    token ,
                    refresh_token
                }
            })
        } catch (error) {
            next(error)
        }
        
    }


    async signNewRfreshToken(req,res,next){
        try {
            const {refresh_token} = req.body;
            const {username} = await refreshTokenVerification(refresh_token);
            const user = await UserModel.findOne({username});
            const token = await jwtTokenGenerator({username});
            const new_refresh_token = await refreshTokenGenerator(user._id);
            user.token = token;
            user.refresh_token = new_refresh_token;
            user.save();

            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    success : true ,
                    token ,
                    refresh_token : new_refresh_token
                }
            })
        } catch (error) {
            next(error)
        }
    }


    async resetPassword(req,res,next){
        try {
            const _id = req.params.id;
            const {old_password , new_password, confirm_new_password} = req.body;
            const user = await UserModel.findOne({_id})
            if(!user) throw createError.NotFound("کاربر یافت نشد");
            const comparePass = compareDataWithHash(old_password , user.password)
            if(!comparePass) throw createError.NotFound("رمز عبور قدیمی اشتباه است");
            const updatePass = await UserModel.updateOne({_id}, {$set : {password : new_password}})
            if(updatePass.modifiedCount > 0){
                const username = user.username;
                const token = await jwtTokenGenerator({username});
                const refresh_token = await refreshTokenGenerator(user._id)
                user.token = token;
                user.refresh_token = refresh_token;
                user.save();
                return res.status(200).json({
                    data : {
                        statusCode : 200 ,
                        success : true ,
                        message : "رمز عبور با موفقیت تغییر کرد",
                    }
                })
            }
            throw createError.BadRequest("تغییر رمزعبور انجام نشد")
        } catch (error) {
            next(error)
        }
       
    }
}

module.exports = {
    AuthController : new AuthController()
}