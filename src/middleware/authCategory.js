const Category = require('../models/category')

const authCategory = async (req,res,next) =>{
    try {
        const categoryId = req.query.categoryId
        const category = await Category.findOne({ _id: categoryId})
        if(!category)
          throw new Error()

        req.category = category
        next()
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = authCategory