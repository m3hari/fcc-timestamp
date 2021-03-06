/**
 * @author Mehari Geta <gmehari.edu@gmail.com>
 * created on : May 20 ,2017
 */

const http = require('http');
const URL = require('url');

const PORT = 3030;
const DEBUG = true;
const SPACE_CHAR_REGX = /%20/g;
const INVALID_DATE_ERROR = 'Invalid Date';

/**
 * validate dateTime is a valid date string or a valid timestamp integer
 * @param {number | string} dateTime 
 * 
 */
function isValidDate(dateTime) {
    let isNum = !isNaN(parseInt(dateTime));
    if (isNum) {
        let time = parseInt(dateTime);
        return new Date(time) == INVALID_DATE_ERROR ? false : true;
    }
    if (!isNum && typeof dateTime === 'string') {
        let dt = dateTime.replace(SPACE_CHAR_REGX, ' ');
        if (dt.trim() === '') {
            return true;
        }
        return new Date(dt) == INVALID_DATE_ERROR ? false : true;
    }
    return false;
}

/**
 * returns object that has unix timestamp  and human readable date string properties
 *  of a given query if it is a valid date
 * @param {string} query client request query
 */
function timeStampService(query) {
    if (isValidDate(query)) {
        const dateTime = (typeof query === 'string') ? query.replace(SPACE_CHAR_REGX, ' ') : query;
        let date = new Date(dateTime);
        if (query.trim() === '') {
            date = new Date();
        }
        let isNum = !isNaN(parseInt(dateTime));
        if (isNum) {
            date = new Date(parseInt(dateTime));
        }
        return `{"unix":${ date.getTime() },"natural":"${date.toDateString()}"}`;
    }

    return `{"error":"Invalid Date" }`;
}

/**
 * Handles incoming http request
 * @param {Request} request 
 * @param {Response} response 
 */
function requestHandler(request, response) {
    const parsedUrl = URL.parse(request.url, true);
    const path = parsedUrl.path;
    const query = path.substring(1, path.length); //remove the trailing slash from the path
    if (query === 'favicon.ico') {
        response.writeHead(200, {
            'Content-Type': 'image/x-icon'
        });
        return response.end();
    }

    const result = timeStampService(query);
    response.writeHead(200, {
        'Content-Type': 'text/json'
    });
    response.write(result);
    return response.end();



}

/**
 * server start hook  
 */
function startHook() {
    if (DEBUG) {
        console.info('Server started . . .');
    }
}

const server = http.createServer(requestHandler);
server.listen(process.env.PORT || PORT, startHook);