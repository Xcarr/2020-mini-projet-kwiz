var button = document.getElementById("firstBtn");
console.log(button);
button.addEventListener("click", myFunction);


//Rend visible la suite du site, et invisible la partie précédente
function myFunction() {
    kwiz.socket.emit("verifPseudo", pseudo.value);
    kwiz.socket.on('pseudoExistant', function(existant) {
        //Si le pseudo est déjà pris par un autre joueur
        if(existant=="true") {
            window.alert("Pseudo déjà existant. Veuillez en choisir un nouveau.");
        }
        else {
            kwiz.socket.emit('getNbClients');
            kwiz.socket.on('nbClients', function(clients_nb) {
                document.getElementById(nbPlayers.innerHTML = "Nombre de joueurs : " + clients_nb );
            });
            document.getElementById(namePlayer.innerHTML = "Pseudo : " + pseudo.value);
            document.getElementById(namePlayer.style.visibility='visible');
            document.getElementById(player.style.visibility='visible');
            document.getElementById(players.style.visibility='visible');
            document.getElementById(myPseudo.style.visibility='hidden');
        }

        /*kwiz.socket.on('clientConnected', function() {
            document.getElementById(nbPlayers.innerHTML = "Nombre de joueurs : " + nbClients++ );
        });

        kwiz.socket.on('clientDisconnected', function() {
            document.getElementById(nbPlayers.innerHTML = "Nombre de joueurs : " + nbClients-- );
        });*/
    });
}


