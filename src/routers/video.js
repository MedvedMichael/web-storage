const express = require('express')
const Video = require('../models/video')
const authSubcategory  = require('../middleware/authSubcategory')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const router = new express.Router()

router.post('/video', authUser, authAdmin, authSubcategory, async (req, res) => {
    const video = new Video({ 
        ...req.body,
        owner: req.subcategory._id
    })
    try {
        await video.save()
        res.status(201).send(video)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/video', authSubcategory, async (req, res) => {
    try {
        await req.subcategory.populate({
            path:'videos'
        }).execPopulate()
        res.status(200).send(req.subcategory.videos)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/video', authUser, authAdmin, authSubcategory, async (req, res) => {
    const id = req.body.id
    try {
        const video = await Video.findOneAndDelete({ _id: id })
        if (!video)
            res.status(404).send()
        res.status(200).send(video)
    } catch (error) {
        res.status(500).send()
    }
})






module.exports = router