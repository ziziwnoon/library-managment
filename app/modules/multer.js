const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors")

function createRoute(req){
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();

    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "users" , year , month , day);
    fs.mkdirSync(directory , {recursive : true})
    req.body.fileUploadPath = path.join( "uploads" , "users" , year , month , day)
    return directory;
}

const storage = multer.diskStorage({
    destination : (req, file , cb)=>{
        const filePath = createRoute(req);
        cb(null , filePath)
    },
    filename : (req,file,cb) => {
        const ext = path.extname(file.originalname);
        const fileName = String(new Date().getTime()+ext)
        req.body.fileUploadName = fileName
        cb(null , fileName)
    }
})

function fileFilter(req,file,cb){
    const ext = path.extname(file.originalname);
    const mimetypes = [".jpg" , ".webp" , ".png" , ".jpeg" , ".gif"]
    if(mimetypes.includes(ext)){
        return cb(null , true)
    }
    return cb(createError.BadRequest("فرمت فایل قابل قبول نیست"))
}

const maxSize = 5 * 1000 * 1000;
const fileUploadWithMulter = multer({storage , fileFilter , limits : {fileSize : maxSize} })

module.exports = {
    fileUploadWithMulter
}