<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Ball Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #202022;
            overflow: hidden; 
        }

        canvas {
            background-color: #202022;
            display: block; 
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');


        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let ball = {
            x: canvas.width / 2, 
            y: canvas.height / 2,
            radius: 15,
            color: 'orange',
            dx: 0,
            dy: 0,
            isMoving: false
        };

        let isDragging = false;
        let startX, startY, endX, endY;

     
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ball.x = canvas.width / 2; 
            ball.y = canvas.height / 2;
            draw();
        });

        canvas.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            isDragging = true;
            ball.dx *= 0.1; 
            ball.dy *= 0.1;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                endX = e.clientX;
                endY = e.clientY;
                draw();
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (isDragging) {
                let dx = startX - endX;
                let dy = startY - endY;
                let power = Math.sqrt(dx * dx + dy * dy) / 5;
                ball.dx = dx * 0.5; 
                ball.dy = dy * 0.5;
                ball.isMoving = true;
            }
            isDragging = false;
            draw();
        });

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
         
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();
            
    
            if (isDragging) {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = 'white';
                ctx.stroke();
                ctx.closePath();
            }
            
        }

        function update() {
            if (ball.isMoving) {
                ball.x += ball.dx;
                ball.y += ball.dy;

               
                if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                    ball.dx *= -1; 
                    ball.x = ball.x + ball.radius > canvas.width ? canvas.width - ball.radius : ball.radius;
                }
                if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                    ball.dy *= -1; 
                    ball.y = ball.y + ball.radius > canvas.height ? canvas.height - ball.radius : ball.radius; 
                }

           
                ball.dx *= 0.99;
                ball.dy *= 0.99;

               
                if (Math.abs(ball.dx) < 0.1 && Math.abs(ball.dy) < 0.1) {
                    ball.isMoving = false;
                    ball.dx = 0;
                    ball.dy = 0;
                }
            }
            draw();
            requestAnimationFrame(update);
        }

        update();
    </script>
</body>
</html>
