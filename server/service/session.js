const mongoose = require('mongoose');
const session = mongoose.model('Session');

module.exports = {
    collectSession,
    findSession,
    updateSessionById
};

/**
 * Execute the create query in order to save the session data in MongoDB.
 * This is done so that other nodes\proccess can retrieve an manipulate sessions accross all nodes
 * @param {*} data session data
 */
async function collectSession(data) {
    return await session.create(data);
}

/**
 * Function to find a specific session by the DB record ID and update it's data (the query strings payload)
 * @param {*} id session record id (not the sessionId)
 * @param {*} data session data
 */
async function updateSessionById(id, data){
    return session.findByIdAndUpdate({ _id: id }, data);
}

/**
 * Function to find a specific session by the sessionId sent from the client's sessionId coockie value
 * @param {*} sessionId session id from the coockie value
 */
async function findSession(sessionId) {
    return await session.findOne(sessionId);
}
