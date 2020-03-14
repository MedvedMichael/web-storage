const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:false
    }
})

categorySchema.virtual('subcategories',{
    ref:'Subcategory',
    localField:'_id',
    foreignField:'owner'
})

const Category = new mongoose.model('Category',categorySchema)
module.exports = Category