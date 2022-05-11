const http = require('http');
const errorHandle = require('./errorHandle');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const dotnenv = require('dotenv');
const Post = require('./model/PostSchema');

dotnenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功')
    })
    .catch((error) => {
        console.log(error);
    })

const requestListener = async (req, res) => {
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
            data: await Post.find(),
        }));
        res.end();
    } else if (req.url == '/posts' && req.method == 'POST') {
        // TODO post
        req.on('end', async () => {
            try {
                const formData = JSON.parse(body);
                const model = {
                    name: formData.name,
                    tags: formData.tags,
                    type: formData.type,
                    image: formData.image,
                    content: formData.content,
                    likes: formData.likes,
                    comments: formData.comments
                };

                await Post.create(model);

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: "success",
                    data: await Post.find(),
                }));
                res.end();
            } catch (error) {
                errorHandle(res);
            }
        })
    } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
        // TODO patch
        req.on('end', async () => {

            try {
                const id = req.url.split('/').pop();
                const list = await Post.find({ _id: id });
                const model = list[0];
                const formData = JSON.parse(body);
                if (model !== undefined && formData != undefined) {
                    model.name = formData.name;
                    model.tags = formData.tags;
                    model.type = formData.type;
                    model.image = formData.image;
                    model.content = formData.content;
                    model.likes = formData.likes;
                    model.comments = formData.comments;

                    await Post.findByIdAndUpdate(id, model);

                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: "success",
                        data: await Post.find(),
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
        await Post.deleteMany({});

        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: "success",
            data: await Post.find(),
        }));
        res.end();
    } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
        // TODO delete one
        try {
            const id = req.url.split('/').pop();
            const list = await Post.find({ _id: id });
            const model = list[0];
            if (model !== undefined) {
                await Post.findByIdAndDelete(id);

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: "success",
                    data: await Post.find(),
                }));
                res.end();
            } else {
                errorHandle(res);
            }
        } catch (error) {
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