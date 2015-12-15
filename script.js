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
	console.log(move);
	takeTurn(aiSign, move[1]);
    };

    var minimax = function(board, sign, pos) {
	var maxScore = -10;
	var gameScore = score(board);
	
	var multi = sign === aiSign ? 1 : -1;
	/*if (sign === playerSign) {
	  multi = -1;
	  }*/
	
	if (boardFull(board) || gameScore) {
	    return [gameScore, pos];
	}

	var moves = getPossibleMoves(board);
	var thisScore;
	var bestMove = pos;
	
	var oppSign = sign === "O" ? "X" : "O";
	while (moves.length > 0) {

	    var position = moves.pop();
	    var b = board.slice();
	    b[position] = sign;

	    var result = minimax(b, oppSign, position);
	    thisScore = multi*result[0];

	    if (thisScore >= maxScore) {
		maxScore = thisScore;
		bestMove = position;
	    }
	}

	return [multi*maxScore, bestMove];
	
    };

    var score = function(board) {
	if (win(board, playerSign)) {
	    return -10;
	}
	else if (win(board, aiSign)) {
	    return 10;
	}
	else {
	    return 0;
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

    var boardFull = function(board) {
	return !board.some(function(position) {
	    return position === "" ;
	});
    };

    // adds sign to the game board and updates display
    var takeTurn = function(sign, position, square){
	if (!square) {
	    square = $("#s"+position);
	}
	
	square.text(sign);
	board[position] = sign;
	order.push(position);
    };
    
};


var gameState = function(board, currentMove, movesTaken) {
    this.board = board;
    this.currentMove = currentMove;
    this.movesTake = movesTaken;
};


