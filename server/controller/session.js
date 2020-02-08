var sessionService = require('../service/session');
var crypto = require('crypto');
var moment = require('moment');
var global = require('../config/global');

var generate_key = function() {
    return crypto.randomBytes(16).toString('base64');
};

/**
 * Function to collect session data.
 */
exports.collect = function (req, res, next) {
    if(req.cookies['sessionId']){
        let query = { sessionId: req.cookies['sessionId'] };

        //if we get a cookie, try to find the session record in the DB
        sessionService.findSession(query, function (error, result) {
            if (error) {
                res.status(404).send(error);
                return;
            }
            if (result) {
                //if the session record is found in the DB, go to the sessionFoundHandler and check for the session TTL (experation) 
                sessionFoundHandler(req, res, result);
            }
            if (!result) {
                //if the session record is not found in the DB, (because of the cleaning process who removes expired sessions) then create a new session record in the DB
                sessionNotFoundHandler(req, res);
            }
        });
    }
    else{
        sessionNotFoundHandler(req, res);
    }

}

var sessionFoundHandler = function(req, res, sessionContext){
    //if the session expired create a new SID else use the same one, then update the data. (always update the TTL):
    let session = Date.now() > sessionContext.ttl ? new Session(req.query) : new Session(req.query, sessionContext.sessionId);

    sessionService.updateSessionById(sessionContext.id, session, (err, response) => {
        if (response) {
            res.cookie('sessionId', session.sessionId, { expires: session.ttl, httpOnly: true });
            res.status(201).send(response);
        } else if (err) {
            res.status(400).send(err);
        }
    });
}

var sessionNotFoundHandler = function(req, res){
    //create a new UID, save the data and send the client a coockie with the UID
    let session = new Session(req.query);
    
    sessionService.collectSession(session, function (error, response) {
        if (response) {
            res.cookie('sessionId',session.sessionId, { maxAge: session.ttl, httpOnly: true });
            res.status(201).send(response);
        } else if (error) {
            res.status(400).send(error);
        }
    });
}

class Session {
    constructor(queryString, sessionId) {
        this.name = queryString.name;
        this.age = queryString.age;
        this.sessionId = sessionId || generate_key();
        this.ttl = moment().add(global.MINUTES_FOR_TTL, 'm').toDate();
    }
}
