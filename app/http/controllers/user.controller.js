const { UserModel } = require("../../models/user");
const createError = require("http-errors")
const Controller = require("./controller");
const path = require("path");

class UserController extends Controller{
    async getProfile(req,res,next){
        try {
            const user = req.user
            return res.json({user})
        } catch (error) {
            next(error)
        }
        
    }

    async getAllUsers(req,res,next){
        try {
            const users = await UserModel.find({})
            if(!users) throw createError.NotFound("کاربری یافت نشد")
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    success : true ,
                    users
                }
            })
        } catch (error) {
            next(error)
        }
       
    }

    async getUserById(req,res,next){
        try {
            const {id} = req.params;
            const user = await UserModel.findOne({_id : id})
            if(!user) throw createError.NotFound("کاربر وجود ندارد")
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    user
                }
            })
        } catch (error) {
            next(error)
        }
        
    }

    async editUserById(req,res,next){
        try {
            const user_id = req.params.id;
            const data = {...req.body};
            const user = await UserModel.findOne({_id : user_id})
            if(!user) throw createError.NotFound("کاربر وجود ندارد");
            Object.entries(data).forEach(([key , value])=>{
                if(!["first_name" , "last_name"].includes(key)) delete data[key];
                if(["", " " , "." , null , undefined].includes(value)) delete data[key];
            })
            const updateResult = await UserModel.updateOne({_id : user_id} , {$set : data})

            if(updateResult.modifiedCount > 0){
                return res.status(200).json({
                    data : {
                        statusCode : 200 ,
                        success : true ,
                        message : "بروزرسانی موفقیت آمیز بود"
                    }
                })
            }
            throw createError.BadRequest("بروزرسانی انجام نشد");
        } catch (error) {
            next(error)
        }
        
       
    }

    async updateProfileImage(req,res,next){
        try {
            const user_id = req.user._id;
            req.body.image = path.join(req.body.fileUploadPath , req.body.fileUploadName)
            const image = req.body.image.replace(/\\/g , "/");
            const updateResult = await UserModel.updateOne({_id : user_id} , {$set : {profile_image : image}})
                if(updateResult.modifiedCount > 0){
                    return res.status(200).json({
                        data : {
                            statusCode : 200 ,
                            success : true ,
                            message : "بروزرسانی موفقیت آمیز بود"
                        }
                    })
                }
                throw createError.BadRequest("بروزرسانی انجام نشد");
        } catch (error) {
            next(error)
        }
      
    }

    async showUserGroups(req,res,next){
        try {
            const user_id = req.params.id;
            const user = await UserModel.findOne({_id : user_id})
            if(!user) throw createError.NotFound("کاربر وجود ندارد");

            const groups = await UserModel.findOne({_id : user_id} , {group : 1})
            if(!groups) throw createError.NotFound("گروهی یافت نشد");
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    success : true ,
                    groups
                }
            }) 
        } catch (error) {
            next(error)
        }
       
    }

    async removeUser(req,res,next){
        try {
            const user_id = req.params.id;
            const user = await UserModel.findOne({_id : user_id})
            if(!user) throw createError.NotFound("کاربر وجود ندارد");
            const deleteUser = await UserModel.deleteOne({_id : user_id})
            if(deleteUser.deletedCount == 0) throw createError.BadRequest("حذف انجام نشد");
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    success : true ,
                    message : "حذف موفقیت آمیز بود"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllRequests(){

    }

    async getRequestsByStatus(){

    }

    async changeRequestStatus(){

    }
}

module.exports = {
    UserController : new UserController()
}