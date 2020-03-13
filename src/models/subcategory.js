const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    name:{
        color:{
            type:String,
            default:undefined
        },
        number:{
            type:Number,
            default:undefined
        },
        text:{
            type:String,
            default:undefined
        }
    },
    description:{
        type:String,
        required:false
    },
    gallery:[{
        photo:{
            type:Buffer
        }
    }],
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