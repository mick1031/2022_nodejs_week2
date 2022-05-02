const http = require('http');
const errorHandle = require('./errorHandle');
const { v4: uuidv4 } = require('uuid');
const { url } = require('inspector');
const posts = [];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };

    body = "";

    req.on('data', (chunk) => {
        body += chunk;
    })

    if (req.url == '/posts' && req.method == 'GET') {
        // TODO get
    } else if (req.url == '/posts' && req.method == 'POST') {
        // TODO post
    } else if (req.url.startsWith('/posts') && url.method == 'PATCH') {
        // TODO patch
    } else if (req.url == '/posts' && req.method == 'DELETE') {
        // TODO delete all
    } else if (req.url.startsWith('/posts') && req.method == 'DELETE') {
        // TODO delete one
    } else if(req.url.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    }else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: "false",
            message: "無此網站路由"
        }));
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.POST || 3005);