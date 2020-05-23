const { Router } = require('express')
const PictureSlider = require('../models/PictureSlider')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const authVideoset = require('../middleware/authVideoset')
const router = new Router()

router.post('/pictureslider',authUser, authAdmin, authVideoset, async (req, res) => {
    const pictureslider = new PictureSlider({
        ...req.body,
        owner: req.videoset._id
    })

    try {
        await pictureslider.save()
        res.status(201).send(req.videoset)
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

router.get('/picturesliders', authVideoset, async (req, res) => {
    try {
        await req.videoset.populate({
            path: 'picturesliders'
        }).execPopulate()
        res.status(200).send(req.videoset.picturesliders)
    }
    catch (error) {
        res.status(500).send()
    }
})

router.get('/pictureslider/:id', async (req,res) =>{
    try {
        const pictureslider = await PictureSlider.findOne({_id:req.params.id})
        if(!pictureslider)
            return res.status(404).send()

        res.status(200).send(pictureslider)
    } catch (error) {
        res.status(500).send()
    }
})


router.patch('/picturesliders', authUser, authAdmin,authMainAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['isPublished','order']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const pictureslider = await PictureSlider.findOne({
            _id: req.query.id
        })

        if (!pictureslider)
            return res.status(404).send()

        updates.forEach((update) => pictureslider[update] = req.body[update])
        await pictureslider.save()


        res.status(200).send(pictureslider)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/pictureslider',authUser,authAdmin,async (req,res)=>{
    const id = req.query.id
    try {
        const pictureSlider = await PictureSlider.findOneAndDelete({_id: id});
        if(!pictureSlider)
            res.status(400).send()
        res.status(201).send(pictureSlider)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router