let bg;

function preload() {
  bg = loadImage('img/background1.jpg');
  characterSpriteSheet = loadImage('img/sprites/miku_spritesheet.png');
  // miFuente = loadFont('fuente.otf');
}

function setup() {
  createCanvas(1080, 720);
  console.log(getRowSequencies(matrix))
  // console.log(getColumnSequencies(matrix))
  //
}

function draw() {
  background(bg);

  drawMatrixHolder(matrix);
  drawMatrix(matrix, userMatrix);

  drawCursor(cursor, matrix);

  drawCharacter();

  drawControls();

}

function keyPressed() {
  let rows = matrix.solution.length;
  let cols = matrix.solution[0].length;

  if (keyCode === LEFT_ARROW) { cursor.i = (cursor.i - 1 + cols) % cols }
  if (keyCode === RIGHT_ARROW) { cursor.i = (cursor.i + 1) % cols }
  if (keyCode === UP_ARROW) { cursor.j = (cursor.j - 1 + rows) % rows }
  if (keyCode === DOWN_ARROW) { cursor.j = (cursor.j + 1) % rows }

  // Z: paint
  if (keyCode === 90) {
    switch (userMatrix[cursor.j][cursor.i]) {
      // blank & marked
      case 0:
      case 3:
        if (matrix.solution[cursor.j][cursor.i] == 0) {
          // MISTAKE
          userMatrix[cursor.j][cursor.i] = 4;
          mistakes++;
          break;
        }
        // CORRECT
        userMatrix[cursor.j][cursor.i] = 1;
        completeRow(matrix, userMatrix, cursor.j);
        completeCol(matrix, userMatrix, cursor.i);
        break;
      // painted
      case 1:
        userMatrix[cursor.j][cursor.i] = 0;
        break;
    }
  }

  // X: cross
  if (keyCode === 88) {
    switch (userMatrix[cursor.j][cursor.i]) {
      case 0:
      case 3:
        if (matrix.solution[cursor.j][cursor.i] == 1) {
          // MISTAKE
          userMatrix[cursor.j][cursor.i] = 1;
          mistakes++;
          break;
        }
        userMatrix[cursor.j][cursor.i] = 2;
        break;
      case 2:
        userMatrix[cursor.j][cursor.i] = 0;
        break;
    }
  }

  // C: mark
  if (keyCode === 67) {
    switch (userMatrix[cursor.j][cursor.i]) {
      case 0:
        userMatrix[cursor.j][cursor.i] = 3;
        break;
      case 3:
        userMatrix[cursor.j][cursor.i] = 0;
        break;
    }
  }

  // V: hint
  if (keyCode === 86) {
  }

}

/// Global variables
let canPlay = true;
let mistakes = 0;

/// Color variables


/// Matrix variables
// Must separate onto matrix.js later

// Values: 0 = blank space, 1 = painted, 2 = crossed, 3 = marked, 4 = failed

const userMatrix = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const matrix = {
  solution: [
    [1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1],
  ],
  cellSize: 80,
  xStart: 475,
  yStart: 275,
};
matrix.mWidth = matrix.cellSize * matrix.solution.length;
matrix.mHeight = matrix.cellSize * matrix.solution[0].length;
matrix.xEnd = matrix.xStart + matrix.mWidth;
matrix.yEnd = matrix.yStart + matrix.mHeight;

const cursor = {
  i: 0,
  j: 0,
  colors: [
    [252, 216, 23],   // amarillo
    [255, 0, 128],    // fucsia
  ],
};

function getRowSequencies(m) {
  const rows = [];

  for (let i = 0; i < m.solution.length; i++) {

    let num = 0;
    let row = [];
    let j = 0;

    while (j < m.solution[i].length) {
      if (m.solution[i][j] == 0) {
        if (num != 0) {
          row.push(num);
        }
        num = 0;
      }
      if (m.solution[i][j] == 1) num++;

      j++;
    }

    if (num != 0) {
      row.push(num);
    }

    rows.push(row);
  }

  return rows;
}

