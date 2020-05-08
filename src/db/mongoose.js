const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


var conn = mongoose.createConnection(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true
})
var gfsVideo, gfsPicture;
conn.once('open',()=>{
    gfsVideo = Grid(global.conn.db,mongoose.mongo);
    gfsPicture = Grid(global.conn.db,mongoose.mongo);
    gfsVideo.collection('videos')
    gfsPicture.collection('pictures')
    global.gfsVideo = gfsVideo;
    global.gfsPicture = gfsPicture;
})

const storageVideo = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'videos'
                };
                resolve(fileInfo);
            });
        });
    }
});
const storagePicture = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'pictures'
                };
                resolve(fileInfo);
            });
        });
    }
});

var uploadVideo = multer({storage:storageVideo});
var uploadPicture = multer({storage: storagePicture})
global.uploadVideo = uploadVideo;
global.uploadPicture = uploadPicture;
global.conn = conn;

