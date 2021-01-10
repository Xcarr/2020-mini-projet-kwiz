var button = document.getElementById("letsGo");
console.log(button);

//Ajout des joueurs dans le tableau
    var names = undefined;
    kwiz.socket.on('names', kwiz.get_clients_names());
    console.log(names);

button.addEventListener("click", myFunction);

//Rend visible la suite du site, et invisible la partie précédente
function myFunction() {
    document.getElementById(questions.style.visibility='visible');
    document.getElementById(players.style.visibility='hidden');
}