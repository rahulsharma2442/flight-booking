const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
require('dotenv').config({ path: '../config/secrets.env' });

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, trim: true, maxLength: 20 },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error('Email is not valid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(val) {
        if (!validator.isStrongPassword(val, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
          throw new Error('Password is too weak');
        }
      },
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ['male', 'female', 'other'], 
    },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      unique:true,
      validate(val) {
        if (!validator.isMobilePhone(val, 'any')) {
          throw new Error('Phone number is not valid');
        }
      },
    },
    address: {
      country: { type: String, trim: true },
      city: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
    isVerified:{type:Boolean,default:false}
  },
  {
    timestamps: true, 
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign({ _id: user._id.toString() }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
=======
const userSchema = new mongoose.Schema({
    firstName: { type: String,required:true,trim:true ,minLength:3,maxLength:20},
    lastName: { type: String ,trim:true},
    email: { type: String, unique: true, required: true ,lowercase:true,trim:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error ("Email  is not valid");
            }
        }
    },
    password: { type: String, required: true },
    age: { type: Number,min:14 },
    gender: { type: String,trim:true,lowercase:true,
        validate(val){
            if(!["male","female","other"].includes(val)){
                throw new Error("Gender is not valid");
            }
        }
     } ,
    nationality:{type:String,default:"Indian",trim:true},
    skills:{type:Array},
},{
    timestamps:true
});
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "krishna", { expiresIn: "24h" });
    return token;
};


const User = mongoose.model('User', userSchema);
module.exports = {User}
>>>>>>> 38c2a54817f883f54bb8d718ca32f6da0eb6aac2
