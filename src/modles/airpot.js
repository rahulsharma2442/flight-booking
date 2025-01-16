const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    code:{type:String,required:true,trim:true,unique:true},
    name:{type:String,required:true,trim:true},
    city:{type:String,required:true,trim:true},
    country:{type:String,required:true,trim:true}
});

const Airport = mongoose.model('Airport',airportSchema);
module.exports = {Airport};

