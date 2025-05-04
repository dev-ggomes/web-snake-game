const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * cols) * box,
  y: Math.floor(Math.random() * rows) * box
};
let score = 0;
let gameInterval;
let gameRunning = false;

// Função para obter valores CSS definidos como variáveis
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Função para desenhar o retângulo arredondado com cantos específicos
function drawRoundedRect(x, y, width, height, radius, fillStyle, corners) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(x + (corners.tl ? radius : 0), y);
  ctx.lineTo(x + width - (corners.tr ? radius : 0), y);
  if (corners.tr) ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  else ctx.lineTo(x + width, y);

  ctx.lineTo(x + width, y + height - (corners.br ? radius : 0));
  if (corners.br) ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  else ctx.lineTo(x + width, y + height);

  ctx.lineTo(x + (corners.bl ? radius : 0), y + height);
  if (corners.bl) ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  else ctx.lineTo(x, y + height);

  ctx.lineTo(x, y + (corners.tl ? radius : 0));
  if (corners.tl) ctx.quadraticCurveTo(x, y, x + radius, y);
  else ctx.lineTo(x, y);

  ctx.closePath();
  ctx.fill();
}

// Função para desenhar os olhos da cobra
function drawEyes(x, y, direction) {
  const eyeOffset = 4;
  const eyeSize = 3;
  ctx.fillStyle = "white";

  if (direction === "UP") {
    ctx.beginPath();
    ctx.arc(x - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  } else if (direction === "DOWN") {
    ctx.beginPath();
    ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  } else if (direction === "LEFT") {
    ctx.beginPath();
    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  } else if (direction === "RIGHT") {
    ctx.beginPath();
    ctx.arc(x - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  const key = e.key;
  if ((key === "ArrowLeft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "ArrowUp" || key === "w") && direction !== "DOWN") direction = "UP";
  else if ((key === "ArrowRight" || key === "d") && direction !== "LEFT") direction = "RIGHT";
  else if ((key === "ArrowDown" || key === "s") && direction !== "UP") direction = "DOWN";
}

function draw() {
  let head = { ...snake[0] };

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    clearInterval(gameInterval);
    alert("💀 Game Over!");
    return;
  }

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameInterval);
      alert("💀 Game Over!");
      return;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      let corners = { tl: false, tr: false, br: false, bl: false };

      switch (direction) {
        case "UP": corners.tl = true; corners.tr = true; break;
        case "DOWN": corners.bl = true; corners.br = true; break;
        case "LEFT": corners.tl = true; corners.bl = true; break;
        case "RIGHT": corners.tr = true; corners.br = true; break;
      }

      drawRoundedRect(snake[i].x, snake[i].y, box, box, 6, getCSSVar("--cobra-cabeca"), corners);
      drawEyes(snake[i].x + box / 2, snake[i].y + box / 2, direction);
    } else {
      ctx.fillStyle = getCSSVar("--cobra-corpo");
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }

  ctx.fillStyle = getCSSVar("--roxo-comida");
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Pontuação: " + score;
    food = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

// Função para iniciar o jogo ou pausar
function startPauseGame() {
  if (gameRunning) {
    clearInterval(gameInterval);
    document.getElementById("startPauseButton").innerText = "Iniciar Jogo";
  } else {
    gameInterval = setInterval(draw, 100);
    document.getElementById("startPauseButton").innerText = "Pausar Jogo";
  }
  gameRunning = !gameRunning;
}

// Função para reiniciar o jogo
function resetGame() {
    // Limpar o intervalo do jogo atual, se houver
    clearInterval(gameInterval);
  
    // Resetar a cobra, comida e pontuação
    snake = [{ x: 9 * box, y: 9 * box }];
    direction = "RIGHT";
    food = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
    };
    score = 0;
  
    // Atualizar a pontuação na tela
    document.getElementById("score").innerText = "Pontuação: 0";
  
    // Alterar o texto do botão para "Iniciar Jogo"
    document.getElementById("startPauseButton").innerText = "Iniciar Jogo";
  
    // Garantir que o jogo esteja parado
    gameRunning = false;
  
    // Limpar o canvas para o novo jogo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  

// Adicionando eventos aos botões
document.getElementById("startPauseButton").addEventListener("click", startPauseGame);
document.getElementById("resetButton").addEventListener("click", resetGame);