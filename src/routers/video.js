const express = require('express')
const Video = require('../models/video')
// const Videoset = require('../models/videoset')
// const authSubcategory  = require('../middleware/authSubcategory')
const authVideoset = require('../middleware/authVideoset')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const router = new express.Router()

router.post('/video', authUser,authAdmin, authVideoset, async (req, res) => {
    const video = new Video({ 
        ...req.body,
        owner: req.videoset._id
    })
    try {
        await video.save()
        res.status(201).send(video)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/video', authVideoset, async (req, res) => {
    try {
        await req.videoset.populate({
            path:'videos'
        }).execPopulate()
        res.status(200).send(req.videoset.videos)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/video', authUser,authAdmin, async (req, res) => {
    const id = req.query.id
    try {
        const video = await Video.findOneAndDelete({ _id: id })
        if (!video)
            res.status(404).send()
        res.status(200).send(video)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/videosall', authUser,authAdmin, async (req,res)=>{
    try {
        const videos = await Video.find({})
        res.status(200).send(videos)
    } catch (error) {
        res.status(500).send()
    }
})






module.exports = router