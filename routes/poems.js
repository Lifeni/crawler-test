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

const poemSchema = new Schema({
    author: String,
    author_desc: String,
    paragraphs: Array,
    rhythmic: String,
})

const Poems = mongoose.model('Poems', poemSchema)

const handleIndexPage = async (req, res) => {
    Poems.aggregate([{
        $group: {
            _id: "$author",
            count: { $sum: 1 }
        }
    }, { $sort: { "count": -1 } }]).then(async (data) => {
        await res.render('poems-index', { data: data })
    })

}

const handleAuthorPage = async (req, res, name) => {
    Poems.find({ author: decodeURI(name) }).then(async (data) => {
        // console.log(data)
        if (!data[0]) {
            await res.status(404)
            await res.send('Not Found')
        } else {
            // console.log(data)
            await res.render('poems-author', {
                author: decodeURI(name),
                description: data[0].author_desc ? data[0].author_desc : '--',
                data: data,
            })
        }
    })
}

const handlePoemsPage = (req, res, author, name) => {
    const rhythmic = decodeURI(name.split('@')[0])
    const id = name.split('@')[1]
    console.log(id)
    Poems.find({ author: decodeURI(author), rhythmic: rhythmic, }).then(async (data) => {
        return data.find((poem) => {
            return poem['_id'].toString().includes(id)
        })
    }).then(async (result) => {
        if (!result) {
            await res.status(404)
            await res.send('Not Found')
        } else {
            await res.render('poems-poem', {
                author: decodeURI(author),
                data: result,
            })
        }
    })
}

// router.get('/', handlePage)
router.get('/*', async (req, res) => {
    const path = req.path.replace(/\/poems/, '').split('/').filter((e) => e !== '')
    if (!path[0]) {
        await handleIndexPage(req, res)
    } else if (!path[1]) {
        await handleAuthorPage(req, res, path[0])
    } else {
        await handlePoemsPage(req, res, path[0], path[1])
    }
})

module.exports = router
