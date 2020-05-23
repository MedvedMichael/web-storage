const mongoose = require('mongoose')
const connection = require('../db/mongoose')

const pictureSchema = new mongoose.Schema({
    source: {
        type: String,
        default: 'external'
    },
    file: {
        type: Object
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PictureSlider'
    }
}, {
    timestamps: true
})

pictureSchema.pre('remove', async function(next){
    const picture = this
    if(picture.source === 'local')
    try{
        await connection.gfsPicture.remove({ _id: picture.file, root: "pictures" })
    }
    catch(error){
        console.log(error)
    }
    next()
})



const Picture = mongoose.model('Picture', pictureSchema)

module.exports = Picture