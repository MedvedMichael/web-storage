import { Router } from 'express'
import Category from '../models/category'

const router = new Router()


router.post('/categories', async (req, res) => {
    const category = new Category(req.body)

    try {
        await category.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).send()
    }
})


router.patch('/categories/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const category = await Category.findOne({
            _id: req.params.id
        })

        if (!category)
            return res.status(404).send()
        updates.forEach((update) => { category[update] = req.body[update] })
        await category.save()

    } catch (error) {
        res.status(400).send()
    }
})

router.get('/categories', async (req,res)=>{
    try {
        const categories = await Category.find(req.body)
        res.status(200).send(categories)
    } catch (error) {
        res.status(500).send()
    }
})


export default router
