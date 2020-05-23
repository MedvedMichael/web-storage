const mongoose = require('mongoose')

const videosetSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique:true
    },
    
    isPublished:{
        type:Boolean,
        required:true,
        default:true
    },
    order:{
        type: Array
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Subcategory'
    }
})

videosetSchema.virtual('videos',{
    ref:'Video',
    localField:'_id',
    foreignField:'owner'
})

videosetSchema.virtual('picture-sliders',{
    ref:'PictureSlider',
    localField:'_id',
    foreignField:'owner'
})
const Videoset= new mongoose.model('Videoset',videosetSchema);
module.exports = Videoset;