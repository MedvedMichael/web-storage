import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    }
})

categorySchema.virtual('subcategories',{
    ref:'Subcategory',
    localField:'_id',
    foreignField:'owner'
})

const Category = new mongoose.model('Category',categorySchema)
export default Category