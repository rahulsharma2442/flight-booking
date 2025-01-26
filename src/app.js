const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const { userRouter } = require('./routes/userApi');
const {airPortRouter} = require('./routes/airportApi');
const {flightRouter} = require('./routes/fligthsApi');
const {seatRouter} = require('./routes/seatApi');
require('dotenv').config({path:'./.env'})
const app = express();


const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD;
const environment = process.env.ENV;



app.use(cors({
    origin:'http://localhost:3000',
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.options('*',cors());


app.use('/api/Users',userRouter);
app.use('/api/airport',airPortRouter);
app.use('/api/flights',flightRouter);
app.use('/api/seats',seatRouter);
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
  });
  
  connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log('Listening on port 7777');
    });
  })
  .catch((err) => {
    console.error('Failed to start the server:', err);
  });
