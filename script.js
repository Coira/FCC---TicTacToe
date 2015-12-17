$(document).ready(function() {

    // keep the board's width and height equal on page resize
    $(window).resize(function(){
	var width = $("#board").width();
	$("#board").css({"height":width+"px"});
    });
    $(window).resize();
    
    var game = new Game();
    
    $(".square").click(function() {
	game.playerTurn($(this));
    });

    $("#switch").click(function() {
	game.switchSides();
    });

    game.start();
});

var Game = function() {
    
    var board = [];
    var playerSign = "X";
    var aiSign = "O";
    var wins = 0;
    var losses = 0;
    var draws = 0;
    var gameOver = false;
    var lastSquarePlayed = null;
    var goFirst = true;
    
    this.start = function() {
	gameOver = false;
	
	// clear the board
	for (var i = 0; i < 9; i++) {
	    board[i] = "";
	    $("#s"+i).text("");
	}
	
	//if ai starts, have it take its turn
	if (!goFirst) {
	    takeTurn(aiSign, Math.floor(Math.random()*9));
	}
    };

    // allow the player to swap between being O and X
    this.switchSides = function() {
	if (!gameOver) {
	    goFirst = !goFirst;
	    playerSign = playerSign === "O" ? "X" : "O";
	    aiSign = aiSign === "O" ? "X" : "O";
	}

	$("#switch").text("Switch sides - Play as " + aiSign);
	this.start();

    };
    
    // called when player clicks on a square
    this.playerTurn = function(square) {
	var index = parseInt(square.attr("id")[1]);

	// if square is free, let player take her turn, otherwise ignore move
	if (!board[index] && !gameOver) {
	    takeTurn(playerSign, index, square);
	    aiTurn();
	}
    };

    // ai works out the best move to play, then takes it
    var aiTurn = function(){
	var move = minimax(board, aiSign)[1];
	takeTurn(aiSign, move);
    };

    // calculates the best possible move to take to ensure at least a draw
    var minimax = function(board, sign, pos) {
	var gameScore = score(board);

	// game's over, return the score
	if (boardFull(board) || gameScore) {
	    return [gameScore, pos];
	}

	// mini-maxer. AI looks for biggest score, player looks for smallest
	var multi = sign === aiSign ? 1 : -1;
	
	var moves = getPossibleMoves(board);
	var bestScore = -100;
	var positions = [pos];
	var thisScore;
	
	var oppSign = sign === "O" ? "X" : "O";  // opponent's sign
	while (moves.length > 0) {

	    var position = moves.pop();
	    var b = board.slice();
	    b[position] = sign;

	    // recursively call minimax
	    var result = minimax(b, oppSign, position);
	    thisScore = multi*result[0];

	    // not strictly necessary, but makes AI less predictable
	    // make a list of all best possible moves
	    if (thisScore === bestScore) {
		positions.push(position);
	    }
	    else if (thisScore > bestScore) {
		bestScore = thisScore;
		positions = [position];
	    }
	}

	// choose a move at random from the best moves
	var randomMove = Math.floor(Math.random() * positions.length);
	
	return [multi*bestScore, positions[randomMove]];
    };

    // score takes into account winning and shortest number of moves taken
    var score = function(board) {
	var emptySquares = board.filter(function(square) {
	    return square === "";
	}).length;
	
	if (win(board, playerSign)) {
	    return -10 - emptySquares;
	}
	else if (win(board, aiSign)) {
	    return 10 + emptySquares;
	}
	else {
	    return 0;  // draw or no winner
	}
    };

    // returns all free spaces
    var getPossibleMoves = function(board) {
	var moves = [];
	for (var i = 0; i < 9; i++) {
	    if (board[i] === "") {
		moves.push(i);
	    }
	}

	return moves;
    };

    // checks for a winner -- whether a line has three of the same signs
    var win = function(board, sign) {
	var lines = [[0,1,2],[3,4,5],[6,7,8],
		     [0,3,6],[1,4,7],[2,5,8],
		     [0,4,8],[2,4,6]];

	return lines.some(function(line) {
	    return line.every(function(position) {
		return board[position] === sign;
	    });
	});
    };

    // are there any free squares available?
    var boardFull = function(board) {
	return !board.some(function(position) {
	    return position === "" ;
	});
    };

    // adds sign (X or O) to the game board and updates display
    var takeTurn = function(sign, position, square){
	if (!square) {
	    square = $("#s"+position);
	}
	
	if (lastSquarePlayed) {
	    lastSquarePlayed.removeClass("lastPlayed");
	}

	// highlight last move made - easier for player to see
	square.addClass("lastPlayed");
	square.text(sign);
	board[position] = sign;
	lastSquarePlayed = square;
	
	// check whether game is over, and if so, score the game
	isGameOver();
    };

    var isGameOver = function() {
	// if gameOver is true, game's already been scored.
	// player must click reset to continue
	
	if (!gameOver) {
	    // is the board full or do we have a winner?
	    if (win(board, playerSign)) {
		wins++;
		$("#wins").text("WINS: " + wins);
		endGame();
	    }
	    else if (win(board, aiSign)) {
		losses++;
		$("#losses").text("LOSSES: " + losses);
		endGame();
	    }
	    else if (boardFull(board)) {
		draws++;
		$("#draws").text("DRAWS: " + draws);
		endGame();
	    }
	}
    };

    // end game and visual indication that game's over
    var endGame = function() {
	gameOver = true;
	$("#switch").text("RESET GAME");
	lastSquarePlayed.removeClass("lastPlayed");
    };

};  
