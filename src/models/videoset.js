const mongoose = require('mongoose')
const PictureSlider = require("./picture-slider");
const VideosContainer = require("./videos-container");

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
    order: {
        type: Array
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subcategory'
    }
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
videosetSchema.pre('remove', async function (next) {
    const videoset = this
    try {
        const videosContainers = await VideosContainer.find({ owner: videoset._id })
        const pictureSliders = await PictureSlider.find({ owner: videoset._id })
        for (let i = 0; i < videosContainers.length; i++)
            await videosContainers[i].remove()
        for (let i = 0; i < pictureSliders.length; i++)
            await pictureSliders[i].remove()
    }
    catch (error) {
        console.log(error)
    }
    next()

})
const Videoset = new mongoose.model('Videoset', videosetSchema);
module.exports = Videoset;