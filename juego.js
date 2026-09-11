/* =========================================
   PIEDRA, PAPEL O TIJERA
   HUELLA AZUL
========================================= */


/* VARIABLES */

let playerScore = 0;
let computerScore = 0;
let draws = 0;
let rounds = 0;


/* ELEMENTOS */

const playerScoreElement =
    document.getElementById("player-score");

const computerScoreElement =
    document.getElementById("computer-score");

const playerChoiceElement =
    document.getElementById("player-choice");

const computerChoiceElement =
    document.getElementById("computer-choice");

const resultElement =
    document.getElementById("result");

const resultDescription =
    document.getElementById("result-description");

const roundLabel =
    document.getElementById("round-label");

const historyList =
    document.getElementById("history-list");

const roundCounter =
    document.getElementById("round-counter");


/* OPCIONES */

const choices = [
    "piedra",
    "papel",
    "tijera"
];


/* SÍMBOLOS */

const symbols = {

    piedra: "✊",

    papel: "✋",

    tijera: "✌"

};


/* =========================
   SONIDOS
========================= */

/*
   Los sonidos se generan directamente
   con Web Audio API.
*/

function playSound(type) {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    const audioContext = new AudioContext();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    if (type === "piedra") {

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            130,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            70,
            audioContext.currentTime + 0.18
        );

    }


    if (type === "papel") {

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(
            500,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            250,
            audioContext.currentTime + 0.25
        );

    }


    if (type === "tijera") {

        oscillator.type = "square";

        oscillator.frequency.setValueAtTime(
            800,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            300,
            audioContext.currentTime + 0.12
        );

    }


    if (type === "win") {

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            450,
            audioContext.currentTime
        );

        oscillator.frequency.setValueAtTime(
            650,
            audioContext.currentTime + 0.12
        );

        oscillator.frequency.setValueAtTime(
            850,
            audioContext.currentTime + 0.24
        );

    }


    if (type === "lose") {

        oscillator.type = "sawtooth";

        oscillator.frequency.setValueAtTime(
            400,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            150,
            audioContext.currentTime + 0.3
        );

    }


    if (type === "draw") {

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(
            350,
            audioContext.currentTime
        );

        oscillator.frequency.setValueAtTime(
            350,
            audioContext.currentTime + 0.15
        );

    }


    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.15,
        audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.35
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.35
    );
}


/* =========================
   JUGADA COMPUTADORA
========================= */

function computerPlay() {

    const randomIndex =
        Math.floor(Math.random() * choices.length);

    return choices[randomIndex];
}


/* =========================
   DETERMINAR GANADOR
========================= */

function determineWinner(player, computer) {

    if (player === computer) {

        return "draw";

    }


    if (
        (player === "piedra" && computer === "tijera") ||
        (player === "papel" && computer === "piedra") ||
        (player === "tijera" && computer === "papel")
    ) {

        return "win";

    }


    return "lose";
}


/* =========================
   JUGAR
========================= */

function playGame(playerChoice) {

    const computerChoice =
        computerPlay();


    rounds++;


    /* SONIDO DE LA ELECCIÓN */

    playSound(playerChoice);


    /* MOSTRAR ELECCIONES */

    playerChoiceElement.innerHTML =
        `<span>${symbols[playerChoice]}</span>`;

    computerChoiceElement.innerHTML =
        `<span>${symbols[computerChoice]}</span>`;


    /* ANIMACIÓN */

    playerChoiceElement.classList.remove(
        "animate-choice"
    );

    computerChoiceElement.classList.remove(
        "animate-choice"
    );


    void playerChoiceElement.offsetWidth;


    playerChoiceElement.classList.add(
        "animate-choice"
    );

    computerChoiceElement.classList.add(
        "animate-choice"
    );


    /* RESULTADO */

    const result =
        determineWinner(
            playerChoice,
            computerChoice
        );


    if (result === "win") {

        playerScore++;

        resultElement.textContent =
            "¡Ganaste!";

        resultDescription.textContent =
            `${capitalize(playerChoice)} vence a ${computerChoice}.`;

        roundLabel.textContent =
            "RESULTADO";

        playSound("win");

    }


    else if (result === "lose") {

        computerScore++;

        resultElement.textContent =
            "Perdiste";

        resultDescription.textContent =
            `${capitalize(computerChoice)} vence a ${playerChoice}.`;

        roundLabel.textContent =
            "RESULTADO";

        playSound("lose");

    }


    else {

        draws++;

        resultElement.textContent =
            "¡Empate!";

        resultDescription.textContent =
            "Los dos eligieron la misma opción.";

        roundLabel.textContent =
            "RESULTADO";

        playSound("draw");

    }


    /* ACTUALIZAR MARCADOR */

    playerScoreElement.textContent =
        playerScore;

    computerScoreElement.textContent =
        computerScore;


    /* HISTORIAL */

    addHistory(
        playerChoice,
        computerChoice,
        result
    );


    /* CONTADOR */

    roundCounter.textContent =
        `${rounds} ${rounds === 1 ? "partida" : "partidas"}`;


    /* BOTÓN ACTIVO */

    document.querySelectorAll(".game-choice")
        .forEach(button => {

            button.classList.remove("active");

        });


    const selectedButton =
        document.querySelector(
            `[data-choice="${playerChoice}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("active");

    }

}


/* =========================
   HISTORIAL
========================= */

function addHistory(
    playerChoice,
    computerChoice,
    result
) {

    const emptyMessage =
        historyList.querySelector(".empty-history");


    if (emptyMessage) {

        emptyMessage.remove();

    }


    const historyItem =
        document.createElement("div");


    historyItem.className =
        "history-item";


    let resultText = "";


    if (result === "win") {

        resultText = "VICTORIA";

    }

    else if (result === "lose") {

        resultText = "DERROTA";

    }

    else {

        resultText = "EMPATE";

    }


    historyItem.innerHTML = `

        <span>
            ${symbols[playerChoice]}
            ${capitalize(playerChoice)}
        </span>

        <span>
            ${symbols[computerChoice]}
            ${capitalize(computerChoice)}
        </span>

        <span class="${result}">
            ${resultText}
        </span>

    `;


    historyList.prepend(historyItem);

}


/* =========================
   REINICIAR
========================= */

function resetGame() {

    playerScore = 0;

    computerScore = 0;

    draws = 0;

    rounds = 0;


    playerScoreElement.textContent =
        "0";

    computerScoreElement.textContent =
        "0";


    playerChoiceElement.innerHTML =
        "<span>?</span>";

    computerChoiceElement.innerHTML =
        "<span>?</span>";


    resultElement.textContent =
        "¿Quién ganará?";


    resultDescription.textContent =
        "Selecciona una de las tres opciones para comenzar.";


    roundLabel.textContent =
        "ELIGE TU JUGADA";


    roundCounter.textContent =
        "0 partidas";


    historyList.innerHTML = `

        <p class="empty-history">
            Todavía no has jugado ninguna partida.
        </p>

    `;


    document.querySelectorAll(".game-choice")
        .forEach(button => {

            button.classList.remove("active");

        });

}


/* =========================
   CAPITALIZAR
========================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}