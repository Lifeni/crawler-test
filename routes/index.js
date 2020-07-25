const express = require('express')
const router = express.Router()

const handlePage = (req, res) => {
    res.render('index')
}

router.get('/', handlePage)
router.get('/index.html', handlePage)

module.exports = router
