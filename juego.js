/* ==================================================
   HUELLA AZUL
   juego.js
================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* ==================================================
       NOMBRE DEL JUGADOR
    ================================================== */

    const nameModal = document.getElementById("name-modal");
    const nameForm = document.getElementById("name-form");
    const nameInput = document.getElementById("player-name");
    const nameError = document.getElementById("name-error");

    const savedName = localStorage.getItem("huellaPlayerName");


    if (nameModal) {

        if (savedName) {

            nameModal.classList.add("hidden");

        } else {

            nameModal.classList.remove("hidden");

        }

    }


    if (nameForm) {

        nameForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = nameInput.value.trim();

            if (name === "") {

                nameError.textContent =
                    "Por favor, escribe tu nombre.";

                nameInput.focus();

                return;
            }


            localStorage.setItem(
                "huellaPlayerName",
                name
            );

            nameError.textContent = "";

            nameModal.classList.add("hidden");

        });

    }


    /* ==================================================
       PÁGINA DE JUEGOS
    ================================================== */

    const params =
        new URLSearchParams(window.location.search);

    const selectedGame =
        params.get("game");


    if (selectedGame) {

        showSelectedGame(selectedGame);

    }


    /* ==================================================
       FUNCIÓN PARA MOSTRAR EL JUEGO
    ================================================== */

    function showSelectedGame(game) {

        const title =
            document.getElementById("game-title");

        const description =
            document.getElementById("game-description");


        const panels = [
            "triqui-game",
            "ppt-game",
            "ahorcado-game",
            "memoria-game"
        ];


        panels.forEach(function (id) {

            const panel =
                document.getElementById(id);

            if (panel) {
                panel.classList.add("hidden");
            }

        });


        if (game === "triqui") {

            title.textContent = "Triqui";

            description.textContent =
                "Consigue tres símbolos iguales en línea antes que la computadora.";

            document
                .getElementById("triqui-game")
                .classList.remove("hidden");

            initTriqui();

        }


        else if (game === "ppt") {

            title.textContent =
                "Piedra, Papel o Tijera";

            description.textContent =
                "Elige tu movimiento y compite contra la computadora.";

            document
                .getElementById("ppt-game")
                .classList.remove("hidden");

            initPPT();

        }


        else if (game === "ahorcado") {

            title.textContent =
                "Ahorcado";

            description.textContent =
                "Descubre la palabra secreta antes de quedarte sin intentos.";

            document
                .getElementById("ahorcado-game")
                .classList.remove("hidden");

            initHangman();

        }


        else if (game === "memoria") {

            title.textContent =
                "Memoria";

            description.textContent =
                "Encuentra todas las parejas.";

            document
                .getElementById("memoria-game")
                .classList.remove("hidden");

            initMemory();

        }

    }


    /* ==================================================
       1. TRIQUI
    ================================================== */

    function initTriqui() {

        const cells =
            document.querySelectorAll(".triqui-cell");

        const message =
            document.getElementById("triqui-message");

        const playerScoreElement =
            document.getElementById("triqui-player-score");

        const computerScoreElement =
            document.getElementById("triqui-computer-score");

        const playerNameElement =
            document.getElementById("triqui-player-name");


        if (
            cells.length !== 9 ||
            !message ||
            !playerScoreElement ||
            !computerScoreElement
        ) {
            return;
        }


        const playerName =
            localStorage.getItem("huellaPlayerName")
            || "Jugador";


        if (playerNameElement) {

            playerNameElement.textContent =
                playerName;

        }


        let board = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ];

        let playerScore = 0;

        let computerScore = 0;

        let gameOver = false;

        let computerThinking = false;


        const winningCombinations = [

            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6]

        ];


        function updateBoard() {

            cells.forEach(function (cell, index) {

                cell.textContent =
                    board[index];

                cell.classList.remove("x");
                cell.classList.remove("o");


                if (board[index] === "X") {

                    cell.classList.add("x");

                }


                if (board[index] === "O") {

                    cell.classList.add("o");

                }

            });

        }


        function checkWinner() {

            for (
                let i = 0;
                i < winningCombinations.length;
                i++
            ) {

                const combination =
                    winningCombinations[i];

                const a = combination[0];
                const b = combination[1];
                const c = combination[2];


                if (
                    board[a] !== "" &&
                    board[a] === board[b] &&
                    board[a] === board[c]
                ) {

                    return board[a];

                }

            }


            let boardFull = true;


            for (let i = 0; i < board.length; i++) {

                if (board[i] === "") {

                    boardFull = false;

                    break;

                }

            }


            if (boardFull) {

                return "EMPATE";

            }


            return null;

        }


        function finishGame(result) {

            gameOver = true;


            if (result === "X") {

                playerScore++;

                playerScoreElement.textContent =
                    playerScore;

                message.textContent =
                    "¡Ganaste!";

            }


            else if (result === "O") {

                computerScore++;

                computerScoreElement.textContent =
                    computerScore;

                message.textContent =
                    "La computadora ganó.";

            }


            else {

                message.textContent =
                    "¡Empate!";

            }

        }


        function computerMove() {

            if (gameOver) {
                return;
            }


            const available =
                [];


            for (let i = 0; i < board.length; i++) {

                if (board[i] === "") {

                    available.push(i);

                }

            }


            if (available.length === 0) {

                computerThinking = false;

                return;

            }


            const randomPosition =
                Math.floor(
                    Math.random() *
                    available.length
                );


            const position =
                available[randomPosition];


            board[position] = "O";


            updateBoard();


            computerThinking = false;


            const result =
                checkWinner();


            if (result) {

                finishGame(result);

            } else {

                message.textContent =
                    "Tu turno. Coloca una X.";

            }

        }


        function playerMove(index) {

            if (gameOver) {
                return;
            }


            if (computerThinking) {
                return;
            }


            if (board[index] !== "") {
                return;
            }


            board[index] = "X";


            updateBoard();


            const result =
                checkWinner();


            if (result) {

                finishGame(result);

                return;

            }


            computerThinking = true;


            message.textContent =
                "Turno de la computadora...";


            setTimeout(
                computerMove,
                500
            );

        }


        cells.forEach(function (cell) {

            cell.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            cell.dataset.index
                        );

                    playerMove(index);

                }
            );

        });


        const resetButton =
            document.getElementById(
                "triqui-reset"
            );


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    board = [
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        ""
                    ];

                    gameOver = false;

                    computerThinking = false;

                    updateBoard();

                    message.textContent =
                        "Tu turno. Coloca una X.";

                }
            );

        }


        updateBoard();

    }


    /* ==================================================
       2. PIEDRA PAPEL TIJERA
       SE MANTIENE FUNCIONAL
    ================================================== */

    function initPPT() {

        const buttons =
            document.querySelectorAll(
                ".choice-button"
            );

        const playerChoice =
            document.getElementById(
                "player-choice"
            );

        const computerChoice =
            document.getElementById(
                "computer-choice"
            );

        const result =
            document.getElementById(
                "ppt-result"
            );

        const playerScoreElement =
            document.getElementById(
                "ppt-player-score"
            );

        const computerScoreElement =
            document.getElementById(
                "ppt-computer-score"
            );

        const drawScoreElement =
            document.getElementById(
                "ppt-draw-score"
            );

        const playerNameElement =
            document.getElementById(
                "player-name-score"
            );


        if (!buttons.length) {
            return;
        }


        const playerName =
            localStorage.getItem(
                "huellaPlayerName"
            ) || "Jugador";


        if (playerNameElement) {

            playerNameElement.textContent =
                playerName;

        }


        let playerScore = 0;
        let computerScore = 0;
        let drawScore = 0;


        const emojis = {

            piedra: "✊",
            papel: "✋",
            tijera: "✌️"

        };


        function getComputerChoice() {

            const choices = [
                "piedra",
                "papel",
                "tijera"
            ];

            const random =
                Math.floor(
                    Math.random() *
                    choices.length
                );

            return choices[random];

        }


        function determineWinner(
            player,
            computer
        ) {

            if (player === computer) {
                return "draw";
            }


            if (
                (player === "piedra" &&
                    computer === "tijera") ||

                (player === "papel" &&
                    computer === "piedra") ||

                (player === "tijera" &&
                    computer === "papel")
            ) {

                return "player";

            }


            return "computer";

        }


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const player =
                        button.dataset.choice;

                    const computer =
                        getComputerChoice();


                    playerChoice.textContent =
                        emojis[player];

                    computerChoice.textContent =
                        emojis[computer];


                    const winner =
                        determineWinner(
                            player,
                            computer
                        );


                    if (winner === "player") {

                        playerScore++;

                        playerScoreElement.textContent =
                            playerScore;

                        result.textContent =
                            "¡Ganaste esta ronda!";

                    }


                    else if (winner === "computer") {

                        computerScore++;

                        computerScoreElement.textContent =
                            computerScore;

                        result.textContent =
                            "La computadora ganó esta ronda.";

                    }


                    else {

                        drawScore++;

                        drawScoreElement.textContent =
                            drawScore;

                        result.textContent =
                            "¡Empate!";

                    }

                }
            );

        });


        const resetButton =
            document.getElementById(
                "ppt-reset"
            );


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    playerScore = 0;
                    computerScore = 0;
                    drawScore = 0;

                    playerScoreElement.textContent =
                        "0";

                    computerScoreElement.textContent =
                        "0";

                    drawScoreElement.textContent =
                        "0";

                    playerChoice.textContent =
                        "?";

                    computerChoice.textContent =
                        "?";

                    result.textContent =
                        "Elige una opción para comenzar.";

                }
            );

        }

    }


    /* ==================================================
       3. AHORCADO
    ================================================== */

    function initHangman() {

        const keyboard =
            document.getElementById(
                "keyboard"
            );

        const wordElement =
            document.getElementById(
                "hangman-word"
            );

        const attemptsElement =
            document.getElementById(
                "hangman-attempts"
            );

        const message =
            document.getElementById(
                "hangman-message"
            );

        const resetButton =
            document.getElementById(
                "hangman-reset"
            );


        if (
            !keyboard ||
            !wordElement ||
            !attemptsElement ||
            !message
        ) {
            return;
        }


        const words = [

            "AZUL",
            "JUEGO",
            "PERRO",
            "GATO",
            "COLOMBIA",
            "AMIGO",
            "ESCUELA",
            "PROGRAMAR",
            "COMPUTADOR",
            "MEDICINA",
            "HUELLA",
            "JUGADOR"

        ];


        const alphabet =
            "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");


        let selectedWord = "";

        let guessedLetters = [];

        let attempts = 6;

        let gameFinished = false;


        function startHangman() {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    words.length
                );


            selectedWord =
                words[randomIndex];


            guessedLetters = [];

            attempts = 6;

            gameFinished = false;


            attemptsElement.textContent =
                attempts;


            message.textContent =
                "Selecciona una letra.";


            createKeyboard();

            updateWord();

        }


        function createKeyboard() {

            keyboard.innerHTML = "";


            alphabet.forEach(function (letter) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type = "button";

                button.className =
                    "letter-button";

                button.textContent =
                    letter;


                button.addEventListener(
                    "click",
                    function () {

                        selectLetter(
                            letter,
                            button
                        );

                    }
                );


                keyboard.appendChild(button);

            });

        }


        function updateWord() {

            const displayedWord =
                selectedWord
                    .split("")
                    .map(function (letter) {

                        if (
                            guessedLetters.includes(
                                letter
                            )
                        ) {

                            return letter;

                        }

                        return "_";

                    })
                    .join(" ");


            wordElement.textContent =
                displayedWord;

        }


        function selectLetter(
            letter,
            button
        ) {

            if (gameFinished) {
                return;
            }


            if (
                guessedLetters.includes(
                    letter
                )
            ) {
                return;
            }


            guessedLetters.push(letter);


            button.disabled = true;


            if (
                selectedWord.includes(
                    letter
                )
            ) {

                button.classList.add(
                    "correct"
                );

                message.textContent =
                    "¡Correcto!";

                updateWord();

                checkWin();

            }


            else {

                attempts--;

                attemptsElement.textContent =
                    attempts;

                button.classList.add(
                    "wrong"
                );

                message.textContent =
                    "Esa letra no está.";


                if (attempts <= 0) {

                    gameFinished = true;


                    wordElement.textContent =
                        selectedWord
                            .split("")
                            .join(" ");


                    message.textContent =
                        "Perdiste. La palabra era " +
                        selectedWord;


                    disableKeyboard();

                }

            }

        }


        function checkWin() {

            const won =
                selectedWord
                    .split("")
                    .every(function (letter) {

                        return guessedLetters.includes(
                            letter
                        );

                    });


            if (won) {

                gameFinished = true;

                message.textContent =
                    "¡Ganaste!";

                disableKeyboard();

            }

        }


        function disableKeyboard() {

            const buttons =
                keyboard.querySelectorAll(
                    "button"
                );


            buttons.forEach(function (button) {

                button.disabled = true;

            });

        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    startHangman();

                }
            );

        }


        startHangman();

    }


    /* ==================================================
       4. MEMORIA
       SE MANTIENE FUNCIONAL
    ================================================== */

    function initMemory() {

        const board =
            document.getElementById(
                "memory-board"
            );

        const movesElement =
            document.getElementById(
                "memory-moves"
            );

        const pairsElement =
            document.getElementById(
                "memory-pairs"
            );

        const message =
            document.getElementById(
                "memory-message"
            );

        const resetButton =
            document.getElementById(
                "memory-reset"
            );


        if (!board) {
            return;
        }


        const symbols = [
            "🐶",
            "🐱",
            "🐼",
            "🦊",
            "🐸",
            "🐵",
            "🐰",
            "🐯"
        ];


        let cards = [
            ...symbols,
            ...symbols
        ];


        let firstCard = null;

        let secondCard = null;

        let locked = false;

        let moves = 0;

        let pairs = 0;


        function shuffle(array) {

            for (
                let i = array.length - 1;
                i > 0;
                i--
            ) {

                const j =
                    Math.floor(
                        Math.random() *
                        (i + 1)
                    );


                [
                    array[i],
                    array[j]
                ] = [
                    array[j],
                    array[i]
                ];

            }

        }


        function createBoard() {

            board.innerHTML = "";

            shuffle(cards);


            cards.forEach(function (symbol) {

                const card =
                    document.createElement(
                        "button"
                    );


                card.type = "button";

                card.className =
                    "memory-card";

                card.textContent =
                    "?";


                card.dataset.symbol =
                    symbol;


                card.addEventListener(
                    "click",
                    function () {

                        flipCard(card);

                    }
                );


                board.appendChild(card);

            });


            moves = 0;

            pairs = 0;

            firstCard = null;

            secondCard = null;

            locked = false;


            movesElement.textContent =
                moves;

            pairsElement.textContent =
                pairs;

            message.textContent =
                "Encuentra todas las parejas.";

        }


        function flipCard(card) {

            if (locked) {
                return;
            }


            if (
                card === firstCard
            ) {
                return;
            }


            if (
                card.classList.contains(
                    "matched"
                )
            ) {
                return;
            }


            card.textContent =
                card.dataset.symbol;

            card.classList.add(
                "flipped"
            );


            if (!firstCard) {

                firstCard = card;

                return;

            }


            secondCard = card;

            moves++;

            movesElement.textContent =
                moves;

            checkMatch();

        }


        function checkMatch() {

            const isMatch =
                firstCard.dataset.symbol ===
                secondCard.dataset.symbol;


            if (isMatch) {

                firstCard.classList.add(
                    "matched"
                );

                secondCard.classList.add(
                    "matched"
                );


                pairs++;

                pairsElement.textContent =
                    pairs;


                firstCard = null;

                secondCard = null;


                if (pairs === symbols.length) {

                    message.textContent =
                        "¡Ganaste! Encontraste todas las parejas.";

                }

                return;

            }


            locked = true;


            setTimeout(
                function () {

                    firstCard.textContent =
                        "?";

                    secondCard.textContent =
                        "?";


                    firstCard.classList.remove(
                        "flipped"
                    );

                    secondCard.classList.remove(
                        "flipped"
                    );


                    firstCard = null;

                    secondCard = null;

                    locked = false;

                },
                800
            );

        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    createBoard();

                }
            );

        }


        createBoard();

    }

});

