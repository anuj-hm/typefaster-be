const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    timeTaken: {
        type: Number,
    },
    isNotified: {
        type: Boolean,
    }
})

gameSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.gameId = ret._id
        delete ret._id;
        delete ret.__v;
    }
})

const Game = mongoose.model('game', gameSchema)

module.exports = Game