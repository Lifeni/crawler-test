const fs = require('fs')
const faker = require('faker')
const moment = require('moment')
const express = require('express')
const router = express.Router()

// faker.locale = "zh_CN"

const itemPerPage = 15
let pageNum = 0

const getImages = (page) => {
    const images = fs.readdirSync(`${__dirname}/../public/img`)
    let array = []
    let result = images.map((image, index) => {
        array.push(`/img/${image}`)
        if ((index + 1) % itemPerPage === 0 || index === images.length - 1) {
            const temp = array
            array = []
            return temp
        }
    }).filter(Boolean)
    pageNum = result.length
    if (page) {
        return result[page - 1]
    }
}

getImages()

const getFakers = () => {
    let array = []
    for (let i = 0; i < itemPerPage; i++) {
        let fake = {
            imageId: faker.random.uuid(),
            imageName: faker.lorem.words(),
            imageDescription: faker.lorem.lines(),
            imageDate: faker.date.past(),
            imageDateFromNow: moment(faker.date.past()).fromNow(),
            imageLikeCount: Math.round(Math.random() * 200),
            imageDownloadCount: Math.round(Math.random() * 1000),
            authorId: faker.random.uuid(),
            authorName: faker.name.findName(),
            authorEmail: faker.internet.exampleEmail(),
            authorFollowerCount: Math.round(Math.random() * 300)
        }
        array.push(fake)
    }
    return array
}

const handlePage = (req, res) => {
    console.log(req.query.page)
    const page = Number(req.query.page ? req.query.page : 1)
    const images = getImages(page)
    if (images) {
        res.render('index', {
            page: page,
            num: pageNum,
            item: itemPerPage,
            images: images,
            fakers: getFakers()
        })
    } else {
        res.render('index', {
            page: 1,
            num: pageNum,
            item: itemPerPage,
            images: getImages(1),
            fakers: getFakers()
        })
    }
}

router.get('/', handlePage)
router.get('/index.html', handlePage)

module.exports = router
