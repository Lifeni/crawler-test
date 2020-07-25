const moment = require('moment')
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Schema = mongoose.Schema

moment.locale("zh-cn")

mongoose.connect('mongodb://127.0.0.1/data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sentenceSchema = new Schema({
    id: Number,
    hitokoto: String,
    type_id: Number,
    type_name: String,
    type_desc: String,
    from: String,
    from_who: String,
    creator: String,
    created_at: String,
})

const Sentences = mongoose.model('Sentences', sentenceSchema)

const handlePage = async (req, res) => {
    const id = Number(req.query.id ? req.query.id : -1)

    if (id === -1) {
        const data = await Sentences.aggregate().sample(1)
        await res.render('sentences', {
            id: data[0].id,
            text: data[0].hitokoto,
            date: data[0].created_at,
            from: data[0].from,
            fromWho: data[0].from_who,
            creator: data[0].creator,
            typeName: data[0].type_name,
            typeDesc: data[0].type_desc,
        })

    } else {
        const data = await Sentences.find({ id: id })
        if (data[0]) {
            await res.render('sentences', {
                id: data[0].id,
                text: data[0].hitokoto,
                date: data[0].created_at,
                from: data[0].from,
                fromWho: data[0].from_who,
                creator: data[0].creator,
                typeName: data[0].type_name,
                typeDesc: data[0].type_desc,
            })
        } else {
            await res.status(404)
            await res.send('Not Found')
        }
    }

}

router.get('/', handlePage)
router.get('/index.html', handlePage)

module.exports = router
