var squareSize = 5;
var canvas = setCanvas(squareSize);

function setCanvas(squareSize){
	w = window.innerWidth-10;
	h = window.innerHeight-10;
	var canvas = document.getElementById('canvas')
	canvas.width = w - w%squareSize;
	canvas.height = h - h%squareSize;
	return canvas
}

function setMatrix(canvas, squareSize){
	matrix = new Array(canvas.width/squareSize);
	for (i = 0; i < matrix.length; i++){
		matrix[i] = new Array(canvas.height/squareSize);
	}
	return matrix;
}

function randomizeMatrix(matrix){
	for(i = 0; i < matrix.length; i++){
		for(j = 0; j < matrix[i].length; j++){
			matrix[i][j] = Math.round(Math.random());
		}
	}
	return matrix;
}

function fillMatrix(matrix, value){
	for(i = 0; i < matrix.length; i++){
		for(j = 0; j < matrix[i].length; j++){
			matrix[i][j] = value;
		}
	}
	return matrix;
}

function drawMap(map, canvas, squareSize){
	var ctx = canvas.getContext('2d');
	for (var i = 0; i < map.length; i++) {
		var row = map[i];
		for (var j = 0; j < map[i].length; j++) {
			if(map[i][j] === 1){
				ctx.fillStyle="#000000";
				ctx.fillRect(i*squareSize, j*squareSize, squareSize, squareSize);
			}else{
				ctx.fillStyle="#00FF00";
				ctx.fillRect(i*squareSize, j*squareSize, squareSize, squareSize);
			}
		}
	}
}

function countAliveNeighbors(matrix, i, j){
	var lines = matrix.length;
	var columns = matrix[0].length;
	var count = 0;
	for(l = i-1; l <= i+1; l++){
		for(k = j-1; k <= j+1; k++){
			if(k >= 0 && k < columns && l >= 0 && l < lines){
				if(matrix[l][k]) count++;
			}
		}
	}
	return count;
}

function gameOfLife(matrix){
	var next_gen = setMatrix(canvas, squareSize);
	next_gen = fillMatrix(next_gen, 1);

	for(i = 0; i < matrix.length; i++){
		for(j = 0; j < matrix[i].length; j++){
			var aliveNeighbors = countAliveNeighbors(matrix, i, j);
			if(matrix[i][j]){
				if (aliveNeighbors < 2 || aliveNeighbors > 3) {
					next_gen[i][j] = 0;
				}
			}else{
				if(aliveNeighbors != 3){
					next_gen[i][j] = 0;
				}
			}
		}
	}
	return next_gen;
}

var matrix = randomizeMatrix(setMatrix(canvas, squareSize));

setInterval(function(){
	drawMap(matrix, canvas, squareSize);
	matrix = gameOfLife(matrix);
}, 150);

