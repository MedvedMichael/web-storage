const PictureSlider = require('../models/PictureSlider')

const authPictureSlider = async (req,res,next) =>{
    try {
        const picturesliderId = req.query.picturesliderId
        const pictureslider = await PictureSlider.findOne({ _id: picturesliderId})
        if(!pictureslider)
            throw new Error()

        req.pictureslider = pictureslider
        next()
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = authPictureSlider