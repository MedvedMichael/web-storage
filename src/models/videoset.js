const mongoose = require('mongoose')
const PictureSlider = require("./picture-slider");
const VideosContainer = require("./videos-container");
const Logo = require('./logo')
const videosetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    isPublished: {
        type: Boolean,
        required: true,
        default: true
    },
    hasLogo: {
        type:Boolean,
        required:true,
        default:false
    },
    order: {
        type: Array
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subcategory'
    }
},{
    timestamps:true
})

videosetSchema.virtual('videos-containers', {
    ref: 'VideosContainer',
    localField: '_id',
    foreignField: 'owner'
})

videosetSchema.virtual('picture-sliders', {
    ref: 'PictureSlider',
    localField: '_id',
    foreignField: 'owner'
})

videosetSchema.virtual('logos',{
    ref:'Logo',
    localField:'_id',
    foreignField:'owner'
})

videosetSchema.pre('remove', async function (next) {
    const videoset = this
    try {
        const videosContainers = await VideosContainer.find({ owner: videoset._id })
        const pictureSliders = await PictureSlider.find({ owner: videoset._id })
        const logo = await Logo.findOne({owner:videoset._id});
        for (let i = 0; i < videosContainers.length; i++)
            await videosContainers[i].remove()
        for (let i = 0; i < pictureSliders.length; i++)
            await pictureSliders[i].remove()
        if (logo) await logo.remove();
    }
    catch (error) {
        console.log(error)
    }
    next()

})
const Videoset = new mongoose.model('Videoset', videosetSchema);
module.exports = Videoset;