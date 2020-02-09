var mongoose = require('mongoose');

var schema = new mongoose.Schema({
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

var session = new mongoose.model('Session', schema);

module.exports = session;
