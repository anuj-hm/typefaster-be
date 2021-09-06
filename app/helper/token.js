const jwt = require('jsonwebtoken');

const { APP_CONFIG: { TOKEN_CONFIG } } = require(`${process.cwd()}/app/config`);

const generateToken = (data) => jwt.sign({ ...data }, TOKEN_CONFIG.SECRET, {
    algorithm: TOKEN_CONFIG.ALGORITHM,
    expiresIn: TOKEN_CONFIG.EXPIRESIN,
});

const verifyToken = (token) => jwt.verify(token, TOKEN_CONFIG.SECRET);

module.exports = {
    verifyToken,
    generateToken,
};
