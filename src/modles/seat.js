const mongoose = require('mongoose');
const seatSchema = new mongoose.Schema({
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    flightNumber:{type:String,required:true,trim:true},
    seatNumber: { type: String, required: true ,trim:true}, 
    isBooked: { type: Boolean, default: false },
    class: { type: String, enum: ['economy', 'business', 'first'], required: true ,trim:true},
  });
  
  const Seat = mongoose.model('Seat', seatSchema);
  
  module.exports = {Seat};

  /*
{
flight:"67767de836909c8f48ea62a3",
flightNumber:"AI101",
seatNumber:"A001",
class:"economy"
}
*/