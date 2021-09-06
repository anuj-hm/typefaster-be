const _ = require('lodash')
const uuid = require('uuid')
const mongoose = require('mongoose')

const { Game } = require(`${process.cwd()}/app/schema`)
const { APP_CONFIG } = require(`${process.cwd()}/app/config`)
const { logger, response: { sendErrorRsp, sendSuccessRsp }, token } = require(`${process.cwd()}/app/helper`)
const { RSP_OBJ } = require(`${process.cwd()}/app/constants/response.constant`)

const text = APP_CONFIG.TEXT_STRING

const start = async (req, res) => {
    try {
        let userData;
        if (req.session && req.session.userData) {
            userData = req.session.userData
        } else {
            const userId = uuid.v4()
            userData = {
                userId,
                text,
                startTime: new Date().toISOString()
            }
        }
        const query = {
            userId: userData.userId,
            text: userData.text,
        }
        const result = await Game.findOneAndUpdate(query, { $set: userData }, { upsert: true, new: true })

        if (!result) {
            logger.error({
                msg: 'Unable to save data',
                data: game
            })
            return sendErrorRsp(res, RSP_OBJ.SERVER_ERROR)
        }
        req.session.userData = userData

        const jwtToken = token.generateToken(userData)

        return sendSuccessRsp(res, { data: { userData, jwtToken } })
    } catch (err) {
        logger.error({
            msg: err.message,
            stackTrace: err.stackTrace
        })
        return sendErrorRsp(res, RSP_OBJ.SERVER_ERROR)
    }
}

const checkStatus = async (req, res) => {
    const { userData } = res.locals

    if (!userData) {
        logger.error({
            msg: 'Invalid session request received'
        })
        return sendErrorRsp(res, RSP_OBJ.INVALID_REQUEST)
    }

    const { userId, text } = userData
    let isGameFinished = false

    try {
        const fastestUsers = await Game.find({ text, timeTaken: { $gt: 0 } }).sort({ timeTaken: 1 }).exec()
        let message;
        if (fastestUsers.length > 1) {
            if (fastestUsers[0].userId === userId) {
                message = "You won the match."
            } else {
                message = "You lost the match."
            }
            // Update the notofy once we have the result
            await Game.findOneAndUpdate({ userId, text }, { $set: { isNotified: true } })
            const isAllNotified = await Game.countDocuments({ text, timeTaken: { $gt: 0 }, isNotified: true })        
            req.session.destroy()
            // if all user notified need to delete the user from game
            if (isAllNotified === fastestUsers.length) {
                isGameFinished = true
                await Game.deleteMany({ text })
            }
        }

        return sendSuccessRsp(res, {
            data: {
                gameFinished: isGameFinished,
                result: message || "please wait, waiting for finish the game."
            }
        })
    } catch (err) {
        logger.error({
            msg: err.message,
            stackTrace: err.stackTrace
        })
        return sendErrorRsp(res, RSP_OBJ.SERVER_ERROR)
    }
}

const finish = async (req, res) => {
    try {
        const { userText } = req.query
        const { userData } = res.locals

        if (!userData) {
            logger.error({
                msg: 'Invalid session request received'
            })
            return sendErrorRsp(res, RSP_OBJ.INVALID_REQUEST)
        }

        if (userText !== userData.text) {
            logger.error({
                msg: 'Invalid input provided'
            })
            return sendErrorRsp(res, RSP_OBJ.INVALID_REQUEST)
        }

        const { userId, text, startTime } = userData
        const endTime = new Date()
        const timeTaken = endTime - new Date(startTime)

        const game = {
            ...userData,
            endTime: endTime.toISOString(),
            timeTaken
        }
        const result = await Game.findOneAndUpdate({ userId, text }, { $set: game }, { upsert: true, new: true })

        if (!result) {
            logger.error({
                msg: 'Unable to update data',
                data: game
            })
            return sendErrorRsp(res, RSP_OBJ.SERVER_ERROR)
        }

        return sendSuccessRsp(res, { data: { result: "please wait, waiting for finish the game." } })
    } catch (err) {
        logger.error({
            msg: err.message,
            stackTrace: err.stackTrace
        })
        return sendErrorRsp(res, RSP_OBJ.SERVER_ERROR)
    }

}

module.exports = {
    start,
    checkStatus,
    finish,
}