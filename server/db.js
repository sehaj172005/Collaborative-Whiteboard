const mongoose = require('mongoose')
const { Schema, model } = mongoose
const objectid =  Schema.Types.ObjectId;

const userSchema  = new Schema({
    email: {type : String , unique :true},
    password: String,
   
})

const usermodel = model("Users",userSchema,"Users")
module.exports = {usermodel}

