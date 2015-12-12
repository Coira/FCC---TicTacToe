$(document).ready(function() {
    
    $(".square").click(function() {
	playerTurn($(this));
    });

    var board = [];
    var playerSign = "O";
    var aiSign = "X";
    var order = [];
    
    function start() {
	for (var i = 0; i < 9; i++) {
	    board[i] = "";
	}

	// clear board
	// ask whether player wants to be X or O
    }

    function playerTurn(square) {

	var index = parseInt(square.attr("id")[1]);

	if (!board[index]) {
	    square.text(playerSign);
	    board[index] = playerSign;
	    order.push(index);
	    
	    //console.log(board);
	    console.log(order);
	    aiTurn();
	}
    }

    function aiTurn(){
	for (var i = 0; i < 9; i++) {
	    if (!board[i]) {
		board[i] = aiSign;
		$("#s"+i).text(aiSign);
		order.push(i);
		console.log(order);
		break;
	    }
	}
    }

	

});

