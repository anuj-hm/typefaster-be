const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');

const { APP_CONFIG } = require(`${process.cwd()}/app/config`);
const { logger } = require(`${process.cwd()}/app/helper`);

const app = express();

const monogoPromise = mongoose.connect(
    APP_CONFIG.MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(m => m.connection.getClient())

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: APP_CONFIG.JSON_MAX_LIMIT }));
app.use(session({
    secret: APP_CONFIG.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        name: 'typefaster',
        maxAge: 1 * 60 * 60 * 1000
    },
    store: MongoStore.create({
        clientPromise: monogoPromise,
        dbName: "typefaster",
        stringify: false,
        autoRemove: 'interval',
        autoRemoveInterval: 1
    })
}));

app.use((err, req, res, next) => {
    const { requestId } = req;
    logger.error({ msg: err.stack, requestId });
    res.status(500).json({ message: 'Something failed.' });
});

app.use('/api', require(`${process.cwd()}/app/routes`))

const server = app.listen(APP_CONFIG.PORT, APP_CONFIG.HOST);
logger.info(`Server is up and running ${APP_CONFIG.HOST}:${APP_CONFIG.PORT}`);
