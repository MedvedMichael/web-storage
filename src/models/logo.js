const mongoose = require('mongoose')
const connection = require('../db/mongoose')

const logoSchema = new mongoose.Schema({
    source: {
        type: String,
        default: 'external'
    },
    file: {
        type: Object
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Videoset'
    }
})
logoSchema.pre('remove', async function (next){
    const logo = this
    if(logo.source === 'local')
        try{
            await connection.gfsLogo.remove({ _id: logo.file, root: "logos" })
        }
        catch(error){
            console.log(error)
        }
    next()
})

const Logo = mongoose.model('Logo', logoSchema)

module.exports = Logo