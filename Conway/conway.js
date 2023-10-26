let grid = [];
let cols = 30;
let rows = 30;
let play = false;

function setup() {
    frameRate(10);
    createCanvas(cols * 20, rows * 20);
    createGrid();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
        }
    }
}

function draw() {
    background(255);
    stroke(0);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] == 0) {
                fill(255);
                rect(i * 20, j * 20, 20, 20)
            }else {
                fill(0);
                rect(i * 20, j * 20, 20, 20)
            }
        }
    }
    if (play) {
        grid = newGen()
    }    
}

function createGrid() {
    for (let i = 0; i < rows; i++) {
        grid.push(Array(cols))
    }
 }

function mousePressed() {
    x = floor(mouseX / 20);
    y = floor(mouseY / 20);
    if (x < cols && y < rows) {
        grid[x][y] = !(grid[x][y]);
    }
}

function newGen() {
    let newGrid = []
    for (let i = 0; i < rows; i++) {
        newGrid.push(Array(cols));
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            let neighbors = getNeighbors(i, j);
            if (grid[i][j] == 1) {  
                if (neighbors == 2 || neighbors == 3) {
                    newGrid[i][j] = 1;
                }else {
                    newGrid[i][j] = 0;
                }
            }else {
                if (neighbors == 3) {
                    newGrid[i][j] = 1;
                }else {
                    newGrid[i][j] = 0;
                }
            }
        }
    }
    console.log(newGrid)
    return newGrid;
}

function getNeighbors(row, col) {
    let total = 0
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            if ((row + i > 0) && (row + i < rows)) {
                if ((col + j > 0) && (col + j < cols)) {
                    total += grid[row + i][col + j]
                }
            }
        }
    }
    console.log(total)
    return total;
}

document.getElementById("play-button").onclick = function() {
    play = !(play);
    updatePlayButton()
}

document.getElementById("clear-button").onclick = function() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0
            }
        }
    }

function updatePlayButton() {
    if (play == true) {
        document.getElementById("play-button").innerHTML = "Pause"
    }else {
        document.getElementById("play-button").innerHTML = "Play"
    }
}