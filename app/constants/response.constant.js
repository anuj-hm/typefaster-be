const RSP_CODE = {
    SERVER_ERROR: 500,
    SUCCESS: 200,
    CLIENT_ERROR: 400,
    UN_AUTHORIZED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400
}

const RSP_MSG = {
    // Error message
    SERVER_ERROR: 'Internal server error',
    CLIENT_ERROR: 'Invalid request received',
    SUCCESS: 'Success',
    FAILED: 'Failed',
}

const RSP_OBJ = {
    SUCCESS: { code: 100000, message: 'Success', httpCode: RSP_CODE.SUCCESS },
    INVALID_REQUEST: { code: 100001, message: 'Invalid request received', httpCode: RSP_CODE.CLIENT_ERROR },
    SERVER_ERROR: { code: 100002, message: 'Something went wrong', httpCode: RSP_CODE.SERVER_ERROR },
    INVALID_USER_TOKEN: { code: 100003, message: 'Invalid token', httpCode: RSP_CODE.UN_AUTHORIZED },

}
module.exports = { RSP_MSG, RSP_CODE, RSP_OBJ }