let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'loses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio("content/sounds/swish.m4a");
const winSound = new Audio("content/sounds/yayy.mp3");
const loseSound = new Audio("content/sounds/aww.mp3");
const drawSound = new Audio("content/sounds/cash.mp3");

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackStand);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `content/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if (blackjackGame['turnOver'] === true) {

        blackjackGame['isStand'] = false;

        let yourImage = document.querySelector('#your-box').querySelectorAll('img');

        for (let i = 0; i < yourImage.length; i++)
            yourImage[i].remove();

        let dealerImage = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < dealerImage.length; i++)
            dealerImage[i].remove();

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = '0';
        document.querySelector('#dealer-blackjack-result').textContent = '0';

        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's Play!";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnOver'] = false;
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {

        if (activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {
            return activePlayer['score'] += blackjackGame['cardMap'][card][1];
        } else {
            return activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = "Bust!"
        document.querySelector(activePlayer['scoreSpan']).style.color = "red"
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function autoPlay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackStand() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await autoPlay(1000);
    }

    blackjackGame['turnOver'] = true;
    let winner = compareWinner();
    showResult(winner);
}

function compareWinner() {
    let winner;

    if (YOU['score'] <= 21) {

        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {

            blackjackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {

            blackjackGame['loses']++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {

            blackjackGame['draws']++;

        }

    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {

        blackjackGame['loses']++;
        winner = DEALER;

    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {

        blackjackGame['draws']++;

    }

    return winner;
}

function showResult(winner) {
    let message, messageColor

    if (winner === YOU) {

        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = "You Won!";
        messageColor = "green";
        winSound.play();

    } else if (winner === DEALER) {

        document.querySelector('#loses').textContent = blackjackGame['loses'];
        message = "You Lose!";
        messageColor = "red";
        loseSound.play();

    } else {

        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = "You Drew!";
        messageColor = "yellow";
        drawSound.play();

    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}