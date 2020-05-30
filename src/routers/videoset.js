const { Router } = require('express')
const Videoset = require('../models/videoset')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const authSubcategory = require('../middleware/authSubcategory')
const authCategory = require('../middleware/authCategory')
const authVideoset = require('../middleware/authVideoset')
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const router = new Router()
const fs = require('fs')
router.post('/videoset', authUser, authAdmin, authSubcategory, async (req, res) => {
    const videoset = new Videoset({
        ...req.body,
        owner: req.subcategory._id
    })

    try {
        await videoset.save()
        res.status(201).send(videoset)
        const category = await Category.findOne({ _id: req.subcategory.owner })
        let { lastVideosets } = category
        if (!lastVideosets)
            lastVideosets = []
        lastVideosets.unshift(videoset._id)
        while (lastVideosets.length > 20) {
            lastVideosets.pop();
        }
        await Category.findOneAndUpdate({ _id: category._id }, { lastVideosets });
        fs.appendFile(__dirname + "/../log.txt", `Action: POST, Type: videoset, user:${req.user.name}, name:${videoset.name}  \n`, (err) => {
            if (err)
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

router.get('/videosets', authSubcategory, async (req, res) => {
    try {
        await req.subcategory.populate({
            path: 'videosets'
        }).execPopulate()
        res.status(200).send(req.subcategory.videosets.map((videoset) => {
            videoset.subcategoryName = req.subcategory.name
            return videoset
        }))
        fs.appendFile(__dirname + "/../log.txt", `Action: GET ,Type: videoset, subcategoryID:${req.subcategory._id} \n`, (err) => {
            if (err)
                console.log(err)
        })
    }
    catch (error) {
        res.status(500).send()
    }
})

router.get('/videosets-last-10', authCategory, async (req, res) => {
    const { lastVideosets } = req.category
    try {
        const last10Videosets = await Videoset.find({
            _id: {
                $in: lastVideosets
            }
        })
        for(let i=0;i<last10Videosets.length;i++){
            const videoset = last10Videosets[i]
            const subcategory = await Subcategory.findOne({ _id: videoset.owner })
            const temp = {...videoset}
            last10Videosets[i] = {...temp._doc,subcategoryName:subcategory.name}
        }

        res.status(200).send(last10Videosets.slice(0, 10).reverse())
    }
    catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.get('/videoset/:id', async (req, res) => {
    try {
        const videoset = await Videoset.findOne({ _id: req.params.id })
        if (!videoset)
            return res.status(404).send()

        res.status(200).send(videoset)
        fs.appendFile(__dirname + "/../log.txt", `Action: GET, Type: videoset, name:${videoset.name} \n`, (err) => {
            if (err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})


router.patch('/videosets', authUser, authAdmin, authMainAdmin, authVideoset, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'isPublished', 'order', 'owner']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const { videoset } = req

        updates.forEach((update) => videoset[update] = req.body[update])
        await videoset.save()


        res.status(200).send(videoset)
        fs.appendFile(__dirname + "/../log.txt", `Action: PATCH, Type: videoset, user:${req.user.name},name:${videoset.name} \n`, (err) => {
            if (err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/videoset', authUser, authAdmin, async (req, res) => {
    const id = req.query.id
    try {
        const videoset = await Videoset.findOne({ _id: id });
        if (!videoset)
            res.status(400).send()

        await videoset.remove()
        res.status(201).send(videoset)
        fs.appendFile(__dirname + "/../log.txt", `Action: DELETE, Type: videoset, user:${req.user.name},name:${videoset.name}  \n`, (err) => {
            if (err)
                console.log(err)
        })
    }
    catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router