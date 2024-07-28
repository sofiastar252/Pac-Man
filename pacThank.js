const gameBoard = document.getElementById('gameBoard');
const boardWidth = 20;
const boardHeight = 20;
let pacmanPosition = { x: 10, y: 10 };
const ghosts = [{ x: 1, y: 1 }, { x: 18, y: 1 }, { x: 1, y: 18 }, { x: 18, y: 18 }];
const scoreElement = document.createElement('div');
document.body.prepend(scoreElement);
let score = 0;
const board = [];
let gameInterval;
let gameActive = false;

function updateGameStatus(status) {
    const statusText = document.getElementById('statusText');
    statusText.textContent = status;
}

function initializeBoard() {
    gameBoard.innerHTML = '';
    for (let y = 0; y < boardHeight; y++) {
        const row = [];
        for (let x = 0; x < boardWidth; x++) {
            const element = document.createElement('div');
            element.classList.add('dot');
            if (x === 0 || y === 0 || x === boardWidth - 1 || y === boardHeight - 1) {
                element.classList.add('wall');
                row.push('wall');
            } else {
                row.push('dot');
            }
            gameBoard.appendChild(element);
        }
        board.push(row);
    }
    updateBoard();
}

function updateBoard() {
    let index = 0;
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            const cell = gameBoard.children[index];
            cell.classList.remove('pacman', 'ghost');
            if (board[y][x] === 'dot') {
                cell.classList.add('dot');
            } else {
                cell.classList.remove('dot');
            }
            index++;
        }
    }

    const pacmanIndex = pacmanPosition.y * boardWidth + pacmanPosition.x;
    gameBoard.children[pacmanIndex].classList.add('pacman');

    ghosts.forEach(ghost => {
        const ghostIndex = ghost.y * boardWidth + ghost.x;
        gameBoard.children[ghostIndex].classList.add('ghost');
    });

    if (board[pacmanPosition.y][pacmanPosition.x] === 'dot') {
        board[pacmanPosition.y][pacmanPosition.x] = 'empty';
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
    }

    if (ghosts.some(ghost => ghost.x === pacmanPosition.x && ghost.y === pacmanPosition.y)) {
        gameActive = false;
        updateGameStatus('Stopped');
        alert(`Game Over. Your score: ${score}`);
    }
}

function moveGhosts() {
    if (!gameActive) return;

    ghosts.forEach(ghost => {
        let direction = Math.floor(Math.random() * 4);
        let moveAttempt = 0;

        while (moveAttempt < 4) {
            let newX = ghost.x;
            let newY = ghost.y;

            switch (direction) {
                case 0: newY--; break;
                case 1: newX++; break;
                case 2: newY++; break;
                case 3: newX--; break;
            }

            if (newX >= 0 && newX < boardWidth && newY >= 0 && newY < boardHeight && board[newY][newX] !== 'wall') {
                ghost.x = newX;
                ghost.y = newY;
                break;
            } else {
                direction = (direction + 1) % 4;
                moveAttempt++;
            }
        }
    });
    updateBoard();
}

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;

    let newX = pacmanPosition.x;
    let newY = pacmanPosition.y;

    switch (e.key) {
        case 'ArrowUp': newY--; break;
        case 'ArrowDown': newY++; break;
        case 'ArrowLeft': newX--; break;
        case 'ArrowRight': newX++; break;
    }

    if (board[newY] && board[newY][newX] !== 'wall') {
        pacmanPosition.x = newX;
        pacmanPosition.y = newY;
        updateBoard();
    }
});

document.getElementById('startButton').addEventListener('click', function() {
    gameActive = true;
    updateGameStatus('Running');
    initializeBoard();
    gameInterval = setInterval(moveGhosts, 1000);
});

document.getElementById('restartButton').addEventListener('click', function() {
    window.location.reload();
});

document.getElementById('stopButton').addEventListener('click', function() {
    gameActive = false;
    updateGameStatus('Paused');
    alert(`Game paused. Your score: ${score}`);
});

initializeBoard();