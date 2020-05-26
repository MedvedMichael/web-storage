const mongoose = require('mongoose')
const Subcategory = require('./subcategory')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    subcategoriesType:{
        type:String,
        required:false
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:true
    }
})

categorySchema.virtual('subcategories',{
    ref:'Subcategory',
    localField:'_id',
    foreignField:'owner'
})


categorySchema.pre('remove', async function (next) {
    const category = this
    try {
        const subcategories = await Subcategory.find({ owner: category._id })
        for (let i = 0; i < subcategories.length; i++)
            await subcategories[i].remove()
    }
    catch (error) {
        console.log(error)
    }
    next()

})

const Category = new mongoose.model('Category',categorySchema)
module.exports = Category