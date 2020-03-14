const mongoose = require('mongoose')
const validator = require('validator')

const videoSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        
    },
    source:{
        type:String,
        default:'external'
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
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Subcategory'
    }
},{
    timestamps:true
})



const Video = mongoose.model('Video',videoSchema)

module.exports = Video