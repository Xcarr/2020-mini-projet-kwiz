var socket = io.connect('http://localhost:8080');
var button = document.getElementById("firstBtn");
console.log(button);
button.addEventListener("click", myFunction);

function myFunction() {
    socket.emit("message", pseudo.value);
    console.log(pseudo.value)
    document.getElementById(players.style.visibility='visible');
    document.getElementById(myPseudo.style.visibility='hidden');
}

socket.on('message', function(message) {
    var pseudoPerso = message;
})