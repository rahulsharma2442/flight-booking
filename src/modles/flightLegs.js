const mongoose = require('mongoose');
// make combination of these 3 as unique..........( suggestion by akd)
const flightLegSchema = new mongoose.Schema({
    flightID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight',required:true },
    flightNumber: { type: String, ref: 'Flight', required: true }, 
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
});

const FlightLeg = mongoose.model('FlightLeg', flightLegSchema);
module.exports = { FlightLeg };
