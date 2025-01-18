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
let score = 0;
let gameOver = false;
let yellowFruitX = -1; // Initial position (off-screen)
let yellowFruitY = -1;
let yellowFruitVisible = false;
let yellowFruitTimer = null;
let highScore = localStorage.getItem('highScore') || 0; // Retrieve high score or default to 0
let aiHeadX = 15;
let aiHeadY = 15;
let aiXVelocity = 0;
let aiYVelocity = 0;
let aiSnakeParts = [];
let aiTailLength = 0;


setInterval(spawnYellowFruit, 15000); // Spawn every 15 seconds

function startGame() {
    document.getElementById('startButton').disabled = true; // Disable the button
    startButton.remove();
    drawGame(); // Start the game loop
}

function drawGame() {
    changeSnakePosition();
    updateAIPosition(); // Update AI position
    moveAI();
    isGameOver();
    let result = gameOver;
    if (result) {
        drawGameOverScreen();
        return; // Stop the game loop
    }
    
    clearScreen();
    checkAppleCollision();
    checkAIFruitCollision();
    checkYellowFruitCollision(); // Check yellow fruit collision
    drawApple();
    drawYellowFruit(); // Draw yellow fruit
    drawAISnake();
    drawSnake();

    setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Walls
    if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
        updateHighScore();
        gameOver = true;
    }

    // Check for collision with itself
    for (let part of snakeParts) {
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            updateHighScore();
            break;
        }
    }

}

function spawnYellowFruit() {
    if (yellowFruitVisible) return;
    const position = getRandomPosition([
        { x: appleX, y: appleY },
        ...snakeParts
    ]);
    yellowFruitX = position.x;
    yellowFruitY = position.y;
    yellowFruitVisible = true;

    yellowFruitTimer = setTimeout(() => resetYellowFruit(), 5000); // 5 seconds
}


function drawYellowFruit() {
    if (yellowFruitVisible) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(yellowFruitX * tileCount, yellowFruitY * tileCount, tileSize, tileSize);
    }
}

function resetYellowFruit() {
    yellowFruitVisible = false;
    clearTimeout(yellowFruitTimer);
    yellowFruitX = -1;
    yellowFruitY = -1;
}

function checkYellowFruitCollision() {
    if (yellowFruitVisible && headX === yellowFruitX && headY === yellowFruitY) {
        score += 20; // Double points
        tailLength += 2; // Add two segments to the snake

        // Update score display
        document.getElementById('scoreBoard').innerText = "Score: " + score;

        // Remove the yellow fruit
        yellowFruitVisible = false;
        clearTimeout(yellowFruitTimer); // Clear the timer
        yellowFruitX = -1;
        yellowFruitY = -1;
        updateScoreBoard();
        updateGameSpeed();
    }
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
        do {
            appleX = Math.floor(Math.random() * tileCount);
            appleY = Math.floor(Math.random() * tileCount);
        } while (snakeParts.some(part => part.x === appleX && part.y === appleY)); // Avoid placing apple on the snake

        score += 10;
        updateScoreBoard();
        tailLength++;
        updateGameSpeed();
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
    tailLength = 0;
    snakeParts = [];
    document.getElementById('scoreBoard').innerText = "Score: 0";
    gameOver = false;
    resetYellowFruit(); // Reset yellow fruit
    updateScoreBoard();
    drawGame();
}

function updateScoreBoard() {
    document.getElementById('scoreBoard').innerText = `Score: ${score} | High Score: ${highScore}`;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save to localStorage
    }
}

function updateGameSpeed() {
    if (score % 50 === 0 && score > 0) { // Increase speed every 50 points
        speed += 1;
    }
}

function moveAI() {
    let targetX = appleX;
    let targetY = appleY;

    // If a yellow fruit is visible, target it instead
    if (yellowFruitVisible) {
        targetX = yellowFruitX;
        targetY = yellowFruitY;
    }

    // Move toward the target fruit
    if (aiHeadX < targetX) {
        aiXVelocity = 1;
        aiYVelocity = 0;
    } else if (aiHeadX > targetX) {
        aiXVelocity = -1;
        aiYVelocity = 0;
    } else if (aiHeadY < targetY) {
        aiXVelocity = 0;
        aiYVelocity = 1;
    } else if (aiHeadY > targetY) {
        aiXVelocity = 0;
        aiYVelocity = -1;
    }
}

function updateAIPosition() {
    aiHeadX += aiXVelocity;
    aiHeadY += aiYVelocity;

    // Add the current head position to the body
    if (aiTailLength > 0) {
        aiSnakeParts.push(new SnakePart(aiHeadX, aiHeadY));
    }

    // Remove extra parts to maintain the correct length
    while (aiSnakeParts.length > aiTailLength) {
        aiSnakeParts.shift();
    }
}

function checkAIFruitCollision() {
    // Check collision with the player's apple
    if (aiHeadX === appleX && aiHeadY === appleY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        aiTailLength++; // Grow the AI snake
    }

    // Check collision with the yellow fruit
    if (yellowFruitVisible && aiHeadX === yellowFruitX && aiHeadY === yellowFruitY) {
        yellowFruitVisible = false; // Hide the yellow fruit
        aiTailLength += 2; // Grow more
        clearTimeout(yellowFruitTimer);
    }
}


function drawAISnake() {
    ctx.fillStyle = 'blue'; // AI snake's colour

    for (let part of aiSnakeParts) {
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    // Draw the AI snake's head
    ctx.fillRect(aiHeadX * tileCount, aiHeadY * tileCount, tileSize, tileSize);
}

document.getElementById('startButton').addEventListener('click', startGame);

