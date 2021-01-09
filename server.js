/**
 * Created by jgarcia on 01/12/2017.
 * Updated 27/11/2020
 */

const fs = require('fs');
const favicon = require('serve-favicon');
const path = require('path');
const express = require('express');
const app = express();

const kwiz = require('./kwiz_module/kwiz_module');

//make the server and the socketsio
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//server static file in the public directory
app.use(express.static(__dirname + '/public'))
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
    let clientID = socket.id;
    //send the questions to the client
    socket.emit("quiz", kwiz.questions());
});


server.listen(8080);
console.log("server started on port 8080");