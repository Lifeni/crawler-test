const fs = require('fs')
const faker = require('faker')
const cnchar = require('cnchar')
const moment = require('moment')
const express = require('express')
const router = express.Router()

faker.locale = "zh_CN"
moment.locale("zh-cn")

const poetry = require('../resource/花间集1-4.json')
const poetrySet = new Set()
// console.log(poetry.length) // 200

const itemPerPage = 15
const authorNum = 20
let pageNum = 0

let imagesData = []
let fakersData = []
let authorFakersData = []

const getImages = async () => {
    const images = fs.readdirSync(`${__dirname}/../public/img`)
    pageNum = images.length / itemPerPage + (images.length % itemPerPage ? 1 : 0)
    for (let i = 0; i < pageNum; i++) {
        let temp = []
        for (let j = 0; j < itemPerPage; j++) {
            temp.push(`/img/${images[i * itemPerPage + j]}`)
        }
        imagesData.push(temp)
    }
}

const getFakers = async () => {
    for (let i = 0; i < pageNum; i++) {
        let temp = []
        for (let j = 0; j < itemPerPage; j++) {
            let tempNum = Math.round(Math.random() * poetry.length)
            while (poetrySet.has(tempNum)) {
                tempNum = Math.round(Math.random() * poetry.length)
            }
            poetrySet.add(tempNum)
            const randomPoetry = tempNum
            const randomAuthor = Math.round(Math.random() * 100) % (authorNum)
            let fake = {
                imageId: faker.random.uuid(),
                imageName: faker.lorem.words(),
                imageDate: moment(faker.date.past()).format(),
                imageDateFromNow: moment(faker.date.past()).fromNow(),
                imageLikeCount: Math.round(Math.random() * 200),
                imageDownloadCount: Math.round(Math.random() * 1000),
                authorId: authorFakersData[randomAuthor].id,
                authorName: authorFakersData[randomAuthor].name,
                authorEmail: authorFakersData[randomAuthor].email,
                authorFollowerCount: authorFakersData[randomAuthor].followerCount,
                poetryTitle: poetry[randomPoetry - 1].title,
                poetryAuthor: poetry[randomPoetry - 1].author,
                poetryRhythmic: poetry[randomPoetry - 1].rhythmic,
                poetryContent: poetry[randomPoetry - 1].paragraphs.join(''),
            }
            temp.push(fake)
        }
        fakersData.push(temp)
    }
}

const getAuthorFakers = async () => {
    for (let i = 0; i < authorNum; i++) {
        const name = faker.name.findName()
            .replace(/[^\u4E00-\u9FFF]+/g, '')
        let fake = {
            id: faker.random.uuid(),
            name: name,
            email: `${cnchar.spell(name, 'low')}@example.com`,
            followerCount: Math.round(Math.random() * 300)
        }
        authorFakersData.push(fake)
    }
}

const init = async function () {
    await getImages()
    await getAuthorFakers()
    await getFakers()
}

init().catch(error => {
    console.log(error)
})

const handlePage = (req, res) => {
    const page = Number(req.query.page ? req.query.page : 1)
    const images = imagesData[page - 1]
    if (images) {
        res.render('index', {
            page: page,
            num: pageNum,
            item: itemPerPage,
            images: images,
            fakers: fakersData[page - 1]
        })
    } else {
        res.render('index', {
            page: 1,
            num: pageNum,
            item: itemPerPage,
            images: getImages(1),
            fakers: fakersData[page - 1]
        })
    }
}

router.get('/', handlePage)
router.get('/index.html', handlePage)

module.exports = router
