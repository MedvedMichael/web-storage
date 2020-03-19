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
        required:true,
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
        ref:'Subcategory'
    }
},{
    timestamps:true
})



const Picture = mongoose.model('Picture',pictureSchema)

module.exports = Picture