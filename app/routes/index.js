/**
 * @name: index.route.js
 * @description: Exports routes for all the service
 * @author: Anuj Gupta
 */

const express = require('express')
const router = express.Router({ mergeParams: true })

router.use('/game', require('./game.route'))

module.exports = router