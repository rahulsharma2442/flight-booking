const express = require('express');
const {Flight} = require('../modles/flight');
const { validateFlight } = require('../validators/flightValidation');
const { FlightLeg } = require('../modles/flightLegs');
const flightRouter = express.Router();

flightRouter.post('/addFlight',async(req,res)=>{
    try{
        const {flightNumber,origin,destination,departureTime,
            arrivalTime,capacity,bookedSeats,legs,airLine} = req.body;
        if(!flightNumber||!origin||!destination||!departureTime||!arrivalTime||!
            capacity||!bookedSeats||!legs||!airLine
        ){
            return res.status(400).json({msg:"Request Entity is not correct"})
        }
        let errorEntity = validateFlight(req.body);
        if(errorEntity.error===true){
            return res.status(400).json({msg:errorEntity.msg});
        }
        let find = await Flight.findOne({flightNumber:flightNumber});
        if(find){
            return res.status(409).json({msg:"Entery Already Exist"});
        }
        let flight = new Flight({flightNumber,origin,destination,departureTime,
            arrivalTime,capacity,bookedSeats,legs,airLine});
        let savedFlight = await flight.save();
        return res.json({msg:"Flight added to database",Data:savedFlight});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({"error":error.msg});
    }
});
flightRouter.put('/updateFlight',async(req,res)=>{
    try{
        const {flightNumber,legs} = req.body;
        
        
        let result = await Flight.findOne({flightNumber:flightNumber});
        console.log(result);
        console.log('in updating api');
        if(!result){
            return res.status(404).json({msg:"No Data found"});
        }
        console.log(legs);
       let availableLegs = result.legs;
      
        let alreadyPresent = false;
        for(let leg of legs){
            for(let availableLeg of availableLegs){
                if(leg===availableLeg.toString()){
                    alreadyPresent = true;
                    break;
                }
            }
        }
        if(alreadyPresent){
            return res.status(400).json({msg:"Leg already present"});
        }
       let updatedResult = await result.updateOne({legs:legs});
        return res.status(200).json({msg:result});
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({msg:error.message});
    }
})
flightRouter.post('/addFlightLegs',async(req,res)=>{
    try{
        const {flightNumber,origin,destination,arrivalTime,departureTime,flightID} = req.body;
        if(!origin||!destination||!arrivalTime||!departureTime||!flightNumber||!flightID){
            return res.status(400).json({msg:"Input Data is not correct"})
        }
        let errorEntity = validateFlight(req.body);
        if(errorEntity.error===true){
            return res.status(400).json({msg:errorEntity.msg});
        }
        const isPresent = await FlightLeg.findOne({flightNumber:flightNumber,origin:origin,destination:destination});
        if(isPresent){
            return res.status(409).json({msg:"Entery already exists"});
        }
        let flightLeg = new FlightLeg({flightNumber:flightNumber,origin:origin,destination:destination,departureTime:departureTime,arrivalTime:arrivalTime,flightID});
        let result = await flightLeg.save();
        return res.status(200).json({Data:result});
        
    }
    catch(error){
        return res.status(500).send({error:error.message});
    }
})

// have to work on this api as of now.

const fetchDirectFlights = async(origin,destination)=>{
  
    try{
        console.log(origin);
        console.log(destination);
        let result1 = await Flight.find({origin,destination}).populate('legs');
    
        let result2 = await FlightLeg.find({origin,destination}).populate('flightID');
    
        let result  = [...result1,...result2]
        return {isError:false,data:result};
    }
    catch(error){
        if(origin=='67767d0aee13164726042d95'){
           console.log(error.message);
        }
       
        return {isError:true,error:error}
    }
}
const fetchAllFlights = async(origin)=>{
    try{
        let result = await Flight.find({origin});
        return {isError:false,data:result}
    }
    catch(error){
        return {isError:true,error:error}
    }
}


flightRouter.get('/getFlights/:origin/:destination', async (req, res) => {
    try {
        const { origin, destination } = req.params;

       
        // Step 1: Find direct flights
        let directFlightsData = await fetchDirectFlights(origin,destination);
        if(directFlightsData.isError){
            return res.status(500).send({message:'Internal Server Error',code:'500',error:directFlightsData?.error});
        }
        let directFlights = directFlightsData.data;
        let allFlightsFromOrigin = await fetchAllFlights(origin);
        let allFlightsFromOriginData = [];

        if(allFlightsFromOrigin.isError===false){
            allFlightsFromOriginData = allFlightsFromOrigin.data;
        }
        let indirectFlightsData = [];
        for(let flightData of allFlightsFromOriginData){
           let currentDestination = flightData?.destination;
           console.log(currentDestination);
           if(currentDestination!==destination){
            let availableFlightsData = await fetchDirectFlights(currentDestination,destination);
            if(!availableFlightsData.isError){
                let flights = availableFlightsData.data;
                let connectedFlights = []
                for(let flight of flights){
                    let obj = {flightData,flight};
                    connectedFlights.push(obj);
                }
                indirectFlightsData = [...connectedFlights,...indirectFlightsData];
            }
           }
        }
        console.log('printing indirect flights Data');
        let totalFlights = [...directFlights,...indirectFlightsData];
        return res.status(200).json({message:'Ok',code:'200',data:totalFlights});
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
});

flightRouter.get('/flightDetails/:flightID',async(req,res)=>{
   try{ const {flightID} = req.params;
      if(!flightID){
    return res.status(400).json({error:"Bad request flightID not available"})
   }
   let result = await Flight.find({flightNumber:flightID}).populate("legs origin destination");
      if(!result||result.length==0){
        return res.status(404).json({msg:"No Flight available with this ID"});
    }
    console.log('flights data is getting fetched');
   return res.send({Data:result})


}
    catch(error){
        return res.status(500).json({error:error.message});
    }
})

module.exports = {flightRouter}