const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    name:{
        type: (this.type == 'number') ? Number : String,
        required:true,
        unique:true
    },
    
    description:{
        type:String,
        required:false
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:false
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