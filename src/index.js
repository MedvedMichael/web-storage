const express = require('express')
require('./db/mongoose')

const videoRouter = require('./routers/video')
const categoryRouter = require('./routers/category')
const subcategoryRouter = require('./routers/subcategory')
const userRouter = require('./routers/user')
const pictureRouter = require('./routers/picture')
const PORT = process.env.PORT

const app = express()

app.get('/',(req,res)=>{
    res.status(200).send("Okay")
})

app.use(express.json())
app.use(categoryRouter)
app.use(subcategoryRouter)
app.use(videoRouter)
app.use(userRouter)
app.use(pictureRouter)

app.listen(PORT,()=>{
    console.log("Listening at " + PORT)
})