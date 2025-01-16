const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber:{type:String,required:true,unique:true,trim:true},
    origin:{type:mongoose.Schema.Types.ObjectId,ref:'Airport',required:true},
    destination:{type:mongoose.Schema.Types.ObjectId,ref:'Airport',required:true},
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    capacity:{type:Number,required:true},
    bookedSeats:{type:Number,default:0},
    airLine:{type:String,required:true},
    legs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlightLeg' }],
    
});

const Flight = mongoose.model('Flight',flightSchema);
module.exports = {Flight};