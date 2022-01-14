// Author: Blake Vaughn
// Rev 1.0

const statusDisplay = document.querySelector('.game--status');

// Allows the game to be active or not
let gameActive = false;

// State of all of the cells and boards of the game
let gameState = ["", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", ""];
				
// Winning conditions for each board
const miniWinningConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

// Winning conditions for the game
const winningConditions = [
    [0, 10, 20],
    [30, 40, 50],
    [60, 70, 80],
    [0, 30, 60],
    [10, 40, 70],
    [20, 50, 80],
    [0, 40, 80],
    [20, 40, 60]
];

// Shows which boards can be played at any time
let boardEnable = [true,true,true,true,true,true,true,true,true];

// Holds current player
let currentPlayer = "X"; 

// Different status messages for the game
const winningMessage = () => `Player ${currentPlayer} has won!\nClick \"Start or Restart\" to play again!`;
const drawMessage = () => `Game ended in a draw!\nClick \"Start or Restart\" to play again!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const startMessage = () => `Click \"Start Game\" to begin!`;

// Display the starting message
statusDisplay.innerHTML = startMessage();

// If a cell is played, make the cell display the current player 
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

// Changes the player between X and O
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

// Determines which boards should be playable next turn and changes their color accordingly
function handleBoardChange(clickedCellIndex) {
    for (let i = 0; i <= 80; i=i+10) {
		if (i%10===0 && gameState[i]===''){
			if ((i/10)+1==clickedCellIndex%10){
				document.getElementById(i.toString()).style.backgroundColor = "gray"
				boardEnable[i/10]=true;
			}
			else {
				document.getElementById(i.toString()).style.backgroundColor = "black"
				boardEnable[i/10]=false;
			}
		} else if (i%10===0 && gameState[i]!=='') {
			if ((i/10)+1==clickedCellIndex%10){
				for (let j = 0; j<=80; j=j+10){
					if (i!==j && gameState[j]===''){
						document.getElementById(j.toString()).style.backgroundColor = "gray"
						boardEnable[j/10]=true;
					}
				}
				boardEnable[i]=false;
				break;
			}
		}
	}
}

// Checks to see if a board has been won or drawn
function checkMiniStatus(clickedCellIndex) {
	let roundWon = false;
	let board = clickedCellIndex-(clickedCellIndex%10);
    for (let i = 0; i <= 7; i++) {
        const winCondition = miniWinningConditions[i];
        let a = gameState[winCondition[0]+board];
        let b = gameState[winCondition[1]+board];
        let c = gameState[winCondition[2]+board];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }
	if (roundWon) {
        gameState[board] = currentPlayer;
		boardEnable[board/10] = false;
		if (currentPlayer === "X")
			document.getElementById(board.toString()).style.backgroundColor = "red"
		else
			document.getElementById(board.toString()).style.backgroundColor = "blue"
    }
	else {
		let miniGameState = ["", "", "", "", "", "", "", "", ""];

		for (let i =0; i<=8; i++) {
			miniGameState[i] = gameState[i+board+1];
		}

		let roundDraw = !miniGameState.includes("");
		if (roundDraw) {
			gameState[board] = "D";
			document.getElementById(board.toString()).style.backgroundColor = "green"
		}
	}
	checkFullStatus(clickedCellIndex);
}

// Checks to see if the game has been won or drawn
function checkFullStatus(clickedCellIndex) {
	let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c && a !== "D") {
            roundWon = true;
            break
        }
    }
	if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

	let boardState = ["", "", "", "", "", "", "", "", ""];

	for (let i =0; i<=8; i++) {
		boardState[i] = gameState[i*10];
	}

    let roundDraw = !boardState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }	

	handleBoardChange(clickedCellIndex);
	handlePlayerChange();
}

// Determines whether the cell that was clicked is enabled and continues if it is
function handleCellClick(clickedCellEvent) { 
    const clickedCell = clickedCellEvent.target;

    const clickedCellIndex = parseInt(
      clickedCell.getAttribute('data-cell-index')
    );

    if (!boardEnable[parseInt(clickedCellIndex/10)] || gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
  
    handleCellPlayed(clickedCell, clickedCellIndex);
	checkMiniStatus(clickedCellIndex);

}

// When the start button is pressed, the game starts and default values are set
function handleStartGame() {
	if (!gameActive){
		for (let j = 0; j<=80; j=j+10){
			document.getElementById(j.toString()).style.backgroundColor = "gray"
		}
		statusDisplay.innerHTML = currentPlayerTurn();
		gameActive = true;
		currentPlayer = "X";
		gameState = ["", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", ""];
		boardEnable = [true,true,true,true,true,true,true,true,true];
		statusDisplay.innerHTML = currentPlayerTurn();
		document.querySelectorAll('.cell')
				.forEach(cell => cell.innerHTML = "");
		}
}

// When the restart button is pressed, the values are set to default and the game restarts
function handleRestartGame() {
	gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", ""];
	boardEnable = [true,true,true,true,true,true,true,true,true];
	for (let j = 0; j<=80; j=j+10){
		document.getElementById(j.toString()).style.backgroundColor = "gray"
	}
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
               .forEach(cell => cell.innerHTML = "");
}

// Handles different actions by user
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--start').addEventListener('click', handleStartGame);
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);