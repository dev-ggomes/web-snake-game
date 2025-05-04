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

// Função para obter valores CSS definidos como variáveis
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // desenha a cobra
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0
      ? getCSSVar("--cobra-cabeca")
      : getCSSVar("--cobra-corpo");
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // desenha comida
  ctx.fillStyle = getCSSVar("--roxo-comida");
  ctx.fillRect(food.x, food.y, box, box);

  // movimento
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // colisão com parede
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    clearInterval(game);
    alert("💀 Game Over!");
  }

  // colisão com corpo
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(game);
      alert("💀 Game Over!");
    }
  }

  // comer comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Pontuação: " + score;
    food = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
    };
  } else {
    snake.pop(); // remove cauda se não comer
  }

  snake.unshift(head);
}

const game = setInterval(draw, 100);
