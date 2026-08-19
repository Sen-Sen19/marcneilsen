<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guitar String Lines</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: black;
      overflow: hidden;
      position: relative;
    }

    .line {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: white;
      opacity: 0.3;
      transition: transform 0.1s ease;
    }

    @keyframes wiggle {
      0%   { transform: translateY(0); }
      25%  { transform: translateY(-3px); }
      50%  { transform: translateY(2px); }
      75%  { transform: translateY(-1px); }
      100% { transform: translateY(0); }
    }

    .line.wiggle {
      animation: wiggle 0.2s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <script>
    const numLines = 20;
    const startY = window.innerHeight * 0.5;
    const spacing = 15;

    for (let i = 0; i < numLines; i++) {
      const line = document.createElement('div');
      line.className = 'line';
      line.style.top = `${startY + i * spacing}px`;
      document.body.appendChild(line);

      line.addEventListener('mouseenter', () => {
        line.classList.add('wiggle');
        // Add random duration + stop after a moment
        line.style.animationDuration = (0.1 + Math.random() * 0.2) + 's';
        setTimeout(() => line.classList.remove('wiggle'), 400);
      });
    }
  </script>
</body>
</html>
