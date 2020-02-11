const sessionService = require('../service/session');
const crypto = require('crypto');
const moment = require('moment');
const global = require('../config/global');

const generate_key = function() {
    return crypto.randomBytes(16).toString('base64');
};

/**
 * Function to collect session data.
 */
exports.collect = (req, res) => {
    //if we get a cookie
    if(req.cookies['sessionId']){
        let query = { sessionId: req.cookies['sessionId'] };

        //try to find the session record in the DB
        sessionService.findSession(query).then(result => {
            if (result) {
                //if the session record is found in the DB, go to the sessionFoundHandler and check for the session TTL (experation) 
                sessionFoundHandler(req, res, result);
            }
            else if(!result) {
                //if the session record is not found in the DB, (because of the cleaning process who removes expired sessions) then create a new session record in the DB
                sessionNotFoundHandler(req, res);
            }
        }).catch(error => {
            res.status(400).send(error);
        });
    }
    //else means we didnt get any sessionId value from the cilent, either because it expired or this is the first time the user connect
    else{
        sessionNotFoundHandler(req, res);
    }

}

const sessionFoundHandler = (req, res, sessionContext) => {
    //if the session expired create a new SID else use the same one, then update the data. (always update the TTL):
    let session = Date.now() > sessionContext.ttl ? new Session(req.query) : new Session(req.query, sessionContext.sessionId);

    sessionService.updateSessionById(sessionContext.id, session).then(result => {
        res.cookie('sessionId', session.sessionId, { expires: session.ttl, httpOnly: true });
        res.status(201).send(session);        
    }).catch(error => {
        res.status(400).send(error);
    });
}

const sessionNotFoundHandler = (req, res) => {
    //create a new SID, save the data and send the client a coockie with the SID
    let session = new Session(req.query);
    
    sessionService.collectSession(session).then(result => {
        res.cookie('sessionId',session.sessionId, { expires: session.ttl, httpOnly: true });
        res.status(201).send(result);        
    }).catch(error =>{
        res.status(400).send(error);
    });
}

class Session {
    constructor(queryStrings, sessionId) {
        this.data = queryStrings;
        this.sessionId = sessionId || generate_key(); //if the current SID is present use it, else generate a new SID
        this.ttl = moment().add(global.MINUTES_FOR_TTL, 'm').toDate(); //on every reqeust the server recieves, the session TTL is updated
    }
}
