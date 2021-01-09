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
    kwiz.socket.on('quiz', kwiz.createQuestions);
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

kwiz.createClickListener = function (radio, questionId, option) {
    radio.onclick = function () {
        console.log(kwiz.get_answers_counts + "=====");
        //Evolution de la grille quand un joueur sélectionne une réponse.
        if (questionId==="q1"){
            document.querySelector("#counter_q1_0").innerHTML= 7 + "/" + kwiz.clients_nb;
            document.querySelector("#counter_q1_2").innerHTML= 7 + "/" + kwiz.clients_nb;
            document.querySelector("#counter_q1_1").innerHTML= 7 + "/" + kwiz.clients_nb;
        } if (questionId==="q2"){
            document.querySelector("#counter_q2_0").innerHTML= 7 + "/" + kwiz.clients_nb;
            document.querySelector("#counter_q2_1").innerHTML= 7 + "/" + kwiz.clients_nb;
            document.querySelector("#counter_q2_2").innerHTML= 7 + "/" + kwiz.clients_nb;
        } if (questionId==="q3") {
            document.querySelector("#counter_q3_0").innerHTML= 7 + "/" + kwiz.clients_nb;
            document.querySelector("#counter_q3_1").innerHTML= 7 + "/" + kwiz.clients_nb;
            document.querySelector("#counter_q3_2").innerHTML= 7 + "/" + kwiz.clients_nb;
        }

        //Evolution de la grille quand tous les joueurs ont sélectionné une réponse à une question
        if ("nbJcheck" === "nbJtot"){

        }

        //réponse à la question 1
        kwiz.quiz[0].answer;

        console.log("question", questionId, "\n", "option", option);
    }
};
