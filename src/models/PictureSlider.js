const mongoose = require('mongoose')
const Picture = require("./pictureg");

const PictureSliderSchema = new mongoose.Schema({
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
        ref:'Videoset'
    }
})


PictureSliderSchema.virtual('pictures',{
    ref:'Picture',
    localField:'_id',
    foreignField:'owner'
})

PictureSliderSchema.pre('remove',async (next)=>{
    const pictureSlider = this
    await Picture.deleteMany({
        owner:pictureSlider._id
    })
    next()
})
const PictureSlider= new mongoose.model('PictureSlider',PictureSliderSchema);
module.exports = PictureSlider;