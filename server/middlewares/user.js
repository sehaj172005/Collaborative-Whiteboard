const express = require("express");
const jwt = require("jsonwebtoken");


require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_USER_SECRET;
console.log(JWT_SECRET);


function userauthmiddleware(req,res,next){
    try{
    const token = req.header("token")
     const id = jwt.verify(token,JWT_SECRET).id
     req.id = id
     next();
}
    catch(e){
        res.status(401).send({error:"Please authenticate using a valid token " + e.message})
    }

}

module.exports = userauthmiddleware;