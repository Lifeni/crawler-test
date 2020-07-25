/**
 * 用于把 resources 中的数据存入数据库
 * 数据库采用 MongoDB，默认端口 27017
 */

const fs = require('fs')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

const Poems = mongoose.model('Poems', poemSchema);

const poemsDir = `${__dirname}/resources/Chinese Poetry/Song Ci/`
const authorsDir = `${__dirname}/resources/Chinese Poetry/`

const authorMap = new Map()

const getAuthors = async () => {
    const authorsList = JSON.parse(fs.readFileSync(authorsDir + 'author.song.json').toString())
    for (let i = 0; i < authorsList.length; i++) {
        authorMap.set(authorsList[i].name, authorsList[i].description)
    }
}

const getPoems = () => {
    const poemsList = fs.readdirSync(poemsDir)
    for (let i = 0; i < poemsList.length; i++) {
        const poemsData = JSON.parse(fs.readFileSync(poemsDir + poemsList[i]).toString())

        for (let j = 0; j < poemsData.length; j++) {
            poemsData[j].author_desc = authorMap.get(poemsData[j].author)
        }

        Poems.insertMany(poemsData).then((docs) => {
            console.log('[宋词] 插入数据：' + docs.length)
        }).catch(error => {
            console.log(error)
        })
    }
}

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

const Sentences = mongoose.model('Sentences', sentenceSchema);

const sentencesDir = `${__dirname}/resources/Sentences Bundle/Sentences/`
const categoriesDir = `${__dirname}/resources/Sentences Bundle/`

const categoryMap = new Map()

const getCategories = async () => {
    const categoriesList = JSON.parse(fs.readFileSync(categoriesDir + 'categories.json').toString())
    for (let i = 0; i < categoriesList.length; i++) {
        categoryMap.set(categoriesList[i].key, {
            id: categoriesList[i].id,
            name: categoriesList[i].name,
            desc: categoriesList[i].desc,
        })
    }
}

const getSentences = async () => {
    const sentencesList = fs.readdirSync(sentencesDir)
    for (let i = 0; i < sentencesList.length; i++) {
        const sentencesData = JSON.parse(fs.readFileSync(sentencesDir + sentencesList[i]).toString())

        for (let j = 0; j < sentencesData.length; j++) {
            const type = categoryMap.get(sentencesData[j].type)
            sentencesData[j].type_id = type.id
            sentencesData[j].type_name = type.name
            sentencesData[j].type_desc = type.desc
        }

        Sentences.insertMany(sentencesData).then((docs) => {
            console.log('[一言] 插入数据：' + docs.length)
        }).catch(error => {
            console.log(error)
        })
    }
}

const init = async () => {
    await getCategories()
    await getSentences()
    await getAuthors()
    await getPoems()
}

init().catch(error => {
    console.log(error)
})