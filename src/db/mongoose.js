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
var gfs;
conn.once('open',()=>{
    gfs = Grid(global.conn.db,mongoose.mongo);
    gfs.collection('videos')
})

const storage = new GridFsStorage({
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
var upload = multer({storage});
global.gfs = gfs;
global.upload = upload;
global.conn = conn;

