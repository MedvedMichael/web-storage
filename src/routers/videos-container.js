const { Router } = require('express')
const VideosContainer = require('../models/videos-container')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const authVideoset = require('../middleware/authVideoset')
const router = new Router()
const fs= require('fs')
router.post('/videos-container',authUser, authAdmin, authVideoset, async (req, res) => {
    const videosContainer = new VideosContainer({
        ...req.body,
        owner: req.videoset._id
    })

    try {
        await videosContainer.save()
        res.status(201).send(videosContainer)
        fs.appendFile(__dirname+"/../log.txt",`Action: POST,user:${req.user.name} ID:${videosContainer._id}, Type: video-container  \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/video-container/:id', async (req,res) =>{
    try {
        const videosContainer = await VideosContainer.findOne({_id:req.params.id})
        if(!videosContainer)
            return res.status(404).send()
        
        res.status(200).send(videosContainer)
        fs.appendFile(__dirname+"/../log.txt",`Action: GET, ID:${videosContainer._id}, Type: video-container  \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/videos-container', authUser, authAdmin, async (req,res) => {
    const id = req.query.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const videosContainer = await VideosContainer.findOne({ _id: id })
        if(!videosContainer)
            return res.status(404).send()
        updates.forEach((update) => videosContainer[update] = req.body[update])
       

        await videosContainer.save()
        res.status(200).send(videosContainer)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/videos-container',authUser,authAdmin,async (req,res)=>{
    const id = req.query.id
    try {
        const videosContainer = await VideosContainer.findOne({_id: id});
        if(!videosContainer)
            res.status(404).send()
        await videosContainer.remove()
        res.status(201).send(videosContainer)
        fs.appendFile(__dirname+"/../log.txt",`Action: DELETE,user:${req.user.name}, ID:${videosContainer._id}, Type: video-container  \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

module.exports = router