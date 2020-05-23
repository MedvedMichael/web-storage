const mongoose = require('mongoose')
const Picture = require("./picture");

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

PictureSliderSchema.pre('remove',async function(next){
    const pictureSlider = this
    try {
        const pictures = await Picture.find({
            owner: pictureSlider._id
        })
        for(let i=0;i<pictures.length;i++)
        await pictures[i].remove()
    }
    catch (error) {
        console.log(error)
    }
    next()
})
const PictureSlider = new mongoose.model('PictureSlider', PictureSliderSchema);
module.exports = PictureSlider;