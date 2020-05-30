const express = require('express')
const Logo = require('../models/logo')
//const authSubcategory  = require('../middleware/authSubcategory')
const connection = require('../db/mongoose')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authVideoset = require('../middleware/authVideoset')
const router = new express.Router()
const fs = require('fs')
router.post('/logo/upload/:id', connection.uploadLogo.any("logofile"), async (req, res) => {
    try {
        const logo = await Logo.findOne({ _id: req.params.id })
        logo.file = req.files[0].id
        await logo.save()
        res.status(201).send(logo)
        fs.appendFile(__dirname + "/../log.txt", `Action: POST,  Type: logo\n`, (err) => {
            if (err)
                console.log(err)
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
})
router.post('/logo', authUser, authAdmin, authVideoset, async (req, res) => {
    const previousLogo = await Logo.findOne({owner:req.videoset._id})
    const logo = new Logo({
        ...req.body,
        owner: req.videoset._id
    })
    try {
        if(previousLogo)
            await previousLogo.remove()
        
        await logo.save()
        req.videoset.hasLogo = true
        await req.videoset.save()

        
        
        
        res.status(201).send(logo)
        fs.appendFile(__dirname + "/../log.txt", `Action: POST, user:${req.user.name} Type: Logo \n`, (err) => {
            if (err)
                console.log(err)
        })
    } catch (error) {

        res.status(400).send(error)
    }
})


router.delete('/logo', authUser, authAdmin, async (req, res) => {
    const id = req.query.id
    try {
        const logo = await Logo.findOne({ _id: id })
        if (!logo)
            return res.status(404).send()
        await logo.remove()

        fs.appendFile(__dirname + "/../log.txt", `Action: DELETE, user:${req.user.name}, Type: logo \n`, (err) => {
            if (err)
                console.log(err)
        })
        res.status(200).send(logo)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/logo', authVideoset, async (req, res) => {
    try {
        const logo = await Logo.findOne({ owner: req.videoset._id })
        if (!logo)
            return res.status(404).send()

        connection.gfsLogo.createReadStream({ _id: logo.file }).pipe(res);
        fs.appendFile(__dirname + "/../log.txt", `Action: GET,  Type: logo \n`, (err) => {
            if (err)
                console.log(err)
        })
    } catch (err) {
        return res.status(404).send()
    }
})


module.exports = router