function getColumnSequencies(m) {
  const columns = [];

  for (let j = 0; j < m.solution[0].length; j++) {

    let num = 0;
    let column = [];
    let i = 0;

    while (i < m.solution.length) {
      if (m.solution[i][j] == 0) {
        if (num != 0) {
          column.push(num);
        }
        num = 0;
      }
      if (m.solution[i][j] == 1) num++;

      i++;
    }

    if (num != 0) {
      column.push(num);
    }

    columns.push(column);
  }

  return columns;
}


function cellMatches(userVal, solutionVal) {
  return userVal === solutionVal || (userVal === 2 && solutionVal === 0) || (userVal === 4 && solutionVal === 0);
}

function completeRow(m, userMatrix, i) {
  for (let j = 0; j < userMatrix[i].length; j++) {
    if (!cellMatches(userMatrix[i][j], m.solution[i][j]))
      return;
  }
  for (let j = 0; j < userMatrix[i].length; j++) {
    if (userMatrix[i][j] == 0)
      userMatrix[i][j] = 2;
  }
}

function completeCol(m, userMatrix, j) {
  for (let i = 0; i < userMatrix.length; i++) {
    if (!cellMatches(userMatrix[i][j], m.solution[i][j]))
      return;
  }
  for (let i = 0; i < userMatrix.length; i++) {
    if (userMatrix[i][j] == 0)
      userMatrix[i][j] = 2;
  }
}



/// DRAW METHODS
function drawMatrixHolder(m) {

  // Column holder
  let xStart = m.xStart;
  let yStart = m.yStart - 200;

  let x = xStart, y = yStart;

  // L shape
  let padding = 20;
  let xOne = xStart - 200;
  let xTwo = xStart;
  let xThree = xStart + m.cellSize * m.solution.length;

  let yOne = yStart;
  let yTwo = yStart + 200;
  let yThree = yStart + 200 + m.cellSize * m.solution[0].length;

  strokeWeight(6);
  stroke(35, 218, 192);
  fill(255, 255, 255);
  beginShape();
  vertex(xOne - padding, yTwo - padding)
  vertex(xTwo - padding, yTwo - padding)
  vertex(xTwo - padding, yOne - padding)
  vertex(xThree + padding, yOne - padding)
  vertex(xThree + padding, yThree + padding)
  vertex(xOne - padding, yThree + padding)
  endShape(CLOSE);

  const textPx = m.cellSize / 1.5;
  strokeWeight(0);

  for (let j = 0; j < m.solution[0].length; j++) {

    let fillColor = j % 2 == 0 ? [209, 242, 232] : [255, 255, 255];
    fill(fillColor);
    rect(x, y, m.cellSize, y + 125);

    let yText = m.yStart - 5;
    let cols = getColumnSequencies(m);

    fill(55, 39, 130);
    textSize(textPx);
    textAlign(CENTER, BOTTOM);
    for (let n = cols[j].length - 1; n >= 0; n--) {
      text(cols[j][n], x + m.cellSize / 2, yText)
      yText -= textPx + 8;
    }

    x += m.cellSize;
  }

  // Row holder
  xStart = m.xStart - 200;
  yStart = m.yStart;

  x = xStart, y = yStart;
  for (let i = 0; i < m.solution.length; i++) {
    let fillColor = i % 2 == 0 ? [255, 255, 255] : [209, 242, 232];
    fill(fillColor);
    rect(x, y, 200, m.cellSize);

    let xText = m.xStart - (textPx / 3);
    let rows = getRowSequencies(m);

    fill(55, 39, 130);
    textSize(textPx);
    textAlign(RIGHT, CENTER);
    for (let n = rows[i].length - 1; n >= 0; n--) {
      text(rows[i][n], xText, y + m.cellSize / 2 + 4)
      xText -= textPx + 8;
    }
    y += m.cellSize;
  }
}


