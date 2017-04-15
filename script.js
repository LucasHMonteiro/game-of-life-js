
var squareSize = 5;
var canvas = setCanvas(squareSize);
var background_canvas = setBackground(canvas);
var colorArray = [
	'#f00',
	'#fe8300',
	'#ffbe00',
	'#ff0',
	'#9cff00',
	'#00ff00',
	'#0f1',
	'#0f7',
	'#00ffbd',
	'#00ffff',
	'#00bdff',
	'#007dfc',
	'#003cfe',
	'#0000ff',
	'#4a00ff',
	'#9500ff',
	'#de00ff',
	'#ff00ff',
	'#ff00c6',
	'#ff0084',
	'#ff0040',
];
var currentColor = 0;
function setCanvas(squareSize){
	w = window.innerWidth-10;
	h = window.innerHeight-10;
	var canvas = document.getElementById('canvas')
	canvas.width = w - w%squareSize;
	canvas.height = h - h%squareSize;
	return canvas
}

function setBackground(canvas){
	var background_canvas = document.getElementById('canvas_background');
	background_canvas.width = canvas.width;
	background_canvas.height = canvas.height;
	return background_canvas;
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

function rotateColor(){
	var color = colorArray[currentColor%colorArray.length];
	currentColor++;
	return color;
}

function putPixel(x, y){
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = rotateColor();
	ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);
}

function drawLine(x0, y0, x1, y1) {
	var dx = x1 - x0;
	var dy = y1 - y0;

	var inc_x = (dx >= 0) ? +1 : -1;
	var inc_y = (dy >= 0) ? +1 : -1;

	dx = (dx < 0) ? -dx : dx;
	dy = (dy < 0) ? -dy : dy;

	if (dx >= dy) {
		var d = 2*dy - dx
		var delta_A = 2*dy
		var delta_B = 2*dy - 2*dx

		var x = 0;
		var y = 0;
		for (i=0; i<=dx; i++) {
			putPixel(x + x0, y + y0);
			if (d > 0) {
				d += delta_B;
				x += inc_x;
				y += inc_y;
			}
			else {
				d += delta_A;
				x += inc_x;
			}
		}
	}
	else {
		var d = 2*dx - dy
		var delta_A = 2*dx
		var delta_B = 2*dx - 2*dy

		var x = 0;
		var y = 0;
		for (i=0; i<=dy; i++) {
			putPixel(x + x0, y + y0);
			if (d > 0) {
				d += delta_B;
				x += inc_x;
				y += inc_y;
			}
			else {
				d += delta_A;
				y += inc_y;
			}
		}
	}
}

function drawMap(map, canvas, squareSize){
	var ctx = canvas.getContext('2d');
	for (var i = 0; i < map.length; i++) {
		var row = map[i];
		for (var j = 0; j < map[i].length; j++) {
			if(map[i][j] === 0){
				ctx.fillStyle="rgba(255, 255, 255, 0)";
				ctx.clearRect(i*squareSize, j*squareSize, squareSize, squareSize);
			}else{
				ctx.fillStyle=rotateColor();
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
				if(matrix[l][k] && (l != i || k != j)){
					count++;
				}
			}
		}
	}
	return count;
}

function gameOfLife(matrix){
	var next_gen = setMatrix(canvas, squareSize);
	next_gen = fillMatrix(next_gen, 0);

	for(i = 0; i < matrix.length; i++){
		for(j = 0; j < matrix[i].length; j++){
			var aliveNeighbors = countAliveNeighbors(matrix, i, j);
			if(matrix[i][j]){
				if (aliveNeighbors >= 2 && aliveNeighbors <= 3) {
					next_gen[i][j] = 1;
				}
			}else{
				if(aliveNeighbors == 3){
					next_gen[i][j] = 1;
				}
			}
		}
	}
	return next_gen;
}
//Draw background text
var bgctx = background_canvas.getContext("2d");
bgctx.font = "30px Roboto, sans-serif";
bgctx.textAlign = "center";
bgctx.fillStyle="rgba(255, 255, 255, 0.2)";
bgctx.fillText("Draw With Your Mouse",background_canvas.width/2, background_canvas.height/2);

var matrix = fillMatrix(setMatrix(canvas, squareSize), 0);
var isPaused = false;
var canPaint = false;
var xOld = -1;
var yOld = -1;

function freeDraw(e){
	if (canPaint) {
		isPaused = true;
		var x = Math.floor((e.pageX/canvas.width)*matrix.length) - 1;
		var y = Math.floor((e.pageY/canvas.height)*matrix[0].length) - 2;
		matrix[x][y] = 1;
		drawLine(xOld, yOld, x, y);
		xOld = x;
		yOld = y;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = rotateColor();
		ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);
  }
}
canvas.addEventListener("mousemove", freeDraw, false);
canvas.addEventListener("touchmove", freeDraw, false);

canvas.addEventListener("mouseup", function(e){
	isPaused = false;
	canPaint = false;
});

canvas.addEventListener("touchend", function(e){
	isPaused = false;
	canPaint = false;
});

function clickDown(e){
	isPaused = true;
	canPaint = true;
	var x = Math.floor((e.pageX/canvas.width)*matrix.length) - 1;
	var y = Math.floor((e.pageY/canvas.height)*matrix[0].length) - 2;
	matrix[x][y] = 1;
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = rotateColor();
	ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);
	xOld = x;
	yOld = y;
}

canvas.addEventListener("mousedown", clickDown);
canvas.addEventListener("touchstart", clickDown);

//var matrix = randomizeMatrix(setMatrix(canvas, squareSize));
var interval = setInterval(function(){
	if(!isPaused){
		drawMap(matrix, canvas, squareSize);
		matrix = gameOfLife(matrix);
	}
}, 150);
