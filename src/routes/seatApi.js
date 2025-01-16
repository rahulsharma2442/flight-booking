const express = require('express');
const {Flight} = require('../modles/flight');
const {Seat} = require('../modles/seat');
const { validateSeat } = require('../validators/seatValidation');
const seatRouter = express.Router();
seatRouter.post('/addSeats', async (req, res) => {
    try {
        const seatData = req.body;

        // Validate input data
        if (!seatData || !Array.isArray(seatData) || seatData.length === 0) {
            return res.status(400).json({
                code: 400,
                message: 'Bad Request',
                error: 'Seat data is missing or invalid'
            });
        }

        const flightNumber = seatData[0].flightNumber;

        // Check if the flight exists
        const isFlightPresent = await Flight.findOne({ flightNumber });
        if (!isFlightPresent) {
            return res.status(400).json({
                code: 400,
                message: 'Bad Request',
                error: 'Wrong Flight Number'
            });
        }

        // Validate seat data
        const isValidData = validateSeat(seatData, flightNumber);
        if (!isValidData) {
            return res.status(400).json({
                code: 400,
                message: 'Bad Request',
                error: 'Seat data is not valid'
            });
        }

        // Add seats to the database
        const addSeat = await Seat.insertMany(seatData);
        return res.status(200).json({
            code: 200,
            message: 'Seats added successfully',
            data: addSeat
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});
seatRouter.put('/bookSeat',async(req,res)=>{
    try{
        let {seatData} = req.body;
        
    }
    catch(error){
        return res.status(500).json({
            code:500,
            message:'Internal Server Error',
            error:error.message
        })
    }
})

module.exports = {seatRouter};