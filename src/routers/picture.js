const express = require('express')
const Picture = require('../models/picture')
//const authSubcategory  = require('../middleware/authSubcategory')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authVideoset = require('../middleware/authVideoset')
const router = new express.Router()

router.post('/picture', authUser, authAdmin, authVideoset, async (req, res) => {
    const picture = new Picture({
        ...req.body,
        owner: req.videoset._id
    })
    try {
        await picture.save()
        res.status(201).send(video)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/pictures', authVideoset, async (req, res) => {
    try {
        await req.videoset.populate({
            path:'pictures'
        }).execPopulate()
        res.status(200).send(req.videoset.pictures)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/picture', authUser, authAdmin, async (req, res) => {
    const id = req.query.id
    try {
        const picture = await Picture.findOneAndDelete({ _id: id })
        if (!video)
            res.status(404).send()
        res.status(200).send(picture)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/picturesall', authUser, authAdmin, async (req,res)=>{
    try {
        const pictures = await Picture.find({})
        res.status(200).send(pictures)
    } catch (error) {
        res.status(500).send()
    }
})




module.exports = router