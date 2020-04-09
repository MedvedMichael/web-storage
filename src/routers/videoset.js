const { Router } = require('express')
const Videoset = require('../models/videoset')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const authSubcategory = require('../middleware/authSubcategory')
const router = new Router()

router.post('/videoset',authUser, authAdmin, authSubcategory, async (req, res) => {
    console.log(req.body)
    const videoset = new Videoset({
        ...req.body,
        owner: req.subcategory._id
    })

    try {
        await videoset.save()
        res.status(201).send(videoset)
    } catch (error) {
        res.status(400).send(error)
    }
})

// router.get('/subcategories', async (req,res)=>{
//     try {
//         const subcategories = await Subcategory.find({})
//         res.status(200).send(subcategories)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.get('/videosets', authSubcategory, async (req, res) => {
    try {
        await req.subcategory.populate({
            path: 'videosets'
        }).execPopulate()
        res.status(200).send(req.subcategory.videosets)
    }
    catch (error) {
        res.status(500).send()
    }
})

router.get('/videoset/:id', async (req,res) =>{
    try {
        const videoset = await Videoset.findOne({_id:req.params.id})
        if(!videoset)
            return res.status(404).send()
        
        res.status(200).send(videoset)
    } catch (error) {
        res.status(500).send()
    }
})


router.patch('/videosets', authUser, authAdmin,authMainAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'subtitle','isPublished', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const videoset = await Videoset.findOne({
            _id: req.query.id
        })

        if (!videoset)
            return res.status(404).send()

        updates.forEach((update) => videoset[update] = req.body[update])
        await videoset.save()


        res.status(200).send(videoset)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router