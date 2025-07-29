var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

var foodX;
var foodY;

var nextObstacleLength = 5; // initial length for the first obstacle
var obstacles = [];

var gameOver = false;
var retryButton;

window.onload = function () {
    board = document.getElementById("gameBoard");
    board.width = cols * blockSize;
    board.height = rows * blockSize;
    context = board.getContext("2d");

    retryButton = document.getElementById("retryButton");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 100);
};

function update() {
    if (gameOver) return;

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    context.fillStyle = "gray";
    obstacles.forEach(([x, y]) => {
        context.fillRect(x, y, blockSize, blockSize);
    });


    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
       document.getElementById("eatFood").play();
        
        if (snakeBody.length >= nextObstacleLength ) {
        placeObstacle();
        nextObstacleLength += 3; 
    }
}
    

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = [...snakeBody[i - 1]];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }


    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

   
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    
    if (
        snakeX < 0 || snakeX >= cols * blockSize ||
        snakeY < 0 || snakeY >= rows * blockSize ||
        snakeBody.some(segment => segment[0] === snakeX && segment[1] === snakeY) ||
        obstacles.some(ob => ob[0] === snakeX && ob[1] === snakeY)
    ) {
        gameOver = true;
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("Game Over", board.width / 2 - 70, board.height / 2);
        retryButton.style.display = "block"; 
        document.getElementById("gameOver").play();
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function changeDirection(e) {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeObstacle() {
    let x, y;
    let isOnSnakeOrFood = true;

    while (isOnSnakeOrFood) {
        x = Math.floor(Math.random() * cols) * blockSize;
        y = Math.floor(Math.random() * rows) * blockSize;

        isOnSnakeOrFood = 
            (x === foodX && y === foodY) ||
            (x === snakeX && y === snakeY) ||
            snakeBody.some(segment => segment[0] === x && segment[1] === y);
    }

    obstacles.push([x, y]);
}



function retryGame() {
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    placeFood();
    context.clearRect(0, 0, board.width, board.height);
    retryButton.style.display = "none"; 
    obstacles = [];
}
