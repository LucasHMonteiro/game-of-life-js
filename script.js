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

setInterval(function(){
	var squareSize = 5;
	canvas = setCanvas(squareSize);
	var map = randomizeMatrix(setMatrix(canvas, squareSize));
	drawMap(map, canvas, squareSize);
}, 200);

