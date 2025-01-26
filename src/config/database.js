const { config } = require('dotenv');
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODBURI;


async function connectDB(){
    try{
        await mongoose.connect(url);
        console.log('connected to DataBase');
    }
    catch(error){
        console.log(error);
        throw error;
    }
}
module.exports = connectDB;