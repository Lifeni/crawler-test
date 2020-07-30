const fs = require('fs')
const faker = require('faker')
const moment = require('moment')
const express = require('express')
const router = express.Router()

faker.locale = "zh_CN"
moment.locale("zh-cn")

const itemPerPage = 10
let pageNum = 0

let imagesData = []

const getImages = async () => {
    const images = fs.readdirSync(`${__dirname}/../public/image`)
    pageNum = images.length / itemPerPage + (images.length % itemPerPage ? 1 : 0)
    for (let i = 0; i < pageNum; i++) {
        let temp = []
        for (let j = 0; j < itemPerPage; j++) {
            const name = images[i * itemPerPage + j].split('.')[0]
            const dir = `${__dirname}/../resources/Bing Wallpaper Information/${name}.json`
            const info = JSON.parse(fs.readFileSync(dir).toString())
            temp.push({
                url: `/image/${images[i * itemPerPage + j]}`,
                date: moment(name).format('M 月 D 日'),
                text: info['zh-CN']['images'][0]['copyright'],
                like: Math.floor(Math.random() * (2000 - 1500 + 1) + 1500),
                download: Math.floor(Math.random() * (8000 - 5000 + 1) + 5000),
            })
        }
        imagesData.push(temp)
    }
}


getImages().catch((error) => {
    console.log(error)
})


const handlePage = async (req, res) => {
    const page = Number(req.query.page ? req.query.page : 1)
    const images = imagesData[page - 1]
    console.log(images)
    if (images) {
        await res.render('pictures', {
            page: page,
            num: pageNum,
            item: itemPerPage,
            images: images,
        })
    } else {
        await res.status(404)
        await res.send('Not Found')
    }
}

router.get('/', handlePage)
router.get('/index.html', handlePage)

module.exports = router
