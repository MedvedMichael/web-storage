const Videoset = require('../models/videoset')

const authVideoset = async (req,res,next) =>{
    try {

        const videosetId = req.query.videosetId
        const videoset = await Videoset.findOne({_id:videosetId})
        if(!videoset)
            throw new Error()

        req.videoset = videoset
        next()
    } catch (error) {
        res.status(400).send()
    }
}

module.exports = authVideoset