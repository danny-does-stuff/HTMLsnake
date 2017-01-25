
/*include jQuery*/
/*var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-3.1.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);*/

$(document).ready(function() {
	var $canvas = $('#canvas');
	var context = $canvas[0].getContext('2d');
	var width = $canvas.width();
	var height = $canvas.height();

	var cellWidth = 10;
	var columnCount = width / cellWidth;
	var rowCount = height / cellWidth;

	var food;
	var direction;
	var score;

	var gameLoop;

	// The snake, with the tail at index 0 and the head at index snake.length - 1
	var snake = [];

	$('#play-button').click(function() {
		init();
	});

	init();

	function init() {
		clearInterval();
		createSnake(5);
		getNewFood();
		paint();

		score = 0;
		direction = "right";

		clearInterval(gameLoop);
		gameLoop = setInterval(moveSnake, 60);
	}

	function createSnake(length) {
		for (var i = 0; i < length; i++) {
			snake[i] = {
				x: i,
				y: 0
			}
		}
	}

	function getNewFood() {
		var x = Math.floor((Math.random() * columnCount));
		var y = Math.floor((Math.random() * rowCount));

		food = {x: x, y: y};
	}

	function paint() {
		clearCanvas();
		drawSnake();
		drawFood();
	}

	function clearCanvas() {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
	}

	function drawSnake() {
		for (var i = 0; i < snake.length; i++) {
			if (i == snake.length - 1) {
				drawCell(snake[i], 'red');
			} else {
				drawCell(snake[i], 'blue');
			}
		}
	}

	function drawFood() {
		drawCell(food, 'green');
	}

	function drawCell(cell, color) {
		context.fillStyle = color;
		context.beginPath();
		context.arc(cell.x * cellWidth + cellWidth / 2, cell.y * cellWidth + cellWidth / 2, cellWidth / 2, 0 , 2 * Math.PI);
		context.fill();
	}

	function moveSnake() {
		var currHeadX = snake[snake.length - 1].x;
		var currHeadY = snake[snake.length - 1].y;

		var nextHeadX = currHeadX;
		var nextHeadY = currHeadY;

		if (direction == 'right') {
			nextHeadX++;
		} else if (direction == 'left') {
			nextHeadX--;
		} else if (direction == 'up') {
			nextHeadY--;
		} else if (direction == 'down') {
			nextHeadY++;
		} else {
			alert('something went horribly wrong');
		}

		var nextHeadLocation = {x: nextHeadX, y: nextHeadY};
		if (collision(nextHeadLocation)) {
			endGame();
		} else {
			if (foundFood(nextHeadLocation)) {
				score++;
				getNewFood();
			} else {
				snake.splice(0, 1);
			}
			snake[snake.length] = nextHeadLocation;

			paint();
		}

	}

	/**
	* Check if cell collides with the snake or any wall
	*/
	function collision(cell) {
		if (cell.x < 0 || cell.x >= columnCount) {
			return true;
		}

		if (cell.y < 0 || cell.y >= rowCount) {
			return true;
		}

		for (var i = 0; i < snake.length - 1; i++) {
			if (cell.x == snake[i].x && cell.y == snake[i].y) {
				return true;
			}
		}

		return false;
	}

	function foundFood(head) {
		return head.x == food.x && head.y == food.y;
	}

	function endGame() {
		clearInterval(gameLoop);
		alert("Game Over. Final Score: " + score);
	}

	$(document).keydown(function(e) {
		switch(e.which) {
			case 37:
				direction = 'left';
				break;
			case 38:
				direction = 'up';
				break;
			case 39:
				direction = 'right';
				break;
			case 40:
				direction = 'down';
				break;
		}
	})
});
