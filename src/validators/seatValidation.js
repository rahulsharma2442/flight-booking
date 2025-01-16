const validateSeat = (seatData, flightNumber) => {
    const validClasses = ['economy', 'business', 'first'];

    for (let seat of seatData) {
    
        if (!seat.flightNumber || !seat.class || !seat.seatNumber) {
            console.error('Validation Error: Missing required fields in seat data');
            return false;
        }

      
        if (seat.flightNumber !== flightNumber) {
            console.error(`Validation Error: Flight number mismatch. Expected: ${flightNumber}, Got: ${seat.flightNumber}`);
            return false;
        }

      
        if (!validClasses.includes(seat.class.toLowerCase())) {
            console.error(`Validation Error: Invalid class '${seat.class}'. Valid classes are: ${validClasses.join(', ')}`);
            return false;
        }

   
        if (typeof seat.seatNumber !== 'string' || seat.seatNumber.trim() === '') {
            console.error('Validation Error: Invalid or empty seat number');
            return false;
        }
    }

    return true;
};

module.exports = { validateSeat };
