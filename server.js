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


    //send the questions to the client
    socket.emit("quiz", kwiz.questions());
    socket.emit("pseudo");

    socket.on('pseudoCheck', function(clientName) {
        let list_clients = kwiz.get_clients_names();
        console.log(clientName + " : taille")
        if(list_clients.includes(clientName) || clientName.size < 1) {
            socket.emit("existant", "true");
        }
        else {
            socket.emit("existant", "false");
            kwiz.set_client_name(clientID, clientName);
            io.emit("Connexion", kwiz.clients_count());
        }
    });



    socket.on('disconnect', function() {
        kwiz.remove_client(clientID);
        io.emit("Disconnexion", kwiz.clients_count());

    });

    socket.on("play", function (){
        io.emit('begin', "true")
    });

    socket.on('getNbClients', function() {
        io.emit('nbClients', kwiz.clients_count());
        io.emit("listeCl", kwiz.get_clients_names())
    });

    socket.on('getNbRep', function (questionId, option){
        io.emit('nbRep', kwiz.get_answers_counts(), questionId, option);
    })

    socket.on('mesRep', function (id, quest, opt){
        kwiz.update_client_answer(id, quest, opt);
    })

    socket.on("stopQuestion", function (questionId, nbRep, option){
        io.emit("disRadio", questionId, nbRep, option);
    })
});






server.listen(8080);
console.log("server started on port 8080");