const mongoose = require('mongoose')
const validator = require('validator')

const videoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        
    },
    url:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Your url is not valid!')
            }
        }
    },
    description:{
        type:String,
        required:false,
        trim:false
    }

},{
    timestamps:true
})

const Video = mongoose.model('Video',videoSchema)

module.exports = Video