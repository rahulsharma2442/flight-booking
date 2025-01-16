const validate = require('validator');

const validateAirport =(airportData)=>{
    const {code,city,country,name} = airportData;
    if(!code ||!city||!country||!name){
        return false;
    }
    return true;
    
};
module.exports = {validateAirport};