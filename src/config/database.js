const mongoose = require('mongoose');

const url = 'mongodb+srv://rs22mac2r23:rahul2003@flightsmanagement.6imcd.mongodb.net/FlightManagement';


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