// Values: 0 = blank space, 1 = painted, 2 = crossed, 3 = marked
function drawMatrix(m, userMatrix) {
  let x = m.xStart, y = m.yStart;

  strokeWeight(12);
  stroke(110, 96, 158);
  rect(m.xStart, m.yStart, m.mWidth, m.mHeight, 2);

  for (let i = 0; i < m.solution.length; i++) {
    for (let j = 0; j < m.solution[i].length; j++) {
      strokeWeight(4);
      stroke(110, 96, 158);

      let fillColor = j % 2 == 0 ? [231, 250, 255] : [255, 255, 255];

      if (userMatrix[i][j] == 1) fillColor = [35, 218, 192];
      if (userMatrix[i][j] == 3) fillColor = [253, 176, 60];


      stroke(110, 96, 158);
      fill(fillColor);

      square(x, y, m.cellSize);

      // Crossed color
      if (userMatrix[i][j] == 2) {
        fill(137, 129, 143);
        stroke(137, 129, 143);
      }
      // Failed color
      if (userMatrix[i][j] == 4) {
        fill(192, 112, 240);
        stroke(192, 112, 240);
      }
      // Crossed or Failed 'X'
      if (userMatrix[i][j] == 2 || userMatrix[i][j] == 4) {
        textSize(64)
        textAlign(CENTER, CENTER)
        // textFont('Courier New');
        text("X", x + m.cellSize / 2, y + m.cellSize / 2 + 8);
      }


      x += m.cellSize;
    }
    x = m.xStart;
    y += m.cellSize;
  }
}

function drawCursor(c, m) {
  let delta = (sin(frameCount * 0.01) + 1) / 2;
  let colorIndex = floor(frameCount / 200) % c.colors.length;
  let nextIndex = (colorIndex + 1) % c.colors.length;

  let colA = color(c.colors[colorIndex]);
  let colB = color(c.colors[nextIndex]);
  let currentColor = lerpColor(colA, colB, delta);

  let xStart = m.xStart, yStart = m.yStart;
  let x = xStart + c.i * m.cellSize;
  let y = yStart + c.j * m.cellSize;

  strokeWeight(4);
  stroke(currentColor);
  noFill();

  square(x, y, m.cellSize);
}

function drawCharacter() {
  // Origin sprite is 512 * 416
  // Dest sprite is 205 * 166
  let i = 2, j = 0;
  let xOffset = 512 * j, yOffset = 416 * i;
  image(characterSpriteSheet, 35, 500, 205, 166,  // destino
    3 + 3 * j + xOffset, 3 + 3 * i + yOffset, 512, 416); // source
}

function drawControls() {
  let xStart = width - 160, yStart = height / 2 + 80;
  let y = yStart;

  let buttons = [
    { letter: "Z", text: "Paint", color: [252, 5, 2] },
    { letter: "X", text: "Cross", color: [90, 152, 245] },
    { letter: "C", text: "Check", color: [255, 175, 26] },
    { letter: "V", text: "Hint", color: [71, 210, 109] },
  ]

  for (let i = 0; i < buttons.length; i++) {
    // Z: paint
    strokeWeight(2);
    stroke(buttons[i].color);
    fill(255, 255, 255);
    rect(xStart, y, 145, 45, 10);
    fill(buttons[i].color);
    rect(xStart, y, 45, 45, 10);
    rect(xStart + 10, y, 35, 45, 0);
    fill(255, 255, 255);
    rect(xStart + 5, y + 5, 35, 35, 5);
    textAlign(LEFT, TOP);
    textSize(32);
    fill(buttons[i].color);
    text(buttons[i].letter, xStart + 11, y + 11);
    textAlign(LEFT, CENTER);
    noStroke();
    textSize(16);
    fill(55, 39, 130);
    text(buttons[i].text, xStart + 55, y + 23);

    y += 70;
  }
}
