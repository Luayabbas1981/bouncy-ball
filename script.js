// Check device
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
// Game elements
const main = document.querySelector("main");
const startPage = document.querySelector(".start-page");
const endPage = document.querySelector(".end-page");
const warnContainer = document.querySelector(".warn-con");
const warnText = warnContainer.querySelector(".warn-con .warn-text");
const newBallImage = warnContainer.querySelector(".warn-con .warn-image");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = main.offsetWidth);
const canvasHeight = (canvas.height = main.offsetHeight);
// Sound elements
const bongSound = document.querySelector(".bong-sound");
const endSound = document.querySelector(".end-sound");
bongSound.volume = 0.1;
endSound.volume = 0.1;
// Game controls
const startBtn = document.querySelector(".start-btn");
const endBtn = document.querySelector(".restart-btn");
const warnBtn = document.querySelector(".warn-btn");
const scoreDiv = document.querySelector(".score span");

// Game values

let ball = null;
let bG1 = null;
let bG2 = null;
let bgSpeed = null;
let ballSpeed = null;
let previousBall = 1;
let score = 0;
let groundIndex = 0;
let keyboard = true;
let animateId = null;
let bgArray = [];
let ballsNumber = 3;
let speed = isMobile ? 3 : 5;
const bGImagesArray = [
  "./images/red-ground.jpg",
  "./images/lila-ground.jpg",
  "./images/blue-ground.jpg",
  "./images/green-ground.jpg",
  "./images/orange-ground.jpg",
  "./images/yellow-ground.jpg",
];
const ballsArray = [
  "red-ball",
  "lila-ball",
  "blue-ball",
  "green-ball",
  "orange-ball",
  "yellow.png",
];

const ballTouchPoint = isMobile ? canvasHeight * 0.81 : canvasHeight * 0.77;
const ballStartPosition = isMobile ? canvasHeight * 0.45 : canvasHeight * 0.25;

// Game classes

class Background {
  constructor(bgSrc, x, y, width, height) {
    this.bg = new Image();
    this.bg.src = bgSrc;
    this.bg.onload = () => {
      this.draw();
    };
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = this.speed;
    this.id = "lila";
  }

  draw() {
    ctx.drawImage(this.bg, this.x, this.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.x -= this.speed;
    if (this.x <= -this.width) {
      this.x = 0;
    }
  }
}
class Ball {
  constructor(ballSrc, x, y, width, height) {
    this.ball = new Image();
    this.ball.src = ballSrc;
    this.ball.onload = () => {
      this.draw();
    };
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = this.speed;
    this.id = "lila";
  }

  draw() {
    ctx.drawImage(this.ball, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.y >= ballTouchPoint) {
      bongSound.play();
    }
    if (this.y >= ballTouchPoint || this.y <= ballStartPosition) {
      this.speed = -this.speed;
    }
    if (this.y <= ballStartPosition) {
      this.ball.src = "./images/" + ballsArray[createRandomBall()] + ".png";
      this.id = this.ball.src.slice(29, -9);
    }
    this.y += this.speed;
  }
}

// Canvas elements

ball = new Ball(
  "./images/lila-ball.png",
  canvasWidth * 0.3,
  ballStartPosition + 50,
  isMobile ? canvasWidth * 0.1 : canvasWidth * 0.04,
  isMobile ? canvasWidth * 0.1 : canvasWidth * 0.04
);

bG1 = new Background(
  "./images/lila-ground.jpg",
  0,
  0,
  canvasWidth,
  canvasHeight
);
bgArray.push(bG1);
bG2 = new Background(
  "./images/lila-ground.jpg",
  canvasWidth,
  0,
  canvasWidth,
  canvasHeight
);
bgArray.push(bG2);

// Game functions
function startGame() {
  ballSpeed = speed;
  bgSpeed = speed;
  ball.speed = ballSpeed;
  bG1.speed = bgSpeed;
  bG2.speed = bgSpeed;
  animate();
}
function animate() {
  animateId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (ball.y >= ballTouchPoint && ball.id !== bG1.id) {
    endGame();
  } else if (ball.y >= ballTouchPoint && ball.id === bG1.id) {
    score += 10;
    scoreDiv.textContent = score;
    if (score % 40 === 0) {
      cancelAnimationFrame(animateId);
      newBallImage.src = "";
      warnText.textContent = "Beware, Beware! your speed has been increased!";
      warnContainer.classList.remove("d-none");
      speed += 0.2;
      ball.speed = speed;
      bG1.speed = speed;
      bG2.speed = speed;
    }
    if (score % 80 === 0 && ballsNumber < ballsArray.length) {
      cancelAnimationFrame(animateId);
      ballsNumber++;
      warnContainer.classList.remove("d-none");
      warnText.textContent =
        "Beware, Beware! your speed has been increased and you've got a new ball!";
      newBallImage.src = `./images/${ballsArray[ballsNumber - 1]}.png`;
    }
  }
  if (bG2.x <= canvas.getBoundingClientRect().left) {
    bG1.x = 0;
    bG2.x = canvasWidth;
  }

  bG1.update();
  bG2.update();

  ball.draw();
  ball.update();
}

// Click functions
startBtn.onclick = () => {
  startPage.classList.add("d-none");
  startGame();
};

endBtn.onclick = () => {
  location.reload();
};

warnBtn.onclick = () => {
  warnContainer.classList.add("d-none");
  animate();
};

// Create random ball color
function createRandomBall() {
  let randomBall;
  do {
    randomBall = Math.floor(
      Math.random() * ballsArray.slice(0, ballsNumber).length
    );
  } while (randomBall === previousBall);
  previousBall = randomBall;
  return randomBall;
}

// Change ground color functions
function changeBgColor() {
  if (groundIndex === bGImagesArray.slice(0, ballsNumber).length) {
    groundIndex = 0;
  }
  let newBg = bGImagesArray[groundIndex];

  bgArray.forEach((item) => {
    item.bg.src = "";
    item.bg.src = newBg;
    item.id = item.bg.src.slice(29, -11);
    item.draw();
  });
  groundIndex++;
}

canvas.addEventListener("click", changeBgColor);
document.addEventListener("keydown", function (event) {
  if (event.key === " " && keyboard) {
    changeBgColor();
  }
});

// End game function
function endGame() {
  keyboard = false;
  canvas.removeEventListener("click", changeBgColor);
  cancelAnimationFrame(animateId);
  endPage.classList.remove("d-none");
  bongSound.muted = true;
  endSound.play();
}
