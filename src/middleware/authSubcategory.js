const Subcategory = require('../models/subcategory.js')

const authSubcategory = async (req,res,next) =>{
    try {
        const subcategoryId = req.header('Subcategory')
        const subcategory = await Subcategory.findOne({_id:subcategoryId})
        if(!subcategory)
          throw new Error()

        req.subcategory = subcategory
        next()
    } catch (error) {
        res.status(401).send()
    }
}

module.exports = authSubcategory