const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
let connection = {
    init: () => {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        const conn = mongoose.createConnection(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })

        let gfsVideo, gfsPicture;
        conn.once('open', () => {
            gfsVideo = Grid(conn.db, mongoose.mongo);
            gfsPicture = Grid(conn.db, mongoose.mongo);
            gfsVideo.collection('videos')
            gfsPicture.collection('pictures')
            connection.gfsVideo = gfsVideo;
            connection.gfsPicture = gfsPicture;
        })
        this.conn = conn;
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

        let uploadVideo = multer({storage: storageVideo});
        let uploadPicture = multer({storage: storagePicture})
        connection.uploadVideo = uploadVideo;
        connection.uploadPicture = uploadPicture;
    }
}

if(!connection.gfsVideo){
    connection.init();
}
module.exports = connection
