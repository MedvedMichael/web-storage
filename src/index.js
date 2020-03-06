const express = require('express')
require('./db/mongoose')

const videoRouter = require('./routers/video')

const PORT = process.env.PORT

const app = express()

app.get('/',(req,res)=>{
    res.status(200).send("Okay")
})

app.use(express.json())
app.use(videoRouter)

app.listen(PORT,()=>{
    console.log("Listening at " + PORT)
})