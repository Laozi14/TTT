// Single file with all modules

// Gameboard Module
const Gameboard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => board;
    const setSquare = (index, marker) => {
        if (!board[index]) board[index] = marker;
    };
    const resetBoard = () => {
        board = Array(9).fill(null);
    };

    return { getBoard, setSquare, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let isGameOver = false;

    const initializeGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name, "X"),
            Player(player2Name, "O"),
        ];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.resetBoard();
        DisplayController.updateBoard();
        DisplayController.updateStatus(`${players[0].name}'s turn`);
    };

    const playTurn = (index) => {
        if (isGameOver || Gameboard.getBoard()[index]) return;

        Gameboard.setSquare(index, players[currentPlayerIndex].marker);
        if (checkWinner()) {
            isGameOver = true;
            highlightWinner(checkWinner());
            DisplayController.updateStatus(`${players[currentPlayerIndex].name} wins!`);
            return;
        }

        if (Gameboard.getBoard().every((square) => square !== null)) {
            isGameOver = true;
            DisplayController.updateStatus("It's a tie!");
            return;
        }

        currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.updateBoard();
        DisplayController.updateStatus(`${players[currentPlayerIndex].name}'s turn`);
    };

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const board = Gameboard.getBoard();
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return combination;
            }
        }
        return null;
    };

    const highlightWinner = (winningCombination) => {
        winningCombination.forEach((index) => {
            document.querySelectorAll(".square")[index].classList.add("highlight");
        });
    };

    return { initializeGame, playTurn };
})();

// Display Controller Module
const DisplayController = (() => {
    const boardElement = document.getElementById("gameboard");
    const statusElement = document.getElementById("game-status");
    const restartButton = document.getElementById("restart-btn");

    const updateBoard = () => {
        boardElement.innerHTML = ""; // Clear existing board
        Gameboard.getBoard().forEach((square, index) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square");
            squareElement.textContent = square;
            squareElement.addEventListener("click", () => GameController.playTurn(index));
            boardElement.appendChild(squareElement);
        });
    };

    const updateStatus = (message) => {
        statusElement.textContent = message;
    };

    restartButton.addEventListener("click", () => {
        const player1 = prompt("Enter Player 1 Name:") || "Player 1";
        const player2 = prompt("Enter Player 2 Name:") || "Player 2";
        GameController.initializeGame(player1, player2);
    });

    return { updateBoard, updateStatus };
})();

// Initialize the Game
document.addEventListener("DOMContentLoaded", () => {
    const player1 = prompt("Enter Player 1 Name:") || "Player 1";
    const player2 = prompt("Enter Player 2 Name:") || "Player 2";
    GameController.initializeGame(player1, player2);
});
