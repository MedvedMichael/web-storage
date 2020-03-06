const express = require('express')
const Video = require('../models/video')

const router = new express.Router()

router.post('/video', async (req, res) => {
    const video = new Video(req.body)
    try {
        await video.save()
        res.status(201).send(video)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/video',async (req, res)=>{
    const name = req.query.name
    try {
        const video = await Video.findOne({name})
        if(!video)
          return res.status(404).send()

        res.status(200).send(video)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router