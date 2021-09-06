const express = require('express')
const { gameService } = require(`${process.cwd()}/app/services`)
const { authMiddleware } = require(`${process.cwd()}/app/middleware`)

const router = express.Router()

router.get('/start', gameService.start)
router.get('/checkstatus', authMiddleware.auth, gameService.checkStatus)
router.get('/finish', authMiddleware.auth, gameService.finish)

module.exports = router