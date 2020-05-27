const express = require('express')
const Video = require('../models/video')
const connection = require('../db/mongoose')
const authVideosContainer = require('../middleware/authVideosContainer')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const router = new express.Router()
const fs = require('fs')
    //
router.post('/video/upload/:id', connection.uploadVideo.any("videofile"),async (req,res)=>{

    try{
        const video = await Video.findOne({_id:req.params.id})
        video.file = req.files[0].id
        await video.save()
        res.status(201).send(video)
        fs.appendFile(__dirname+"../../log.txt",`Action: POST, name:${video.name}, Type: video \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
})
router.post('/video', authUser,authAdmin,authVideosContainer, async (req, res) => {

    const video = new Video({
        ...req.body,
        owner: req.videosContainer._id,
    })
    try {
        await video.save()
        res.status(201).send(video)
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,user:${req.user.name}, name:${video.name}, Type: video \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
    

})

router.get('/videos', authVideosContainer, async (req, res) => {
    try {
        await req.videosContainer.populate({
            path:'videos'
        }).execPopulate()
        res.status(200).send(req.videosContainer.videos)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET, videosContainerID:${req.videosContainer._id}, Type: video \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/video/:id', async (req,res)=>{
    try {
        const video = await Video.findOne({_id:req.params.id})
        if(!video)
            return res.status(404).send()
        if(video.source!=='external') {
            connection.gfsVideo.files.findOne({_id: video.file}, (err, file) => {
                if (err) {
                    return res.status(404).json("not finded");
                }
                if (!file) {
                    return res.status(404).json("not finded");
                }
                if (req.headers['range']) {
                    let parts = req.headers['range'].replace(/bytes=/, "").split("-");
                    let partialstart = parts[0];
                    let partialend = parts[1];

                    let start = parseInt(partialstart, 10);
                    let end = partialend ? parseInt(partialend, 10) : file.length - 1;
                    let chunksize = (end - start) + 1;

                    res.writeHead(206, {
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                        'Content-Type': file.contentType
                    });

                    connection.gfsVideo.createReadStream({
                        _id: file._id,
                        range: {
                            startPos: start,
                            endPos: end
                        }
                    }).pipe(res);
                } else {
                    res.header('Content-Length', file.length);
                    res.header('Content-Type', file.contentType);

                    connection.gfsVideo.createReadStream({
                        _id: file._id
                    }).pipe(res);
                }
            })
        }else{
            res.status(201).send(video.file)
        }
        fs.appendFile(__dirname+"../../log.txt",`Action: GET, name:${video.name}, Type: video \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})


router.delete('/video', authUser,authAdmin, async (req, res) => {
    const id = req.query.id
    try {
        const video = await Video.findOne({ _id: id })
        if (!video)
            res.status(404).send()

        await video.remove()

        res.status(200).send(video)
        fs.appendFile(__dirname+"../../log.txt",`Action: DELETE,user:${req.user.name} name:${video.name}, Type: video \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/videosall', authUser, authMainAdmin, async (req,res)=>{
    try {
        const videos = await Video.find({})
        res.status(200).send(videos)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET, user:${req.user.name}, Type: video \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})






module.exports = router