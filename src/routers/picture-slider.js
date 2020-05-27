const { Router } = require('express')
const PictureSlider = require('../models/picture-slider')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const authVideoset = require('../middleware/authVideoset')
const router = new Router()
const fs = require('fs')
router.post('/picture-slider',authUser, authAdmin, authVideoset, async (req, res) => {
    const pictureSlider = new PictureSlider({
        ...req.body,
        owner: req.videoset._id
    })

    try {
        await pictureSlider.save()
        res.status(201).send(pictureSlider)
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,  Type: picture-slider,user: ${req.user.name},videosetID:${req.videoset._id} \n`,(err)=>{
            if(err)
                console.log(err)
        })
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

router.get('/picture-sliders', authVideoset, async (req, res) => {
    try {
        await req.videoset.populate({
            path: 'picturesliders'
        }).execPopulate()
        res.status(200).send(req.videoset.picturesliders)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET,  Type: picture-sliders, videosetID:${req.videoset._id} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (error) {
        res.status(500).send()
    }
})

router.get('/picture-slider/:id', async (req,res) =>{
    try {
        const pictureslider = await PictureSlider.findOne({_id:req.params.id})
        if(!pictureslider)
            return res.status(404).send()

        res.status(200).send(pictureslider)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET,  Type: picture-slider,id:${pictureslider._id} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})


router.patch('/picture-sliders', authUser, authAdmin,authMainAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['isPublished','order']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const pictureSlider = await PictureSlider.findOne({
            _id: req.query.id
        })

        if (!pictureSlider)
            return res.status(404).send()

        updates.forEach((update) => pictureSlider[update] = req.body[update])
        await pictureSlider.save()


        res.status(200).send(pictureSlider)

        fs.appendFile(__dirname+"../../log.txt",`Action: PATCH,user:${req.user.name},  Type: picture-slider,id:${pictureSlider._id} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/picture-slider',authUser,authAdmin,async (req,res)=>{
    const id = req.query.id
    try {
        const pictureSlider = await PictureSlider.findOne({_id: id});
        if(!pictureSlider)
            res.status(400).send()

        await pictureSlider.remove()
        res.status(200).send(pictureSlider)
        fs.appendFile(__dirname+"../../log.txt",`Action: DELETE,user:${req.user.name},  Type: picture-slider,id:${pictureSlider._id} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router