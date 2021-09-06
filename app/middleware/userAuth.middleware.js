/**
 * @name: userAuth.middleware.js
 * @description: Fetch user token from header and parse the userId
 * from the token and attach userId in the request. so further we
 * can access userId with req.userId
 * @author: Anuj Gupta
 */
const jwt = require('jsonwebtoken')

const { Game } = require('../schema')
const { RSP_OBJ } = require('../constants/response.constant')
const { logger, response: { sendErrorRsp }, token } = require(`${process.cwd()}/app/helper`)


exports.auth = async (req, res, next) => {

  const authToken = req.get('Authorization')
  try {
    let userData;
    if(authToken) {
      userData = token.verifyToken(authToken)
    } else {
      userData = req.session.userData
    }
    const { userId } = userData
    const user = await Game.findOne({ userId })
    if (!user) {
      logger.error({
        msg: 'Error in auth token :: due to user not exist',
        userId
      })
      return sendErrorRsp(res, RSP_OBJ.INVALID_USER_TOKEN)
    } else {
      res.locals.userData = userData
      next()
    }
  } catch (err) {
    logger.error({
      msg: err.message,
      stackTrace: err.stackTrace
    })
    return sendErrorRsp(res, RSP_OBJ.INVALID_USER_TOKEN)
  }
}