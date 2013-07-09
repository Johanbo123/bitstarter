#!/usr/bin/env node
"use strict";
var fs = require("fs");
var express = require('express');
var app = express();
var fileName = "index.html";
var buffer, buf_len, data;
var fileRead = false;

var Close = function(err){
    if (err) { throw err; };
    fileRead = true;
};

function Read(error, bytesRead, buffer) {
    if (error) { throw error; }
    data = buffer.toString("utf8", 0, buf_len);
}

function Open(err, fd) {
    if (err) { throw err; }
    fs.read(fd, buffer, 0, buf_len, null, Read);
    fs.close(fd, Close);
}

function Stat(error, sta) {
    if (error) { throw error; }
    buffer = new Buffer(sta.size);
    buf_len = buffer.length;
    fs.open(fileName, 'r', Open);
}

function Exists(ext) {
    if (ext) {
        fs.stat(fileName, Stat);
    } else {
        console.log("No file");
    }
}

function Send(request, response) {
    response.send(data);
}

fs.exists(fileName, Exists);
app.get('/', Send);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
