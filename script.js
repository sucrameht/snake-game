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
let snakeParts = [];
let tailLength = 0;
let score = 0

function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        drawGameOverScreen();
        return; // Stop the game loop
    }

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Check for collisions with walls
    if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
        return true;
    }

    // Check for collision with itself
    for (let part of snakeParts) {
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    return false;
}

class SnakePart {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';

    // snake parts
    for(let part of snakeParts){
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    // head
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
    // Add the current head position to the body
    if (tailLength > 0) {
        snakeParts.push(new SnakePart(headX, headY));
    }

    // Remove extra parts to maintain the correct length
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    // Move the head
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
        score += 10;
        document.getElementById('scoreBoard').innerText = "Score: " + score;
        tailLength ++;
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

    if (event.keyCode == 82) {
        restartGame();
    }
}

function drawGameOverScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);
}

function restartGame() {
    headX = 10;
    headY = 10;
    appleX = 5;
    appleY = 5;
    xVelocity = 0;
    yVelocity = 0;
    score = 0;
    document.getElementById('scoreBoard').innerText = "Score: 0";
    drawGame(); // Restart the game loop
}

drawGame();
