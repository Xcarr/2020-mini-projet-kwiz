/**
 * Created by jgarcia on 01/12/2017.
 * Updated 27/11/2020
 * Updated by Xavier CARRAU on 15/01/2021
 */

const fs = require('fs');
const favicon = require('serve-favicon');
const path = require('path');
const express = require('express');
const app = express();

const kwiz = require('./kwiz_module/kwiz_module');

// Make the server and the sockets io
const server = require('http').createServer(app);
const io = require('socket.io')(server);


// Server static file in the public directory
app.use(express.static(__dirname + '/public'))
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// Subscribe to a client connexion
io.on('connection', function (socket) {
    console.log('Un client est connecté !');
    console.log(kwiz.clients_count());
    let clientID = socket.id;
    kwiz.add_client(clientID);


    // Send the questions to the client
    socket.emit("quiz", kwiz.questions());

    // Check if the psuedo is null or already taken
    socket.on('pseudoCheck', function(clientName) {
        let list_clients = kwiz.get_clients_names();
        if(list_clients.includes(clientName) || clientName.length < 1) {
            socket.emit("pseudoPris", "true");
        }
        else {
            socket.emit("pseudoPris", "false");
            kwiz.set_client_name(clientID, clientName);
            io.emit("Connexion", kwiz.clients_count());
        }
    });

    // Subscribe to the disconnexion of a client
    socket.on('disconnect', function() {
        kwiz.remove_client(clientID);
        io.emit("Disconnexion", kwiz.clients_count());

    });

    // Let's play the game
    socket.on("play", function (){
        io.emit('begin', "true")
    });

    // Subscribe to the number of clients
    socket.on('getNbClients', function() {
        io.emit('nbClients', kwiz.clients_count());
        io.emit("listeCl", kwiz.get_clients_names())
    });

    // Get the count of answers
    socket.on('getNbRep', function (questionId, option){
        io.emit('nbRep', kwiz.get_answers_counts(), questionId, option);
    })

    // Subscribe to the client's answers to update all
    socket.on('mesRep', function (id, quest, opt){
        kwiz.update_client_answer(id, quest, opt);
    })

    // Happen when all clients answered one question
    socket.on("stopQuestion", function (questionId, nbRep, option){
        io.emit("disRadio", questionId, nbRep, option);
    })
});

server.listen(8080);
console.log("server started on port 8080");