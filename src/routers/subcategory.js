import { Router } from 'express'
import Subcategory from '../models/subcategory'
import authCategory from '../middleware/authCategory'

const router = new Router()

router.post('/subcategories', authCategory, async (req,res)=>{
    const subcategory = new Subcategory({
        ...req.body,
        owner:req.category._id
    }) 
    try {
        await subcategory.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).send()
    }
})


