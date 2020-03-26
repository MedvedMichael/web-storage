const mongoose = require('mongoose')

const videosetSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
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
        default:false
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
videosetSchema.virtual('pictures',{
    ref:'Picture',
    localField:'_id',
    foreignField:'owner'
})
const Videoset= new mongoose.model('Videoset',videosetSchema);
module.exports = Videoset;