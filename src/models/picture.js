const mongoose = require('mongoose')
const validator = require('validator')

const pictureSchema = new mongoose.Schema({
    source:{
        type:String,
        default:'external'
    },
    file:{
            type: Object
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'PictureSlider'
    }
},{
    timestamps:true
})



const Picture = mongoose.model('Picture',pictureSchema)

module.exports = Picture