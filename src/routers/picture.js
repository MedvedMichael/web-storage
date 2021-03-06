const express = require('express')
const Picture = require('../models/picture')
//const authSubcategory  = require('../middleware/authSubcategory')
const connection = require('../db/mongoose')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authPictureSlider = require('../middleware/authPictureSlider')
const router = new express.Router()
const fs = require('fs')
router.post('/picture/upload/:id', connection.uploadPicture.any("picturefile"),async (req,res)=>{
    try{
        const picture = await Picture.findOneAndUpdate({_id:req.params.id},{file:req.files[0].id})
        res.status(201).send(picture)
        fs.appendFile(__dirname+"/../log.txt",`Action: POST,  Type: picture, name: ${picture.name} \n`,(err)=>{
              if(err)
                   console.log(err)
        })
    }
    catch (err) {
        res.status(400).send(err);
    }
})
router.post('/picture', authUser, authAdmin, authPictureSlider, async (req, res) => {
 const picture = new Picture({
        ...req.body,
        owner: req.pictureSlider._id
    })
    try {
       await picture.save()
       res.status(201).send(picture)
       fs.appendFile(__dirname+"/../log.txt",`Action: POST, user:${req.user.name} Type: picture, name: ${picture.name} \n`,(err)=>{
                     if(err)
                          console.log(err)
               })
   } catch (error) {
       
       res.status(400).send(error)
   }
})

router.get('/pictures',  authPictureSlider,async (req, res) => {
    try {
        await req.pictureSlider.populate({
            path:'pictures'
        }).execPopulate()
        res.status(200).send(req.pictureSlider.pictures)
        fs.appendFile(__dirname+"/../log.txt",`Action: GET,  Type: pictures in slider \n`,(err)=>{
                      if(err)
                           console.log(err)
                })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/picture', authUser, authAdmin, async (req, res) => {
    const id = req.query.id
    try {
        const picture = await Picture.findOne({ _id: id })
        if (!picture)
            return res.status(404).send()
        await picture.remove()
        // connection.gfsPicture.remove({filename: picture.file, root:"pictures"})
fs.appendFile(__dirname+"/../log.txt",`Action: DELETE, user:${req.user.name}, Type: picture, name: ${picture.name} \n`,(err)=>{
              if(err)
                   console.log(err)
        })
        res.status(200).send(picture)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/picturesall', authUser, authAdmin, async (req,res)=>{
    try {
        const pictures = await Picture.find({})
        res.status(200).send(pictures)
        fs.appendFile(__dirname+"/../log.txt",`Action: GET, Type: picturesall, user:${req.user.name} \n`,(err)=>{
                      if(err)
                           console.log(err)
                })
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/picture/:id',async(req,res)=>{
     try {
            const picture = await Picture.findOne({_id:req.params.id})
            if(!picture)
                return res.status(404).send()
            connection.gfsPicture.createReadStream({_id: picture.file._id}).pipe(res);
            fs.appendFile(__dirname+"/../log.txt",`Action: GET,  Type: picture, name: ${picture.name} \n`,(err)=>{
                          if(err)
                               console.log(err)
                    })
     }catch(err){
       return res.status(404).send()
     }
})


module.exports = router