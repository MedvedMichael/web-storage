const express = require('express')
const Video = require('../models/video')
const authVideoset = require('../middleware/authVideoset')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const router = new express.Router()


router.post('/video', authUser,authAdmin,authVideoset, global.uploadVideo.single("videofile"), async (req, res) => {

    const video = new Video({
        ...req.body,
        owner: req.videoset._id,
    })
    try {
        await video.save()
        res.status(201).send(video)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/videos', authVideoset, async (req, res) => {
    try {
        await req.videoset.populate({
            path:'videos'
        }).execPopulate()
        res.status(200).send(req.videoset.videos)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/video/:id',authVideoset, async (req,res)=>{
    try {
        const video = await Video.findOne({_id:req.params.id})
        if(!video)
            return res.status(404).send()

        const readstream = gfsVideo.createReadStream(video.file.filename)
        readstream.pipe(res);
    } catch (error) {
        res.status(500).send()
    }
})


router.delete('/video', authUser,authAdmin, authVideoset, async (req, res) => {
    const id = req.query.id
    try {
        const video = await Video.findOneAndDelete({ _id: id })
        if (!video)
            res.status(404).send()
        global.gfsVideo.remove({filename: video.file.filename, root:"videos"})
        res.status(200).send(video)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/videosall', authUser, authMainAdmin, async (req,res)=>{
    try {
        const videos = await Video.find({})
        res.status(200).send(videos)
    } catch (error) {
        res.status(500).send()
    }
})






module.exports = router