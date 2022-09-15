const {body} = require("express-validator");
const { UserModel } = require("../../models/user");
function registerValidator(){
    return [
        body("username").custom(async(value,ctx)=>{
            const usernameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi;
            if(usernameRegex.test(value)){
                const username = await UserModel.findOne({value}) 
                if(username) {throw "نام کاربری تکراری است"}
                else return true
            }
            throw "نام کاربری صحیح نیست"
        }),
        body("email").isEmail().withMessage("فرمت ایمیل صحیح نیست").custom(async(value,ctx)=>{
            const email = await UserModel.findOne({value})
            if(email) {throw "ایمیل تکراری است"}
                else return true
        }),
        body("password").isLength({min : 6 , max : 20}).withMessage("پسورد باید بین 6 تا 20 کارکتر باشد").custom(async(value,ctx)=>{
            if(value !== ctx?.req?.body?.confirm_password) throw "رمزعبور با تکرار آن یکسان نیست"
            return true
        }),
        body("mobile").isMobilePhone("fa-IR").withMessage("فرمت تلفن صحیح نیست").custom(async(value,ctx)=>{
            const mobile = await UserModel.findOne({value})
            if(mobile) {throw "موبایل تکراری است"}
                else return true
        })
    ]
}


function loginValidator(){
    return [
        body("username").notEmpty().withMessage("نام کاربری را رمز نمیتواند خالی باشد").custom(async(value)=>{
            const usernameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi;
            if(usernameRegex.test(value)){ 
                return true 
            }
            else throw "نام کاربری یا رمز صحیح نیست"
        }),
        body("password").isLength({min : 6 , max : 20}).withMessage("پسورد باید بین 6 تا 20 کارکتر باشد")
            
    ]
}

function resetPasswordValidator(){
    return[
        body("old_password").isLength({min : 6 , max : 20}).withMessage("پسورد باید بین 6 تا 20 کارکتر باشد"),
        body("new_password").isLength({min : 6 , max : 20}).withMessage("پسورد باید بین 6 تا 20 کارکتر باشد").custom(async(value,ctx)=>{
            if(value !== ctx?.req?.body?.confirm_new_password) throw "رمزعبور با تکرار آن یکسان نیست"
            return true
        }),
        ]
    
}
module.exports = {
    registerValidator,
    loginValidator,
    resetPasswordValidator
}