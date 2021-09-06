const pino = require('pino');

const {
  APP_CONFIG: { LOGGER: { settings, logLevel } },
} = require(`${process.cwd()}/app/config`);

const formatters = {
  level: (data) => {
    return { level: data };
  },
};

const logger = pino({ ...settings, formatters });

if (logLevel) {
  logger.level = logLevel;
}

module.exports = logger;
