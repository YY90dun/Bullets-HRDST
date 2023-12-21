let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = window.innerWidth - 200;
cnv.height = window.innerHeight - 170;
let dir = -1;
let hj = 255;
// Global variables

let playa = {
  x: 310,
  y: 300,
  w: 30,
  h: 30,
  speed: 10,
  color: `rgb(${hj}, 255, 0)`,
};

let bulletSpeed = 10;
let bullets = [];
let circles = [];
let circleCount = 30;
let minRadius = 10;
let maxRadius = 25;

let random = Math.round(Math.random() * 255);

let objects = []; // Array to hold multiple objects

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let mouseX = 0;
let mouseY = 0;

// Bring in the circles
for (let i = 0; i < circleCount; i++) {
  let randomRadius = Math.random() * (maxRadius - minRadius) + minRadius;
  let randomcolour = Math.round(Math.random() * 255);
  let circle = {
    x: Math.random() * (cnv.width - 2 * randomRadius) + randomRadius,
    y: Math.random() * (cnv.height - 2 * randomRadius) + randomRadius,
    dx: (Math.random() - 1) * 5,
    dy: (Math.random() - 1) * 5,
    color: `rgb(${randomcolour}, ${randomcolour}, ${randomcolour})`,
    radius: randomRadius,
  };
  circles.push(circle);
}

// Central drawing (60 FPS)
window.addEventListener("load", draw);
function mousemover(e) {
  mouseX = e.clientX - cnv.getBoundingClientRect().left;
  mouseY = e.clientY - cnv.getBoundingClientRect().top;
}

function clickingg(e) {
  // Left mouse clicked
  if (e.button === 0) {
    let mouseX = e.clientX - cnv.getBoundingClientRect().left;
    let mouseY = e.clientY - cnv.getBoundingClientRect().top;

    let dx = mouseX - playa.x - playa.w / 2;
    let dy = mouseY - playa.y;

    let distance = Math.sqrt(dx * dx + dy * dy);
    let directionX = dx / distance;
    let directionY = dy / distance;
    random = Math.round(Math.random() * 255);

    let bullet = {
      x: playa.x + playa.w / 2,
      y: playa.y,
      radius: Math.random() * 6 + 4,
      color: `rgb(${random}, ${random}, ${random})`,
      speedX: directionX * bulletSpeed,
      speedY: directionY * bulletSpeed,
    };
    bullets.push(bullet);
  }
}

function draw() {
  // Clear the canvas
  ctx.fillStyle = `rgb(${255 - hj}, 0, 255)`;
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  hj = hj + dir;

  if (hj >= 255) {
    dir = Math.random() * 5 - 5;
  }

  if (hj <= 0) {
    dir = Math.random() * 5;
  }

  playa.color = `rgb(${hj}, 255, 0)`;

  // Move the player (playa)
  let playaMoved = false;

  if (
    rightPressed &&
    !checkCollision(playa.x + playa.speed, playa.y, playa.w, playa.h)
  ) {
    playa.x += playa.speed;
    playaMoved = true;
  } else if (
    leftPressed &&
    !checkCollision(playa.x - playa.speed, playa.y, playa.w, playa.h)
  ) {
    playa.x -= playa.speed;
    playaMoved = true;
  } else if (
    upPressed &&
    !checkCollision(playa.x, playa.y - playa.speed, playa.w, playa.h)
  ) {
    playa.y -= playa.speed;
    playaMoved = true;
  } else if (
    downPressed &&
    !checkCollision(playa.x, playa.y + playa.speed, playa.w, playa.h)
  ) {
    playa.y += playa.speed;
    playaMoved = true;
  }

  //draw the circles
  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();

    circle.x += circle.dx;
    circle.y += circle.dy;

    if (circle.x - maxRadius < 0 || circle.x + maxRadius > cnv.width) {
      circle.dx *= -1;
    }
    if (circle.y - maxRadius < 0 || circle.y + maxRadius > cnv.height) {
      circle.dy *= -1;
    }
  });

  // Draw your character
  ctx.fillStyle = `rgb(${hj}, 255, 0)`;
  ctx.fillRect(playa.x, playa.y, playa.w, playa.h);

  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];

    for (let j = 0; j < circles.length; j++) {
      let circle = circles[j];

      let dx = bullet.x - circle.x;
      let dy = bullet.y - circle.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bullet.radius + maxRadius) {
        bullets.splice(i, 1);
        circles.splice(j, 1);

        i--;
        j--;

        break;
      }
    }

    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];

      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fillStyle = bullet.color;
      ctx.fill();
      ctx.closePath();

      // Move the bullets toward your cursor
      bullet.x += bullet.speedX;
      bullet.y += bullet.speedY;

      if (
        bullet.x < 0 ||
        bullet.x > cnv.width ||
        bullet.y < 0 ||
        bullet.y > cnv.height
      ) {
        bullets.splice(i, 1);
        i--;
      }
    }
  }

  // Draw other stuff (the rest of it)
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

    if (
      playa.x < obj.x + obj.w &&
      playa.x + playa.w > obj.x &&
      playa.y < obj.y + obj.h &&
      playa.y + playa.h > obj.y
    ) {
      playaMoved = false;
      console.log("hit");
    }
  }

  if (!playaMoved) {
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
  }

  document.addEventListener("mousedown", clickingg);

  requestAnimationFrame(draw);
}

function checkCollision(x, y) {
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    if (
      x < obj.x + obj.w &&
      x + playa.w > obj.x &&
      y < obj.y + obj.h &&
      y + playa.h > obj.y
    ) {
      return true;
    }
  }
  return false;
}

window.addEventListener("mousemove", mousemover);

function mousemover(e) {
  let rect = cnv.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  // Each frame you move the mouse it will bring your player towards it
  playa.x += (mouseX - playa.x - playa.w / 2) * 0.04;
  playa.y += (mouseY - playa.y - playa.h / 2) * 0.04;

  // Keep the character from going OOB
  if (playa.x < 20) {
    playa.x = 20;
  }

  if (playa.x + playa.w > cnv.width - 20) {
    playa.x = cnv.width - playa.w - 20;
  }

  if (playa.y < 20) {
    playa.y = 20;
  }

  if (playa.y + playa.h > cnv.height - 20) {
    playa.y = cnv.height - playa.h - 20;
  }

  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];

    if (checkCollision(playa.x, playa.y)) {
      playa.x = 9999;
    }
  }
}

window.addEventListener("mousemove", mousemover);

let leftWl = {
  x: cnv.width - 20,
  y: 0,
  w: 20,
  h: cnv.height,
  color: "black",
};

let riteWl = {
  x: 0,
  y: 0,
  w: 20,
  h: cnv.height,
  color: "black",
};

let topWl = {
  x: 0,
  y: 0,
  w: cnv.width,
  h: 20,
  color: "black",
};

let botWl = {
  x: 0,
  y: cnv.height - 20,
  w: cnv.width,
  h: 20,
  color: "black",
};

objects.push(leftWl);
objects.push(riteWl);
objects.push(topWl);
objects.push(botWl);

for (let i = 0; i < objects.length; i++) {
  let obj = objects[i];

  if (
    playa.x < obj.x + obj.w &&
    playa.x + playa.w > obj.x &&
    playa.y < obj.y + obj.h &&
    playa.y + playa.h > obj.y
  ) {
    playaMoved = false;
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
    break;
  }
}
