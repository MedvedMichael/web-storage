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

        let gfsVideo, gfsPicture, gfsLogo;
        conn.once('open', () => {
            gfsVideo = Grid(conn.db, mongoose.mongo);
            gfsPicture = Grid(conn.db, mongoose.mongo);
            gfsLogo = Grid(conn.db, mongoose.mongo);
            gfsVideo.collection('videos')
            gfsPicture.collection('pictures')
            gfsPicture.collection('logos')
            connection.gfsLogo = gfsLogo;
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
        const storageLogo = new GridFsStorage({
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
                            bucketName: 'logos'
                        };
                        resolve(fileInfo);
                    });
                });
            }
        });

        let uploadVideo = multer({storage: storageVideo});
        let uploadPicture = multer({storage: storagePicture})
        let uploadLogo = multer({storage: storageLogo})
        connection.uploadVideo = uploadVideo;
        connection.uploadPicture = uploadPicture;
        connection.uploadLogo = uploadLogo;
    }
}

if(!connection.gfsVideo){
    connection.init();
}
module.exports = connection
