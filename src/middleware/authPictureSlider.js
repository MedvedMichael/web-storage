const PictureSlider = require('../models/picture-slider')

const authPictureSlider = async (req,res,next) =>{
    try {
        const pictureSliderId = req.query.pictureSliderId
        const pictureSlider = await PictureSlider.findOne({ _id: pictureSliderId})
        if(!pictureSlider)
            throw new Error()

        req.pictureSlider = pictureSlider
        next()
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = authPictureSlider