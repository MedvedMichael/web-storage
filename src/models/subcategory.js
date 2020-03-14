const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    name:{
        type:Object,
        unique:true
    },
    description:{
        type:String,
        required:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Category'
    }
})

subcategorySchema.virtual('videos',{
    ref:'Video',
    localField:'_id',
    foreignField:'owner'
})

const Subcategory = new mongoose.model('Subcategory', subcategorySchema)
module.exports =  Subcategory