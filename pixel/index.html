<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pixel Art Editor</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f8f8;
    }
    .container {
      display: grid;
      grid-template-columns: repeat(20, 20px);
      grid-template-rows: repeat(20, 20px);
      gap: 1px;
      float: left;
      border: 2px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
    }
    .pixel {
      width: 20px;
      height: 20px;
      background-color: white;
      border: 1px solid #ccc;
    }
    #color-picker {
      float: left;
      margin-left: 20px;
    }
    #eraser {
      margin-left: 10px;
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    #eraser:hover {
      background-color: #45a049;
    }
    h1 {
      margin-bottom: 20px;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <h1>Pixel Art Editor</h1>
  <div class="container" id="container"></div>
  <input type="color" id="color-picker" value="#000000">
  <button id="eraser">Eraser</button>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const container = document.getElementById('container');
      const colorPicker = document.getElementById('color-picker');
      const eraserButton = document.getElementById('eraser');

      // Create grid of pixels
      for (let i = 0; i < 400; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        container.appendChild(pixel);
      }

      // Event listener to change pixel color on click
      container.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('pixel')) {
          if (e.buttons === 1) {
            setColor(e.target);
          } else if (e.buttons === 2) { // Right click for eraser
            e.target.style.backgroundColor = 'white';
          }
        }
      });

      // Event listener to draw continuously while mouse held down
      container.addEventListener('mouseover', function (e) {
        if (e.buttons === 1 && e.target.classList.contains('pixel')) {
          setColor(e.target);
        }
      });

      // Set color function
      function setColor(pixel) {
        pixel.style.backgroundColor = colorPicker.value;
      }

      // Eraser button event listener
      eraserButton.addEventListener('click', function () {
        colorPicker.value = '#FFFFFF'; // Change color to white (eraser)
      });
    });
  </script>
</body>
</html>
