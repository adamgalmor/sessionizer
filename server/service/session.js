(function () {
    var mongoose = require('mongoose');
    var session = mongoose.model('Session');
    /**
     * Function to execute the create query to save the session data in MongoDB.
     * This is done so that other nodes\proccess can retrieve an manipulate sessions accross the swarm
     * @param {*} data session data
     * @param {*} callback callback function.
     */
    exports.collectSession = function (data, callback) {
        session.create(data).then((response) => {
            callback(null, response);
        }, (error) => {
            callback(error, null);
        });
    };

    exports.updateSessionById = function (id, data, callback) {
        session.findByIdAndUpdate({
            _id: id
        }, data, (err, response) => {
            callback(err, response);
        });
    }

    exports.findSession = function (query, callback) {
        session.findOne(query, callback);
    }    
})()