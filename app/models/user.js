const {Schema, Types , model} = require("mongoose");

const InviteRequests = new Schema({
    groupId : {type : Types.ObjectId , required : true },
    caller : {type : String , required : true , lowercase : true},
    requestDate : {type : Date , default : new Date()} ,
    status : {type : String , default : "pending"}
});

const userSchema = new Schema({
    first_name : {type : String},
    last_name : {type : String},
    username : {type : String, required : true , unique : true},
    password : {type : String, required : true , unique : true},
    email : {type : String, required : true , unique : true},
    mobile : {type : String, required : true },
    role : {type : [String] , default: ["USER"]},
    group : {type : [Types.ObjectId], default:[]},
    token : {type:String , default:""},
    refresh_token : {type:String , default:""},
    profile_image : {type:String , default:""},
    inviteRequests : {type : [InviteRequests]}
},{
    timestamps:true
})

const UserModel = model("user" , userSchema);

module.exports={
    UserModel
}