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
    console.log('Un client est connecté !');
    console.log(kwiz.clients_count());
    let clientID = socket.id;
    kwiz.add_client(clientID);
    //console.log(kwiz.clients_count());
    //send the questions to the client
    socket.emit("quiz", kwiz.questions());

    socket.on('verifPseudo', function(clientName) {
        let list_clients = kwiz.get_clients_names();
        if(list_clients.includes(clientName)) {
            socket.emit("pseudoExistant", "true");
        }
        else {
            socket.emit("pseudoExistant", "false");
            kwiz.set_client_name(clientID, clientName);
            console.log(kwiz.get_clients_names());
        }
    });

    socket.on('disconnect', function() {
        kwiz.remove_client(clientID);
        console.log('Un client est déconnecté !');
        console.log(kwiz.clients_count());
    });
});

server.listen(8080);
console.log("server started on port 8080");