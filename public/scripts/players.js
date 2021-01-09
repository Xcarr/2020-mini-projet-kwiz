var socket = io.connect('http://localhost:8080');
var button = document.getElementById("letsGo");
console.log(button);
button.addEventListener("click", myFunction);

//Rend visible la suite du site, et invisible la partie précédente
function myFunction() {
    document.getElementById(questions.style.visibility='visible');
    document.getElementById(players.style.visibility='hidden');
}