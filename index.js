"use strict";

window.onload = () => {
    init();
};

function init() {
    startGame();
}

function startGame() {
    myGameArea.start();
}

const myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.canvas.style.backgroundColor = "lightgrey";
        this.context = this.canvas.getContext("2d");
        this.canvas.setAttribute("id", "canvas");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    character: document.createElement("character"),
    move: function () {},
};

let x = 500;
let y = 250;
let dx = 4;
let dy = 4;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (640 - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 10;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 50;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
let bounces = 0;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() {
    const ctx = myGameArea.context;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    const ctx = myGameArea.context;
    const canvas = myGameArea.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();

    collisionDetection();
    drawBricks();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            bounces++;
        } else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }

    x += dx;
    y += dy;

    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    paddleX = x - 1;
}

function drawPaddle() {
    const ctx = myGameArea.context;
    const canvas = myGameArea.canvas;

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    const ctx = myGameArea.context;
    const canvas = myGameArea.canvas;
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert(`YOU WIN, CONGRATULATIONS! it took ${bounces}bounces`);
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawScore() {
    const ctx = myGameArea.context;
    const canvas = myGameArea.canvas;
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

const interval = setInterval(draw, 10);
