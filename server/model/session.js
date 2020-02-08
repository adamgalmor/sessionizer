var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
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
