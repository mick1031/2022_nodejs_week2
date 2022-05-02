const http = require('http');
const errorHandle = require('./errorHandle');
const { v4: uuidv4 } = require('uuid');
const { url } = require('inspector');
const posts = [
    {
        "id": "172de546-d3bf-4996-b3e1-5ea6526a6b32",
        "name": "米刻",
        "tags": [
            "感情",
            "幹話"
        ],
        "type": "group",
        "image": "https://images.unsplash.com/photo-1651443039959-582bbea6be6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        "content": "這是一個測試的貼文",
        "likes": 168,
        "comments": 66
    }
];

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
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: "success",
            data: posts,
        }));
        res.end();
    } else if (req.url == '/posts' && req.method == 'POST') {
        // TODO post
        req.on('end', () => {
            try {
                const formData = JSON.parse(body);
                const model = {
                    id: uuidv4(),
                    name: formData.name,
                    tags: formData.tags,
                    type: formData.type,
                    image: formData.image,
                    content: formData.content,
                    likes: formData.likes,
                    comments: formData.comments
                };

                posts.push(model);

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: "success",
                    data: posts,
                }));
                res.end();
            } catch (error) {
                errorHandle(res);
            }
        })
    } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
        // TODO patch
        req.on('end', () => {
            try {
                const id = req.url.split('/').pop();
                const index = posts.findIndex((element) => (element.id == id));
                const formData = JSON.parse(body);

                if (index !== -1 && formData != undefined) {
                    const model = posts[index];
                    model.name = formData.name;
                    model.tags = formData.tags;
                    model.type = formData.type;
                    model.image = formData.image;
                    model.content = formData.content;
                    model.likes = formData.likes;
                    model.comments= formData.comments;

                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: "success",
                        data: posts,
                    }));
                    res.end();
                } else {
                    errorHandle(res);
                }
            } catch (error) {
                errorHandle(res);
            }
        })
    } else if (req.url == '/posts' && req.method == 'DELETE') {
        // TODO delete all
        posts.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: "success",
            data: posts,
        }));
        res.end();
    } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
        // TODO delete one
        const id = req.url.split('/').pop();
        const index = posts.findIndex((element) => (element.id == id));
        if (index !== -1) {
            posts.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                status: "success",
                data: posts,
            }));
            res.end();
        } else {
            errorHandle(res);
        }
    } else if (req.url.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        console.log(req.method);
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: "false",
            message: "無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.POST || 3005);