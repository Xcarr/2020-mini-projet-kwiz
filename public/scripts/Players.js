

var socket = io.connect('http://localhost:8080');
var button = document.getElementById("letsGo");
console.log(button);
button.addEventListener("click", myFunction);

function myFunction() {
    socket.emit("message", pseudo.value);
    console.log(pseudo.value);
    document.getElementById(questions.style.visibility='visible');
    document.getElementById(players.style.visibility='hidden');
}

socket.on('message', function(message) {
    var pseudoPerso = message;
})