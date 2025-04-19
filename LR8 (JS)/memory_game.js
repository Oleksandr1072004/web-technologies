// Game state
const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moveCount: 0,
    timer: null,
    timeLeft: 0,
    currentPlayer: 1,
    players: [
        { name: 'Гравець 1', score: 0, moves: 0, time: 0 },
        { name: 'Гравець 2', score: 0, moves: 0, time: 0 }
    ],
    rounds: 1,
    currentRound: 1,
    gameStarted: false
};

// DOM elements
const elements = {
    gameBoard: document.getElementById('game-board'),
    timeDisplay: document.getElementById('time'),
    moveCountDisplay: document.getElementById('move-count'),
    currentPlayerDisplay: document.getElementById('current-player'),
    startButton: document.getElementById('start-game'),
    resetButton: document.getElementById('reset-settings'),
    restartButton: document.getElementById('restart'),
    newGameButton: document.getElementById('new-game'),
    results: document.getElementById('results'),
    resultsContent: document.getElementById('results-content'),
    playerNames: document.getElementById('player-names'),
    rowsInput: document.getElementById('rows'),
    colsInput: document.getElementById('cols'),
    difficultySelect: document.getElementById('difficulty'),
    playersSelect: document.getElementById('players'),
    roundsInput: document.getElementById('rounds'),
    player1Input: document.getElementById('player1'),
    player2Input: document.getElementById('player2')
};

// Initialize the game
function init() {
    setupEventListeners();
    togglePlayerNames();
}

// Set up event listeners
function setupEventListeners() {
    elements.startButton.addEventListener('click', startGame);
    elements.resetButton.addEventListener('click', resetSettings);
    elements.restartButton.addEventListener('click', restartGame);
    elements.newGameButton.addEventListener('click', newGame);
    elements.playersSelect.addEventListener('change', togglePlayerNames);
}

// Toggle player names input based on number of players
function togglePlayerNames() {
    const players = parseInt(elements.playersSelect.value);
    elements.playerNames.classList.toggle('hidden', players === 1);
}

// Reset settings to default
function resetSettings() {
    elements.rowsInput.value = 4;
    elements.colsInput.value = 4;
    elements.difficultySelect.value = 'easy';
    elements.playersSelect.value = '1';
    elements.roundsInput.value = 1;
    elements.player1Input.value = '';
    elements.player2Input.value = '';
    togglePlayerNames();
}

// Start the game with current settings
function startGame() {
    const rows = parseInt(elements.rowsInput.value);
    const cols = parseInt(elements.colsInput.value);
    const difficulty = elements.difficultySelect.value;
    const players = parseInt(elements.playersSelect.value);
    const rounds = parseInt(elements.roundsInput.value);

    // Validate input
    if (rows < 4 || cols < 4 || rows > 6 || cols > 6) {
        alert('Розмір поля повинен бути від 4x4 до 6x6');
        return;
    }

    if ((rows * cols) % 2 !== 0) {
        alert('Кількість карток повинна бути парною');
        return;
    }

    // Set up game state
    gameState.rows = rows;
    gameState.cols = cols;
    gameState.difficulty = difficulty;
    gameState.playersCount = players;
    gameState.rounds = rounds;
    gameState.currentRound = 1;
    gameState.gameStarted = true;

    // Set player names
    gameState.players[0].name = elements.player1Input.value || 'Гравець 1';
    if (players === 2) {
        gameState.players[1].name = elements.player2Input.value || 'Гравець 2';
    }

    // Reset player stats
    gameState.players.forEach(player => {
        player.score = 0;
        player.moves = 0;
        player.time = 0;
    });

    // Set timer based on difficulty
    switch (difficulty) {
        case 'easy':
            gameState.timeLeft = 180; // 3 minutes
            break;
        case 'normal':
            gameState.timeLeft = 120; // 2 minutes
            break;
        case 'hard':
            gameState.timeLeft = 60; // 1 minute
            break;
    }

    // Hide settings, show game info and board
    document.querySelector('.settings-panel').classList.add('hidden');
    document.querySelector('.game-info').classList.remove('hidden');
    elements.gameBoard.classList.remove('hidden');

    // Initialize game board
    initializeGameBoard();

    // Start timer
    startTimer();

    // Update UI
    updateGameInfo();
}

// Initialize game board with cards
function initializeGameBoard() {
    // Clear previous board
    elements.gameBoard.innerHTML = '';
    elements.gameBoard.style.gridTemplateColumns = `repeat(${gameState.cols}, 1fr)`;

    // Create pairs of cards
    const totalCards = gameState.rows * gameState.cols;
    const cardValues = [];

    for (let i = 0; i < totalCards / 2; i++) {
        cardValues.push(i, i);
    }

    // Shuffle cards
    shuffleArray(cardValues);

    // Create card elements
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moveCount = 0;
    gameState.currentPlayer = 1;

    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.value = value;
        card.addEventListener('click', handleCardClick);

        elements.gameBoard.appendChild(card);
        gameState.cards.push({
            element: card,
            value: value,
            flipped: false,
            matched: false
        });
    });
}

