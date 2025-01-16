const validate = require('validator');

const validateFlight = (flightData)=>{
    const {departureTime,arrivalTime,origin,destination} = flightData;
    if(origin===destination)
        return {error:true,msg:"Origin and Destination cannot be same"};
    if (!validate.isISO8601(departureTime)) {
        return { error: true, msg: 'Departure Time is not in correct ISO 8601 format' };
    }
    if (!validate.isISO8601(arrivalTime)) {
        return { error: true, msg: 'Arrival Time is not in correct ISO 8601 format' };
    }
    if(arrivalTime===departureTime){
        return {error:true,msg:"Arrival time cannot be same as departure time"};
    }
    
    return { error: false };
};
const validateFlightLegs = (flightLegsData)=>{
    const {origin,destination,arrivalTime,departureTime} = flightLegsData;
    if(origin === destination){
        return {error:true,msg:"Origin and Destination cannot be same"};
    }
    if(arrivalTime===departureTime){
        return {error:true,msg:"Arrival time cannot be same as departure time"}
    }
    return {error:false}
}
module.exports = {validateFlight}