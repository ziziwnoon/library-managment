const {Schema, Types , model} = require("mongoose");

const groupSchema = new Schema({
    name : {type : String , required : true },
    description : {type : String},
    users : {type : [Types.ObjectId], required : true },
    username : {type : String , required : true , unique : true },
    owner : {type : Types.ObjectId, required : true}
})

const GroupModel = model("team" , groupSchema);

module.exports={
    GroupModel
}