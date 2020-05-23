const VideosContainer = require('../models/videos-container')

const authVideosContainer = async (req,res,next) =>{
    try {
        const videosContainerId = req.query.videosContainerId
        const videosContainer = await VideosContainer.findOne({_id:videosContainerId})
        if(!videosContainer)
            throw new Error()
        req.videosContainer = videosContainer
        next()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
}

module.exports = authVideosContainer