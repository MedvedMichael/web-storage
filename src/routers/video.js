const express = require('express')
const Video = require('../models/video')

const authSubcategory  = require('../middleware/authSubcategory')

const router = new express.Router()

router.post('/video', authSubcategory, async (req, res) => {
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

router.get('/video', async (req, res) => {
    try {
        const videos = await Video.find(req.query)

        if (!videos)
            return res.status(404).send()

        res.status(200).send(videos)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/video', async (req, res) => {
    const name = req.query.name
    try {
        const video = await Video.findOneAndDelete({ name })
        if (!video)
            res.status(404).send()
        res.status(200).send(video)
    } catch (error) {
        res.status(500).send()
    }
})






module.exports = router