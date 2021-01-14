let kwiz;
kwiz = {
    socket: 'undefined',
    content: 'undefined',
    counter: 'undefined',
    clients_nb: 0,
    quiz: undefined
};

kwiz.start = function () {
    kwiz.setupUI();
    kwiz.socket = io('http://localhost:8080');
    kwiz.connect();
    // create the quiz questions
    kwiz.socket.on('quiz', kwiz.createQuestions);

    // wait for number of clients
    kwiz.socket.on('nbClients', function(clients_nb) {
        kwiz.clients_nb = clients_nb;
        document.getElementById(nbPlayers.innerHTML = "Nombre de joueurs : "+ clients_nb );
    });

    // print the players in the table
    kwiz.socket.on("listeCl", function (list_clients) {

        while (document.getElementById("scoreTable").firstChild) {
            document.getElementById("scoreTable").removeChild(document.getElementById("scoreTable").firstChild);
        }

        for (i=0; i<list_clients.length; i++){
            if (list_clients[i] !== null) {
                let player = document.createTextNode(list_clients[i]);
                document.getElementById("scoreTable").insertRow().insertCell().appendChild(player);
            }
        }
    });

    // check if "pseudo" exists and go to the next step
    kwiz.socket.on('existant', function(existant) {
        //Si le pseudo est déjà pris par un autre joueur
        if (existant === "true") {
            window.alert("Pseudo impossible à pourvoir. ");
        } else {
            document.getElementById(namePlayer.style.visibility='visible');
            document.getElementById(bandeau.style.visibility='visible');
            document.getElementById(players.style.visibility='visible');
            document.getElementById(myPseudo.style.visibility='hidden');
            document.getElementById(namePlayer.innerHTML = "Votre Pseudo : " + pseudo.value);
        }
    });

    // subscribe to the answers
    kwiz.socket.on('nbRep', function (nbRep, questionId, option){
        kwiz.counter = nbRep;
        let cpt = 0;

        //Evolution de la grille quand un joueur sélectionne une réponse.
        for (i=0; i<nbRep[questionId].length; i++) {
            document.querySelector("#counter_" + questionId + "_" + i).innerHTML =
                kwiz.counter[questionId][i] + "/" + kwiz.clients_nb;
            cpt = cpt + kwiz.counter[questionId][i];
            if (cpt === kwiz.clients_nb){
                kwiz.socket.emit("stopQuestion", questionId, nbRep, option)
            }
        }
    });

    var buttonPseudo = document.querySelector("#firstBtn");
    var buttonGo = document.getElementById("letsGo");
    buttonPseudo.addEventListener("click", myFunctionVerif);
    buttonGo.addEventListener("click", myFunctionGo);

    kwiz.socket.on('begin', function (boole) {
        if (boole === "true") {
            document.getElementById(questions.style.visibility = 'visible');
            document.getElementById(letsGo.style.visibility = 'hidden');
        }
    });

    kwiz.socket.on("disRadio", function (questionId, nbRep, option) {
        for (i=0; i<nbRep[questionId].length; i++) {
            document.querySelector("#radio_" + questionId + "_" + i).disabled = true;
            let label = kwiz.quiz_elem[questionId]["label"][i].getAttribute("for");
            label = label.split('_');
            console.log("answer :"+ kwiz.quiz[i].answer === option )

        }
    })
};



kwiz.setupUI = function () {
    //retrieve the content
    kwiz.content = document.getElementById('content');
};

kwiz.createQuestions = function (data) {
    //store the data
    kwiz.quiz = data.quiz;
    kwiz.quiz_elem = {};

    //remove existing components if any in the content
    while (kwiz.content.firstChild) {
        kwiz.content.removeChild(kwiz.content.firstChild);
    }

    if ("content" in document.createElement("template")) {

        // On prépare une ligne pour le tableau
        let question_template = document.querySelector("#question_block");
        let answer_template = document.querySelector("#answer_block");


        let quiz = data.quiz;
        let nbQuestions = quiz.length;
        let i, questionDiv, question, questionId, title, options, nbOptions, optionID, answerDiv, option, radio_id,
            label, radio, counter_id, counter;

        for (i = 0; i < nbQuestions; i++) {
            // On clone la div pour une question et on l'insère dans le contenu
            questionDiv = document.importNode(question_template.content, true);
            question = quiz[i];
            questionId = question.id;
            title = question.question;
            options = question.options;
            nbOptions = options.length;

            //Set question title
            questionDiv.querySelector("#question_title").innerHTML = title;

            kwiz.quiz_elem[questionId] = {"radio": [], 'label': [], 'counter': []};


            for (optionID = 0; optionID < nbOptions; optionID++) {
                option = options[optionID];
                radio_id = 'radio_' + questionId + '_' + optionID;
                counter_id = 'counter_' + questionId + '_' + optionID;
                // On clone la div pour la question et on l'insère dans le parent
                answerDiv = document.importNode(answer_template.content, true);

                //parametrage des valeurs
                label = answerDiv.querySelector("#answer_label");
                label.innerHTML = option;
                label.setAttribute("for", radio_id);

                //value des radio buttons
                radio = answerDiv.querySelector("#answer_radio");
                radio.setAttribute("value", option);
                radio.setAttribute("id", radio_id);
                radio.setAttribute("name", "radio" + questionId);

                //compteur de réponse
                counter = answerDiv.querySelector("#answer_counter");
                counter.setAttribute("id", counter_id);

                kwiz.createClickListener(radio, questionId, option);
                questionDiv.querySelector(".answers").appendChild(answerDiv);

                kwiz.quiz_elem[questionId]["radio"][optionID] = radio;
                kwiz.quiz_elem[questionId]["label"][optionID] = label;
                kwiz.quiz_elem[questionId]["counter"][optionID] = counter;
            }
            kwiz.content.appendChild(questionDiv);
        }
    } else {
        alert('Utiliser un autre navigateur qui permet les templates');
    }
};

// triggered at a click
kwiz.createClickListener = function (radio, questionId, option) {
    radio.onclick = function () {
        kwiz.socket.emit('getNbClients');
        kwiz.socket.emit('mesRep', kwiz.socket.id, questionId, option);
        kwiz.socket.emit('getNbRep', questionId, option);

        //réponse à la question 1
        kwiz.quiz[0].answer;

        //console.log("question", questionId, "\n", "option", option);
    }
};

// conection options to kwiz
kwiz.connect = function () {
    kwiz.socket.on('Connexion', function (nbCli) {
        document.getElementById(nbPlayers.innerHTML = "Nombre de joueurs : " + nbCli);
    });

    kwiz.socket.on('Disconnexion', function (nbCli) {
        document.getElementById(nbPlayers.innerHTML = "Nombre de joueurs : " + nbCli);
    });
}

// Pseudo verification
function myFunctionVerif() {
    kwiz.socket.emit('pseudoCheck', pseudo.value);
    kwiz.socket.emit('getNbClients');
}

//Rend visible la suite du site, et invisible la partie précédente
function myFunctionGo() {
    kwiz.socket.emit("play");
}




