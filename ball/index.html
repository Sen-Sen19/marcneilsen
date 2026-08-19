<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Draggable Bouncing Ball</title>
<style>
 body, html {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#ball {
  width: 50px;
  height: 50px;
  background-color: #3498db;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: move;
}

</style>
</head>
<body>
<div id="ball"></div>

<script>
// Select the ball element
const ball = document.getElementById('ball');

// Variables for drag functionality
let isDragging = false;
let offsetX, offsetY;
let previousX, previousY;

// Variables for physics
let positionX = 0;
let positionY = 0;
let velocityX = 0;
let velocityY = 0;
const gravity = 0.5;
const bounceFactor = -0.7; // Adjust bounce factor for realistic bounce

// Function to update ball position
function updatePosition() {
  velocityY += gravity;
  positionX += velocityX;
  positionY += velocityY;
  
  // Bounce on floor and ceiling of the window
  if (positionY + ball.offsetHeight >= window.innerHeight) {
    positionY = window.innerHeight - ball.offsetHeight;
    velocityY *= bounceFactor; // Bounce with reduced velocity
  } else if (positionY <= 0) {
    positionY = 0;
    velocityY *= bounceFactor; // Bounce with reduced velocity
  }
  
  // Bounce on left and right walls of the window
  if (positionX <= 0) {
    positionX = 0;
    velocityX *= bounceFactor; // Bounce with reduced velocity
  } else if (positionX + ball.offsetWidth >= window.innerWidth) {
    positionX = window.innerWidth - ball.offsetWidth;
    velocityX *= bounceFactor; // Bounce with reduced velocity
  }
  
  ball.style.left = `${positionX}px`;
  ball.style.top = `${positionY}px`;
  
  requestAnimationFrame(updatePosition);
}

// Mouse event listeners
ball.addEventListener('mousedown', function(e) {
  isDragging = true;
  offsetX = e.clientX - ball.getBoundingClientRect().left;
  offsetY = e.clientY - ball.getBoundingClientRect().top;
  previousX = e.clientX;
  previousY = e.clientY;
});





document.addEventListener('mousemove', function(e) {
  if (isDragging) {
    let deltaX = e.clientX - previousX;
    let deltaY = e.clientY - previousY;
    
    positionX += deltaX;
    positionY += deltaY;
    
    // Ensure ball stays within window boundaries during drag
    if (positionX < 0) {
      positionX = 0;
    } else if (positionX + ball.offsetWidth > window.innerWidth) {
      positionX = window.innerWidth - ball.offsetWidth;
    }
    
    if (positionY < 0) {
      positionY = 0;
    } else if (positionY + ball.offsetHeight > window.innerHeight) {
      positionY = window.innerHeight - ball.offsetHeight;
    }
    
    ball.style.left = `${positionX - offsetX}px`;
    ball.style.top = `${positionY - offsetY}px`;
    
    previousX = e.clientX;
    previousY = e.clientY;
    
    velocityX = deltaX;
    velocityY = deltaY;
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
});

// Start animation loop
requestAnimationFrame(updatePosition);

</script>
</body>
</html>
