const mongoose = require('mongoose')
const Videoset = require('./videoset')

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


subcategorySchema.pre('remove', async function (next) {
    const subcategory = this
    try {
        const videosets = await Videoset.find({ owner: subcategory._id })
        for (let i = 0; i < videosets.length; i++)
            await videosets[i].remove()
    }
    catch (error) {
        console.log(error)
    }
    next()

})

const Subcategory = new mongoose.model('Subcategory', subcategorySchema)
module.exports =  Subcategory