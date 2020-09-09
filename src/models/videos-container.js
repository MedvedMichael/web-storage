const mongoose = require('mongoose')
const Video = require("./video");

const videosContainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Videos"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Videoset'
    }
})

videosContainerSchema.virtual('videos', {
    ref: 'Video',
    localField: '_id',
    foreignField: 'owner'
})

videosContainerSchema.pre('remove', async function (next) {
    const videosContainer = this
    try {
        const videos = await Video.find({
            owner: videosContainer._id
        })
        for (let i = 0; i < videos.length; i++)
            await videos[i].remove()
    }
    catch (error) {
        console.log(error)
    }
    next()

})
const VideosContainer = new mongoose.model('VideosContainer', videosContainerSchema);
module.exports = VideosContainer;