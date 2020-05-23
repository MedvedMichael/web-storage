const mongoose = require('mongoose')

const PictureSliderSchema = new mongoose.Schema({
    isPublished:{
        type:Boolean,
        required:true,
        default:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Videoset'
    }
})


PictureSliderSchema.virtual('pictures',{
    ref:'Picture',
    localField:'_id',
    foreignField:'owner'
})
const PictureSlider= new mongoose.model('PictureSlider',PictureSliderSchema);
module.exports = PictureSlider;