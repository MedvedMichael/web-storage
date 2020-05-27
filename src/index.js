const express = require('express')
const cors = require('cors')
const videoRouter = require('./routers/video')
const videosetRouter = require('./routers/videoset')
const videosContainerRouter = require('./routers/videos-container')
const categoryRouter = require('./routers/category')
const subcategoryRouter = require('./routers/subcategory')
const userRouter = require('./routers/user')
const pictureRouter = require('./routers/picture')
const pictureSliderRouter = require('./routers/picture-slider')
//TEMPORARY
const bodyParser = require('body-parser')

const PORT = process.env.PORT
const app = express()
app.use(bodyParser.json());
app.use(cors())
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    // TEMPORARY!!!
    res.render('index')
    //res.status(200).send("Okay")
})

app.use(express.json())
app.use('/api',pictureSliderRouter)
app.use('/api',videosetRouter)
app.use('/api',videosContainerRouter)
app.use('/api',categoryRouter)
app.use('/api',subcategoryRouter)
app.use('/api',videoRouter)
app.use('/api',userRouter)
app.use('/api',pictureRouter)

app.listen(PORT,()=>{
    console.log("Listening at " + PORT)
})