const express = require('express')
const connection = require('./db/mongoose')
connection.init();
const cors = require('cors')
const videoRouter = require('./routers/video')
const videosetRouter = require('./routers/videoset')
const categoryRouter = require('./routers/category')
const subcategoryRouter = require('./routers/subcategory')
const userRouter = require('./routers/user')
const pictureRouter = require('./routers/picture')
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
app.use(videosetRouter)
app.use(categoryRouter)
app.use(subcategoryRouter)
app.use(videoRouter)
app.use(userRouter)
app.use(pictureRouter)

app.listen(PORT,()=>{
    console.log("Listening at " + PORT)
})