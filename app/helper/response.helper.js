const { RSP_MSG, RSP_CODE, RSP_OBJ } = require(`${process.cwd()}/app/constants/response.constant`)

/**
 * Function used to generate error object, common for error response
 * @param {Object} {code, message, httpCode} Each error message always contain those parameter
 * @param {Object}  error if any extra information want to send 
 */
const errorObject = ({ code, message = RSP_MSG.SERVER_ERROR, httpCode }, error) => {
  return {
    status: RSP_MSG.FAILED,
    code: code,
    message: message,
    error: error,
    httpCode,
  }
}

/**
 * Function used to generate success object, common for success response
 * @param {object} data 
 * @param {object} {code, message, httpCode} 
 */
const successObject = (data, { code = RSP_OBJ.SUCCESS.code, message = RSP_OBJ.SUCCESS.message } = {}) => {
  return {
    status: RSP_MSG.SUCCESS,
    code: code,
    message: message,
    data: data
  }
}

/**
 * 
 * @param {Express resp object} expRsp 
 * @param {Object} data
 * @param {Object} {code, message, httpCode}
 */
const sendSuccessRsp = (expRsp, { data, code, message = RSP_MSG.SUCCESS, httpCode = RSP_CODE.SUCCESS } = {}) => {
  return expRsp.status(httpCode).send(successObject(data, { code, message, httpCode }))
}

/**
 * 
 * @param {Express resp object} expRsp 
 * @param {Object} {code, message, httpCode} Each error message always contain those parameter
 * @param {Object}  error if any extra information want to send 
 */
const sendErrorRsp = (expRsp, { code, message = RSP_MSG.SERVER_ERROR, httpCode = RSP_CODE.SERVER_ERROR, error } = {}) => {
  return expRsp.status(httpCode).send(errorObject({ code, message }, error))
}

module.exports = { sendSuccessRsp, sendErrorRsp, errorObject, successObject }