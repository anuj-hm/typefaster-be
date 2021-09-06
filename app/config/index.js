module.exports.APP_CONFIG = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 4000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'testtypefasterbefe',
  JSON_MAX_LIMIT: process.env.JSON_MAX_LIMIT || '1mb',
  MONGO_DB_URL: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/typefaster',
  LOGGER: {
    settings: {
      base: null,
      timestamp: false,
    },
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  COUNTER_TIME: 3,
  TOKEN_CONFIG: {
    SECRET: process.env.SECRET || 'hkshf84xnvh23di2qa11qw',
    ALGORITHM: process.env.ALGORITHM || 'HS256',
    EXPIRESIN: process.env.EXPIRESIN || '60 minutes',
  },
  TEXT_STRING: process.env.TEXT_STRING || 'Giving directions that the mountains are to the west only works when you can see them.'

}