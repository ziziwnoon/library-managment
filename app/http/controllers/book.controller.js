const { BookModel } = require("../../models/book");
const Controller = require("./controller");
const createError = require("http-errors");
const path = require("path")

class BookController extends Controller{
    async createBook(req,res,next){
        try {
            const {title,text,author,tags} = req.body;
            req.body.image = path.join(req.body.fileUploadPath , req.body.fileUploadName)
            const image = req.body.image.replace(/\\/g , "/");
            const createBookResult = await BookModel.create({title,text,image,author,tags})

            if(!createBookResult) throw createError.BadRequest("کتاب موردنظر ثبت نشد");
            
            return res.status(201).json({
                data : {
                    statusCode : 201 ,
                    success : true ,
                    message : "کتاب با موفقیت ثبت شد",
                    createBookResult
                }
            })
        } catch (error) {
            next(error)
        }
       
    }

    async getAllBooks(req,res,next){
        try {
            const books = await BookModel.find({})
            if(!books) throw createError.NotFound("کتابی یافت نشد")
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    success : true ,
                    books
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getBookById(req,res,next){
        try {
            const {id} = req.params;
            const book = await BookModel.findOne({_id : id})
            if(!book) throw createError.NotFound("کتابی وجود ندارد")
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    book
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async editBookById(req,res,next){
        try {
            const book_id = req.params.id;
            const data = {...req.body};
            const book = await BookModel.findOne({_id : book_id})
            if(!book) throw createError.NotFound("کاربر وجود ندارد");
            Object.entries(data).forEach(([key , value])=>{
                if(!["title","text","author"].includes(key)) delete data[key];
                if(["", " " , "." , null , undefined].includes(value)) delete data[key];
                if(key == "tags" && (data['tags'].constructor == Array)){
                    data["tags"] =  data["tags"].filter(val => {
                        if(!["", " " , "." , null , undefined].includes(val)) return val;
                    })
                    if(data["tags"].length == 0) delete data["tags"];
                }
            })
            const updateResult = await BookModel.updateOne({_id : book_id} , {$set : data})

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
}

module.exports = {
    BookController : new BookController()
}