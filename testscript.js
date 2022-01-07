// Author: Blake Vaughn

const statusDisplay = document.querySelector('.game--status');

let gameActive = false;

  
let gameState = ["", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", ""];
				
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

let boardEnable = [true,true,true,true,true,true,true,true,true];

let currentPlayer = "X";

const winningMessage = () => `Player ${currentPlayer} has won!\nClick \"Start or Restart\" to play again!`;
const drawMessage = () => `Game ended in a draw!\nClick \"Start or Restart\" to play again!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const startMessage = () => `Click \"Start Game\" to begin!`;
statusDisplay.innerHTML = startMessage();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
	//document.getElementById(clickedCellIndex.toString()).style.backgroundColor = "red"
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

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

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--start').addEventListener('click', handleStartGame);
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);