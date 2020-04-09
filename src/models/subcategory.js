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
    isPublished:{
        type:Boolean,
        required:true,
        default:true
    },
    
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Category'
    }
})

subcategorySchema.virtual('videosets',{
    ref:'Videoset',
    localField:'_id',
    foreignField:'owner'
})

const Subcategory = new mongoose.model('Subcategory', subcategorySchema)
module.exports =  Subcategory