// Handle card click
function handleCardClick(event) {
    if (!gameState.gameStarted) return;

    const cardIndex = parseInt(event.target.dataset.index);
    const card = gameState.cards[cardIndex];

    // Don't allow clicking if card is already flipped or matched
    if (card.flipped || card.matched || gameState.flippedCards.length >= 2) {
        return;
    }

    // Flip the card
    flipCard(cardIndex);

    // Add to flipped cards
    gameState.flippedCards.push(cardIndex);

    // If two cards are flipped, check for match
    if (gameState.flippedCards.length === 2) {
        gameState.moveCount++;
        gameState.players[gameState.currentPlayer - 1].moves++;
        updateGameInfo();

        const card1 = gameState.cards[gameState.flippedCards[0]];
        const card2 = gameState.cards[gameState.flippedCards[1]];

        if (card1.value === card2.value) {
            // Match found
            card1.matched = true;
            card2.matched = true;
            gameState.matchedPairs++;
            gameState.players[gameState.currentPlayer - 1].score++;

            // Clear flipped cards
            gameState.flippedCards = [];

            // Check if game is over
            if (gameState.matchedPairs === (gameState.rows * gameState.cols) / 2) {
                endRound();
            }
        } else {
            // No match - flip back after delay
            setTimeout(() => {
                flipCard(gameState.flippedCards[0]);
                flipCard(gameState.flippedCards[1]);
                gameState.flippedCards = [];

                // Switch player if multiplayer
                if (gameState.playersCount === 2) {
                    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
                    updateGameInfo();
                }
            }, 1000);
        }
    }
}

// Flip a card
function flipCard(index) {
    const card = gameState.cards[index];
    card.flipped = !card.flipped;

    if (card.flipped) {
        card.element.textContent = card.value;
        card.element.classList.add('flipped');
    } else {
        card.element.textContent = '';
        card.element.classList.remove('flipped');
    }
}

// Start the game timer
function startTimer() {
    clearInterval(gameState.timer);
    updateTimerDisplay();

    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            endRound();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    elements.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update game info display
function updateGameInfo() {
    elements.moveCountDisplay.textContent = gameState.moveCount;
    elements.currentPlayerDisplay.textContent = gameState.players[gameState.currentPlayer - 1].name;
}

// End the current round
function endRound() {
    clearInterval(gameState.timer);
    gameState.gameStarted = false;

    // Record time for current player
    const timeUsed = getTimeBasedOnDifficulty() - gameState.timeLeft;
    gameState.players[gameState.currentPlayer - 1].time += timeUsed;

    // Check if all rounds are completed
    if (gameState.currentRound >= gameState.rounds) {
        endGame();
    } else {
        // Start next round
        gameState.currentRound++;
        setTimeout(() => {
            startGame();
        }, 2000);
    }
}

// End the game and show results
function endGame() {
    elements.gameBoard.classList.add('hidden');
    document.querySelector('.game-info').classList.add('hidden');
    elements.results.classList.remove('hidden');

    // Determine winner
    let winner = null;
    if (gameState.playersCount === 1) {
        winner = gameState.players[0];
    } else {
        if (gameState.players[0].score > gameState.players[1].score) {
            winner = gameState.players[0];
        } else if (gameState.players[1].score > gameState.players[0].score) {
            winner = gameState.players[1];
        }
        // Else it's a tie
    }

    // Display results
    let resultsHTML = '';

    if (winner) {
        resultsHTML += `<p>Переможець: <strong>${winner.name}</strong> з ${winner.score} парами!</p>`;
    } else {
        resultsHTML += `<p>Нічия! Обидва гравці знайшли по ${gameState.players[0].score} пар.</p>`;
    }

    resultsHTML += '<h3>Статистика:</h3><ul>';

    gameState.players.slice(0, gameState.playersCount).forEach(player => {
        const avgTime = player.time / gameState.rounds;
        const minutes = Math.floor(avgTime / 60);
        const seconds = avgTime % 60;

        resultsHTML += `<li>${player.name}: ${player.score} пар, ${player.moves} ходів, середній час: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</li>`;
    });

    resultsHTML += '</ul>';

    elements.resultsContent.innerHTML = resultsHTML;
}

// Restart the current game
function restartGame() {
    startGame();
}

// Start a new game (go back to settings)
function newGame() {
    elements.results.classList.add('hidden');
    document.querySelector('.settings-panel').classList.remove('hidden');
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get total time based on difficulty
function getTimeBasedOnDifficulty() {
    switch (gameState.difficulty) {
        case 'easy': return 180;
        case 'normal': return 120;
        case 'hard': return 60;
        default: return 180;
    }
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', init);