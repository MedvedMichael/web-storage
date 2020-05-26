const mongoose = require('mongoose')
// const validator = require('validator')
const connection = require('../db/mongoose')
const videoSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    source:{
        type:String,
        default:'external',
        required:true
    },
    file:{
        type: Object,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'VideosContainer'
    }
},{
    timestamps:true
})

videoSchema.pre('remove',async function(next){
    const video = this
    if (video.source === 'local') {
        try {
            await connection.gfsVideo.remove({ _id: video.file, root: "videos" })
        }
        catch (error) {
            console.log(error)
        }
    }
    next()
})

const Video = mongoose.model('Video',videoSchema)

module.exports = Video