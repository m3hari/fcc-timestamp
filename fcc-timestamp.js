/**
 * @author Mehari Geta <gmehari.edu@gmail.com>
 * created on : May 20 ,2017
 */

const http = require('http');
const url = require('url');

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
    if (!dateTime) {
        return false;
    }
    if (typeof dateTime === 'number') {
        return new Date(dateTime) == INVALID_DATE_ERROR ? false : true;

    }
    if (typeof dateTime === 'string') {
        let dt = dateTime.replace(SPACE_CHAR_REGX, ' ');
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
        const date = new Date(dateTime);
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
    if (DEBUG) {
        console.info('Received http request.');
    }

    if (request.url === 'favicon.ico') {
        response.writeHead(200, {
            'Content-Type': 'image/x-icon'
        });
        return response.end();
    }

    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.path;
    const query = path.substring(1, path.length); //remove the trailing slash from the path
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