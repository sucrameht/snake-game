const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let appleX = 5;
let appleY = 5;
let xVelocity = 0;
let yVelocity = 0;

function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Walls
    if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
        gameOver = true;
    }

    return gameOver;
}

function drawSnake() {
    ctx.fillStyle = 'green';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
    }
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    // Up
    if (event.keyCode == 38) {
        if (yVelocity == 1) return;
        yVelocity = -1;
        xVelocity = 0;
    }

    // Down
    if (event.keyCode == 40) {
        if (yVelocity == -1) return;
        yVelocity = 1;
        xVelocity = 0;
    }

    // Left
    if (event.keyCode == 37) {
        if (xVelocity == 1) return;
        xVelocity = -1;
        yVelocity = 0;
    }

    // Right
    if (event.keyCode == 39) {
        if (xVelocity == -1) return;
        xVelocity = 1;
        yVelocity = 0;
    }
}

drawGame();
