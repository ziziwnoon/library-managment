const {body} = require("express-validator")

function createBookValidator(){
    return [
        body("title").isLength({min : 3 , max : 20}).withMessage("نام کتاب باید بین 6 تا 20 کارکتر باشد").custom(async(value,ctx)=>{
                const title = await UserModel.findOne({value}) 
                if(title) {throw "نام کتاب تکراری است"}
                else return true
        }),
        body("text").isLength({min : 10 , max : 500}).withMessage("توضیحات کتاب باید بین 10 تا 500 کارکتر باشد"),
        body("author").isLength({min : 5 , max : 20}).withMessage("نام نویسنده کتاب باید بین 5 تا 20 کارکتر باشد")

    ]
}

module.exports = {
    createBookValidator
}