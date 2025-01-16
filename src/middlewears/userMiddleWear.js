const jwt = require('jsonwebtoken');
const {User} = require('../modles/user');
const config = require('../config.json');
require('dotenv').config('../config/secret.env');

const userAuth = async(req,res,next)=>{
    try{
        const cookies = req.cookies;
        if(!cookies){
            return res.status(401).send({msg:"Please login again"});
        }
        const authToken = cookies?.authToken;
        if(!authToken){
            return res.status(401).send({msg:"Please login again"});
        }
        let secret = config.JWT_SECRET;
        
        const message = jwt.verify(authToken,secret)
        const {id} = message;
        console.log('in authentication api');
        
        console.log(message);
        if(!id){
            return res.status(404).send({msg:"User Not Found"});
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({msg:"User Not Found"});
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log('Authentication Error',error);
        return res.status(401).send({msg:"Not authorized"});
    }
};
module.exports = {userAuth};