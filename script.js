$(document).ready(function() {
    
    var game = new Game();
    
    $(".square").click(function() {
	game.playerTurn($(this));
    });

    game.start();
});

var Game = function() {

    var board = [];
    var playerSign = "O";
    var aiSign = "X";
    var order = [];
    
    this.start = function() {

	// clear the board
	for (var i = 0; i < 9; i++) {
	    board[i] = "";
	}

	// TODO ask whether player wants to be X or O
	
	// if ai starts, have it take its turn
	//aiTurn();

    };

    // called when player clicks on a square
    this.playerTurn = function(square) {
	var index = parseInt(square.attr("id")[1]);

	// if square is free, let player take her turn, otherwise ignore move
	if (!board[index]) {
	    takeTurn(playerSign, index, square);
	    aiTurn();
	}
    };

    // ai works out the best move to play, then takes it
    var aiTurn = function(){
	var move = minimax(board, aiSign);
	takeTurn(aiSign, move[1]);
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

    // no more free squares available
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
	
	square.text(sign);
	board[position] = sign;
	order.push(position);
    };
    
};
