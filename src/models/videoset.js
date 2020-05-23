const mongoose = require('mongoose')
const PictureSlider = require("./PictureSlider");
const Video = require("./video");

const videosetSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique:true
    },
    description:{
        type:String,
        required:false
    },
    subtitle:{
        type:String,
        required:false
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
videosetSchema.virtual('picturesliders',{
    ref:'PictureSlider',
    localField:'_id',
    foreignField:'owner'
})
videosetSchema.pre('remove', async (next)=>{
    const videoset = this
    await Video.deleteMany({
        owner: videoset._id
    })
    await PictureSlider.deleteMany({
        owner: videoset._id
    })
    next()

})
const Videoset= new mongoose.model('Videoset',videosetSchema);
module.exports = Videoset;