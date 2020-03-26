const express = require('express')
require('./db/mongoose')
const cors = require('cors')

const videoRouter = require('./routers/video')
const categoryRouter = require('./routers/category')
const subcategoryRouter = require('./routers/subcategory')
const userRouter = require('./routers/user')
const PORT = process.env.PORT

const app = express()
app.use(cors())
app.get('/',(req,res)=>{
    res.status(200).send("Okay")
})

app.use(express.json())
app.use(categoryRouter)
app.use(subcategoryRouter)
app.use(videoRouter)
app.use(userRouter)

app.listen(PORT,()=>{
    console.log("Listening at " + PORT)
})