const Subcategory = require('../models/subcategory.js')

const authSubcategory = async (req,res,next) =>{
    try {
        const subcategoryId = req.query.subcategoryId
        const subcategory = await Subcategory.findOne({_id:subcategoryId})
        if(!subcategory)
          throw new Error()

        req.subcategory = subcategory
        next()
    } catch (error) {
        res.status(400).send()
    }
}

module.exports = authSubcategory