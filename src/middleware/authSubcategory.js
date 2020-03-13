import Subcategory from '../models/subcategory.js'

const authSubcategory = async (req,res,next) =>{
    try {
        const subcategoryId = req.header('Authorization').replace('Basic ', '')
        const subcategory = await Subcategory.findOne({_id:subcategoryId})
        if(!subcategory)
          throw new Error()

        req.subcategory = subcategory
        next()
    } catch (error) {
        res.status(401).send()
    }
}

export default authSubcategory