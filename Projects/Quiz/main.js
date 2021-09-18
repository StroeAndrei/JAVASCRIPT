// Executam cod dupa ce fereastra incarca toate elementele inclusiv
// imagini, stiluri, scripturi
window.onload = () => {
    /* 
    * Ascundem initial continutul intrebarilor, raspunsurilor, butonul de trecere la 
    * urmatoarea intrebare, butonul ce ne trimite la forma initiala de afisare si cel 
    * care ne arata scorul final cat si sectiunea ce afiseaza scorul intre intrebari
    */
    hideElement("qst-content");
    hideElement("answers");
    hideElement("next");
    hideElement("score");
    hideElement("homeBtn");
    hideElement("final");

    // Obiect folosit pentru a pastra starea jocului
    // proprietati: 
    // started = tine evidenta starii jocului (inceput/neinceput)
    // startingIndex = intrebarea de la care incepe jocul
    // totalQuestions = numarul total de intrebari din obiectul questions
    // score = scorul curent; modificat se va transforma in scor final
    // potentialAnswers = numarul de raspunsuri posibile
    const stateOfGame = {
        started: false,
        startingIndex: 0,
        totalQuestions: questions.length,
        score: 0,
        potentialAnswers: 4
    };

    // Obiect global care va fi modificat cu valorile intrebarii curente
    // Structura similara cu obiectele din tabloul "questions"
    const currentQuestion = {
        question: "",
        answers: [],
        correct_answer: ""
    };

    // Variabila ce tine cont daca tabelul de continut a fost generat
    // pentru sectiunea de editare
    let generatedTable = false;

    // Butoanele de start, trecere la urmatoarea intrebare, revenire la "pagina initiala"
    // afisare scor final, editare, revenire la pagina initiala din pagina de editare
    let startBtn = document.getElementById("start");
    let nextBtn = document.getElementById("next");
    let homeBtn = document.getElementById("homeBtn");
    let finalBtn = document.getElementById("final");
    let editBtn = document.getElementById("editBtn");
    let backBtn = document.getElementById("backBtn");

    // Functie ce initializeaza Quiz-ul
    // parametrii: array-ul ce contine intrebarile si indexul initial
    function startQuiz(quizArray, startIndex) {
        setContent("qst-content", quizArray[startIndex].question);
        setContent("ansA", quizArray[startIndex].answers[startIndex]);
        setContent("ansB", quizArray[startIndex].answers[startIndex + 1]);
        setContent("ansC", quizArray[startIndex].answers[startIndex + 2]);
        setContent("ansD", quizArray[startIndex].answers[startIndex + 3]);

        // Setam proprietatea startingIndex a obiectului global stateOfGame
        // in functie de indexul ales la initializarea Quiz-ului
        stateOfGame.startingIndex = startIndex;

        // Setam intrebarea obiectului global currentQuestion la intrebarea indicata de indexul
        // precizat in functia startQuiz obtinuta din tabloul questions (vom apela functia folosind
        // tabloul "questions")
        // Iteram peste tabloul de intrebari furnizat si setam toate raspunsurile cat si raspunsul
        // corect in obiectul global currentQuestion
        currentQuestion.question = quizArray[startIndex].question;
        currentQuestion.correct_answer = quizArray[startIndex].correct_answer;
        for(let i = 0; i < quizArray[startIndex].answers.length; i++) {
            currentQuestion.answers[i] = quizArray[startIndex].answers[startIndex + i];
        }
    }

    // Functie utilitara ce seteaza continutul unui element identificat prin atributul id
    function setContent(elemId, content) {
        let el = document.getElementById(elemId);
        el.innerText = content;
    }

    // Functie utilitara ce afiseaza un element identificat prin atributul 
    // id cu display specificat prin al doilea argument
    function showElement(elemId, displayType) {
        let elem = document.getElementById(elemId);
        elem.style.display = displayType;
    }

    // Functie utilitara ce ascunde un element identificat prin atributul id
    function hideElement(elemId) {
        let elem = document.getElementById(elemId);
        elem.style.display = "none";
    }

    // Functie utilitara ce intoarce indexul la care se regaseste raspunsul
    // corect dintr-un tablou de raspunsuri. In caz contrar intoarce bool false
    function getCorrectAnswerIndex(answers, correct_answer) {
        for(let i = 0; i < answers.length; i++) {
            if(answers[i] == correct_answer) {
                return i;
            }
        }
        return false;
    }

    // Functie utilitara ce preia input de la user prin intermediul unui prompt
    // si intoarce continutul furnizat. Parametrul functiei este stringul afisat 
    // la momentul aparitiei prompt-ului.
    // Realizam si doua validari (not null && not empty)
    function getPromptValue(promptText) {
        let content = prompt(promptText);
        if(content != null && content != "") {
           return content;
        } else {
            return undefined;
        }
    }

    // Functie utilitara ce reseteaza stilurile unor elemente furnizate prin intermediul
    // unui tablou sau un singur element identificat prin atributul id
    function resetStyles(elementsIds) {
        let elem;
        if(elementsIds.constructor === Array) {
            for(let i = 0; i < elementsIds.length; i++) {
                elem = document.getElementById(elementsIds[i]);
                elem.style.cssText = " ";
            }
        } else {
            elem = document.getElementById(elementsIds);
            elem.style.cssText = "";
        }
    }

    // Functie utilitara ce actualizeaza continutul unui element identificat prin
    // atributul de id cu scorul furnizat in functie
    function updateScore(ofElement, value) {
        let element = document.getElementById(ofElement);
        element.innerText = value;
    }

    /* Functie pentru afisarea intrebarii si a raspunsurilor in pagina. Identificarea se face prin id-ul questionId 
    pentru intrebare si prin vectorul answersIds pentru variantele de raspuns. Atribuim acestor elemente valorile 
    precizate prin indexul fromIndex din vectorul de obiecte. */
    function renderQuestion(quizArray, fromIndex, questionId, answersIds) {
        numberOfAnswers = answersIds.length;
        setContent(questionId, quizArray[fromIndex].question);
        for(let i = 0; i < numberOfAnswers; i++) {
            setContent(answersIds[i], quizArray[fromIndex].answers[i]);
        }
    }

    // Initializam Quiz-ul pe event-ul de click asupra butonului de start
    startBtn.onclick = () => {
        // Afisam o serie de elemente ascunse initial din pagina corespunzatoare
        // sectiunii de intrebari si raspunsuri iar in acelsi timp ascundem din 
        // pagina initiala butonul de start si cel pentru editare intrebari
        showElement("qst-content", "inline-block");
        showElement("answers", "flex");
        showElement("next", "block");
        showElement("score", "block");
        hideElement("start");
        hideElement("editBtn");

        // Actualizam continutul elementului identificat prin id-ul furnizat
        // functiei updateScore() cu valoarea precizata ca al doilea argument
        updateScore("score-value", stateOfGame.score);

        // Initializam Quiz-ul efectiv cu intrebarile si indexul precizat
        startQuiz(questions, 0);

        // Modificam starea quiz-ului
        stateOfGame.started = true;

        // Selectam toate raspunsurile din pagina sub forma de tablou
        let answerOptions = document.querySelectorAll(".answer");
        let idOfCorrectAnswer;

        // In cazul in care utilizatorul opteaza sa se intoarca la pagina initiala
        // incheiem Quiz-ul prin reincarcarea paginii
        homeBtn.onclick = () => {
            location.reload();
        }

        // Utilizam tabloul de raspunsuri pentru a identifica raspunsul furnizat de
        // utilizator
        answerOptions.forEach((elem) => {
            elem.onclick = () => {
                let selectedValue = elem.innerText;

                // Daca utilizatorul a selectat raspunsul corect
                if(selectedValue == currentQuestion.correct_answer) {

                    // Incrementam scorul
                    stateOfGame.score++;

                    // Marcam cu o culoare (verde) raspunsul corect
                    let foCorrectAnswer = document.getElementById(elem.id);
                    foCorrectAnswer.style.backgroundColor = "#33ff33";
                    foCorrectAnswer.style.color = "#000";

                    // Dezactivam evenimentele pe celelte variante de raspuns
                    for(let i = 0; i < stateOfGame.potentialAnswers; i++) {
                        let allAnswers = document.getElementById(answerOptions[i].id);
                        allAnswers.style.pointerEvents = "none";
                    }

                    // Actualizam interfata grafica pentru scor
                    updateScore("score-value", stateOfGame.score);

                } else {

                    // Marcam cu o culoare (rosu) raspunsul gresit
                    let foWrongAnswer = document.getElementById(elem.id);
                    foWrongAnswer.style.backgroundColor = "#ff2b00";
                    foWrongAnswer.style.color = "#000";

                    // Identificam raspunsul corect
                    for(let i = 0; i < stateOfGame.potentialAnswers; i++) {
                        if(answerOptions[i].innerText == currentQuestion.correct_answer) {
                            idOfCorrectAnswer = answerOptions[i].id;
                        }
                    }

                    // Marcam raspunsul corect cu o culoare (verde)
                    let foCorrectAnswer = document.getElementById(idOfCorrectAnswer);
                    foCorrectAnswer.style.backgroundColor = "#33ff33";
                    foCorrectAnswer.style.color = "#000";

                    // Dezactivam evenimentul de click pe optiunile de raspuns
                    for(let i = 0; i < stateOfGame.potentialAnswers; i++) {
                       let allAnswers = document.getElementById(answerOptions[i].id);
                       allAnswers.style.pointerEvents = "none";
                    }

                    // Actualizam interfata grafica pentru scor
                    updateScore("score-value", stateOfGame.score);

                }
            }
        });
    }

    // Construim o variablia globala folosita pentru 
    // a sti la ce intrebare ne aflam
    iterator = stateOfGame.startingIndex + 1;

    // Ne deplasam la urmatoarea intrebare la evenimentul de click pe butonul next
    nextBtn.onclick = () => {

        // Daca am initializat jocul
        if(stateOfGame.started) {

            // Daca am ajuns la sfarsitul setului de intrebari resetam iteratorul la
            // valoarea initiala, resetam scorul si facem update in interfata
            if(iterator == stateOfGame.totalQuestions) {
                iterator = stateOfGame.startingIndex;
                stateOfGame.score = 0;
                updateScore("score-value", stateOfGame.score);
            }

            // Setam intrebarea curenta in functie de intrebarea la care ne aflam la momentul curent
            currentQuestion.question = questions[iterator].question;

            // Setam raspunsul corect in functie de intrebarea la care ne aflam la momentul curent
            currentQuestion.correct_answer = questions[iterator].correct_answer;

            // Setam raspunsurile pentru intrebarea curenta
            for(let i = 0; i < questions[iterator].answers.length; i++) {
                currentQuestion.answers[i] = questions[iterator].answers[(iterator - 1) + i];
            }

            // Resetam stilurile pentru cele 4 variante de raspuns
            resetStyles(["ansA", "ansB", "ansC", "ansD"]);

            // Afisam intrebarea in pagina
            renderQuestion(questions, iterator, "qst-content", ["ansA", "ansB", "ansC", "ansD"]);

            // Ne deplasam la urmatoarea intrebare cu ajutorul iteratorului
            iterator++;

            // Daca am ajuns la finalul setului de intrebari
            if(iterator == questions.length) {
                // Ascundem butonul pentru deplasare la urmatoarea intrebare
                hideElement("next");
                showElement("final", "block");

                finalBtn.addEventListener("click", () => {
                    // Ascundem elementele quiz-ului curent
                    hideElement("qst-content");
                    hideElement("answers");
                    // inclusiv butonul pentru afisarea scorului final
                    hideElement("final");

                    // Afisam interfata pentru scorul final
                    showElement("homeBtn", "initial");
                    let scoreText = document.getElementById("score");
                    scoreText.style.color = "#dc3d24";
                    scoreText.style.width = "500px";
                    scoreText.style.marginLeft = "auto";
                    scoreText.style.marginRight = "auto";
                    scoreText.style.backgroundColor = "#232B2B";
                    scoreText.style.borderRadius = "10px";
                    scoreText.innerHTML = "SCOR FINAL: " + stateOfGame.score + " puncte";
                });                
            }
        }
    }

    // Sectiunea de editare a intrebarilor
    editBtn.addEventListener("click", () => {
        // Afiseaza sectiunea pentru editare
        showElement("editPage", "flex");

        // Ascunde butonul de setari si pagina principala
        let quizContent = document.getElementById("content");
        quizContent.style.display = "none";

        backBtn.onclick = function() {
            quizContent.style.display = "block";
            hideElement("editPage");
        }

        // Obtinem tabelul din HTML
        let table = document.getElementById("questionsTable").getElementsByTagName('tbody')[0];

        // Iteram peste toate intrebarile din vector, le setam continutul 
        // si le afisam in tabel
        if(!generatedTable) {

            for(let i = 0; i < questions.length; i++) {

                generatedTable = true;

                let row = table.insertRow(i);

                let cell0 = row.insertCell(0);
                cell0.style.border = "1px solid lightgray";
                cell0.id = "r" + i + "c0";
                cell0.innerHTML = questions[i].question;

                let cell1 = row.insertCell(1);
                cell1.style.border = "1px solid lightgray";
                cell1.id = "r" + i + "c1";
                cell1.innerHTML = questions[i].answers[0];

                let cell2 = row.insertCell(2);
                cell2.style.border = "1px solid lightgray";
                cell2.id = "r" + i + "c2";
                cell2.innerHTML = questions[i].answers[1];

                let cell3 = row.insertCell(3);
                cell3.style.border = "1px solid lightgray";
                cell3.id = "r" + i + "c3";
                cell3.innerHTML = questions[i].answers[2];

                let cell4 = row.insertCell(4);
                cell4.style.border = "1px solid lightgray";
                cell4.id = "r" + i + "c4";
                cell4.innerHTML = questions[i].answers[3];

                let cell5 = row.insertCell(5);
                cell5.style.border = "1px solid lightgray";
                cell5.id = "r" + i + "c5";
                cell5.innerHTML = questions[i].correct_answer;
            }

            // Dupa ce am generat tabelul
            let tab = document.querySelectorAll("#questionsTable td");

            tab.forEach((elem) => {
                elem.onclick = () => {
                    let getId = elem.id;
                    let col, row, prompt;

                    // Setam indicii pentru coloane si randuri
                    // obtinuti prin extragerea cifrelor din id
                    row = getId.substring(1, 2);
                    col = getId.substring(3, 4);

                    // Obtinem valoarea (stringul) din prompt
                    prompt = getPromptValue();

                    // O serie de verificari minimale pentru valoarea obtinuta din prompt
                    // TODO: verificari suplimentare (se regaseste raspunsul corect printre cele enumerate)
                    if(typeof prompt == 'undefined') {
                        alert("Valoarea introdusa nu este valida. Mai incearca!");
                    } else {
                       if(col == 0) {
                            //modificam continutul celulei din tablou
                            questions[row].question = prompt;
                            elem.innerHTML = questions[row].question;
                        } else if (col > 0 && col < 5) {
                            questions[row].answers[col] = prompt
                            elem.innerHTML = questions[row].answers[col];
                        } else {
                            questions[row].correct_answer = prompt
                            elem.innerHTML = questions[row].correct_answer;
                        } 
                    }
                }
            });
        }
    });
}

