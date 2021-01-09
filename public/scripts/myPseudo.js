var button = document.getElementById("firstBtn");
console.log(button);
button.addEventListener("click", myFunction);

function myFunction() {
    kwiz.socket.emit("verifPseudo", pseudo.value);
    kwiz.socket.on('pseudoExistant', function(existant) {
        console.log(existant);
        if(existant=="true") {
            window.alert("Pseudo déjà existant. Veuillez en choisir un nouveau");
        }
        else {
            document.getElementById(players.style.visibility='visible');
            document.getElementById(myPseudo.style.visibility='hidden');
        }
    });
}

