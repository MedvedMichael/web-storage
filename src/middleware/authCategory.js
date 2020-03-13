const Category = require('../models/category')

const authCategory = async (req,res,next) =>{
    try {
        const categoryId = req.header('Category')
        const category = await Category.findOne({_id:categoryId})
        if(!category)
          throw new Error()

        req.category = category
        next()
    } catch (error) {
        res.status(401).send()
    }
}

module.exports = authCategory