// Tablou ce contine intrebarile testului sub forma de obiecte
var questions = [
    {
        question: "Ce semnificatie are acronimul RAM?",
        answers: ['Random appointed memory', 'Resistor and memory', 'Random access memory', 'Rad amplifier'],
        correct_answer: 'Random access memory'
    },

    {
        question: "Care dintre urmatoarele nu este un sistem de operare?",
        answers: ['Unix', 'Linux', 'OS X', 'Pitex'],
        correct_answer: 'Pitex'
    },

    {
        question: "Cum se numeste un tip de malware, autoreplicant ce se raspandeste la alte calculatoare prin intermediul internetului",
        answers: ['Virus', 'Worms', 'Trojans', 'Spyware'],
        correct_answer: 'Worms'
    },

    {
        question: "Care dintre urmatoarele defineste corect termenul de cookie?",
        answers: ["Un mesaj furnizat unui web browser de catre un web server", "Este o parola memorata de un web server", "Este un virus ce corupe alte fisiere web", "Este un virus ce colecteaza informatii de la utilizator"],
        correct_answer: 'Un mesaj furnizat unui web browser de catre un web server'
    },

    {
        question: "Un byte este o serie de ... biti",
        answers: ["2", "5", "8", "12"],
        correct_answer: "8" 
    },

    {
        question: "In SQL, ce comanda este folosita pentru a efectua schimbari permanente folosind o tranzactie",
        answers: ["ZIP", "PACK", "COMMIT", "SAVE"],
        correct_answer: "COMMIT"
    }
];

