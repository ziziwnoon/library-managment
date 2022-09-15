const {Schema, Types , model} = require("mongoose");

const BookSchema = new Schema({
    title : {type : String , required : true },
    text : {type : String},
    image : {type : String , default:"/defaults/default.png"},
    author : {type : String},
    group : {type : Types.ObjectId},
    tags : {type : [String] , default:[]}
})

const BookModel = model("book" , BookSchema);

module.exports={
    BookModel
}