var socket = io.connect('http://localhost:8080');
var button = document.getElementById("firstBtn");
console.log(button);
button.addEventListener("click", myFunction);

//Rend visible la suite du site, et invisible la partie précédente
function myFunction() {
    socket.emit("message", pseudo.value);
    console.log(pseudo.value)
    document.getElementById(players.style.visibility='visible');
    document.getElementById(myPseudo.style.visibility='hidden');
}

//Envoie le pseudo sur le serveur
socket.on('message', function(message) {
    var pseudoPerso = message;
})