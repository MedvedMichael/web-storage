const mongoose = require('mongoose')
const validator = require('validator')

const pictureSchema = new mongoose.Schema({
    source:{
        type:String,
        default:'external'
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
    file:{
            type: Object,
            required: false,
            unique:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Videoset'
    }
},{
    timestamps:true
})



const Picture = mongoose.model('Picture',pictureSchema)

module.exports = Picture