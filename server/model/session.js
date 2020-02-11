const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    data: {
        type: Object
    },
    sessionId: {
        type: String
    },
    ttl: {
        type: Date
    }
});

const session = new mongoose.model('Session', schema);

module.exports = session;
