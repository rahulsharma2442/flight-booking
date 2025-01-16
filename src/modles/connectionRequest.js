const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"},
    toUserId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    status:{type:String,
        enum:{
         values:  [ 'accepted','rejected','intrested','ignored']
        },
        message: `{VALUE} is incorrect status type`
    }

},{
    timestamps:true
});
connectionRequestSchema.index({fromUserId:1,toUserId:1});
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to youself!")
    }
    next();
})

const ConnectionRequest = mongoose.model('ConnectionRequest',connectionRequestSchema);
module.exports = {ConnectionRequest};