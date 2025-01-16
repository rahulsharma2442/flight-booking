const express = require('express');
const {Airport} = require('../modles/airpot');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const airPortRouter = express.Router();
const {validateAirport} = require('../validators/airportValidation');
airPortRouter.post('/addAirport', async (req, res) => {
    console.log('Add Airport API');

    try {
        const { code, name, city, country } = req.body;

        // Validate input
        if (!validateAirport({ code, name, city, country })) {
            return res.status(400).json({ msg: "Invalid data provided" });
        }

        // Check for duplicate entry
        const entryPresent = await Airport.findOne({ code });
        if (entryPresent) {
            return res.status(409).json({ msg: "Entry already exists" });
        }

        // Save the new airport
        const airportEntry = new Airport({ code, name, city, country });
        const savedEntry = await airportEntry.save();

        return res.status(201).json({
            msg: "Data entered successfully!",
            entry: savedEntry
        });

    } catch (error) {
        console.error('Error adding airport:', error);
        return res.status(500).json({ msg: `Internal Server Error: ${error.message}` });
    }
});

airPortRouter.get('/getAirPortsOfCountry/:country',async(req,res)=>{
    try{
        console.log('get aiport api');
        let country = req.params.country;
        console.log(country);
        
        if(!country){
            return res.status(401).json({msg:"provide correct country Name"});
        }
        let result =await Airport.find({country:country})
        if(!result){
            return res.status(404).json({msg:'Oops! No airport found'});
        }
        if(result?.length==0){
            return res.status(404).json({msg:'Oops! No airport found'});
        }
        return res.status(200).json({data:result});
    }
    catch(error){
        return res.status(500).json({msg:error.message});
    }
});
airPortRouter.get('/getAirPortsbyCity',async(req,res)=>{
    try{
        console.log('get air port by city');
        let city = req.query?.city;
        if(!city){
            return res.status(400).json({msg:"Enter city"});
        }
        let data = await Airport.find({city:city});
        if(!data||data?.length==0){
            return res.status(404).json({msg:"No data found"});
        }
        return res.status(200).json({Data:data});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({msg:error.message});
    }
});

module.exports = {airPortRouter}