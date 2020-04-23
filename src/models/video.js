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
    file:{
        type: Object,
        required: false,
        unique:true
    },
    url:{
        type:String,
        trim:true,
        required:false,
        unique:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Your url is not valid!')
            }
        }
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Videoset'
    }
},{
    timestamps:true
})



const Video = mongoose.model('Video',videoSchema)

module.exports = Video