const model = (() => {
    const gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    let gameActive = false;

    const setGameBoard = (parentIndex, childIndex, value) => {
        gameBoard[parentIndex][childIndex] = value;
    };

    const checkMatch = arr => {
        if (arr.every(el => el !== "")) {
            if (arr.every(el => el === arr[0])) return true;
            else return false;
        }
    }
    
    const checkRows = () => {
        let win = false;

        for (let row of gameBoard) {
            if (checkMatch(row)) {
                win = true;
                break;
            }
        }

        return win;
    }


    const checkCols = () => {
        // temporary store column like "row" array
        let col = [];
        let win = false;

        for (let i = 0; i < gameBoard.length; i++) {
            // take only the value corresponding to index value for every row
            col = gameBoard.map(val => val[i]);
            
            if (checkMatch(col)) {
                win = true;
                break;
            } else {
                col = [];
            }
        }

        return win;
    }


    const checkDiags = () => {
        let win = false;

        const leftDiag = () => {
            let diag = [];

            // left diags (starting from first row)
            for (let i = 0; i < gameBoard.length; i++) {
                diag.push(gameBoard[i][i]);
            }

            if (checkMatch(diag)) {
                return true;
            }
            else {
                col = [];
                return;
            }
        }

        const rightDiag = () => {
            let diag = [];

            // right diags (starting from first row)
            for (let i = 0; i < gameBoard.length; i++) {
                diag.push(gameBoard[i][gameBoard.length - (i + 1)]);
            }

            if (checkMatch(diag)) {
                return true;
            }
            else {
                col = [];
                return;
            }
        }

        if (leftDiag() || rightDiag()) win = true;

        return win;
    }


    const resetGameBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = "";
            }
        }
    }


    const checkTie = () => {
        let tie = 0;

        for (let row of gameBoard) {
            if (row.every(el => el !== "")) tie++;
            else break;
        }

        if (tie === 3) {
            alert("Tie");
            resetGameBoard();
            return true;
        } else return;
    }


    const checkWin = () => {
        if (
            checkRows() || 
            checkCols() ||
            checkDiags()
            ) {
            alert('win!');
            resetGameBoard();
            return true;
        }
    }


    // Create players
    const Player = (name, mark) => {
        const getName = () => name;
        const getMark = () => mark;
        let turn = false;

        return { getName, getMark, turn }
    }

    return {
        gameBoard,
        gameActive,
        setGameBoard,
        checkWin,
        checkTie,
        Player
    };
})();


const view = (() => {
    const DOM = {
        gridContainer: document.getElementById('board__container'),
        startPlayBtn: document.getElementById('start__play'),
        playerOneInput: document.getElementById('player__one'),
        playerTwoInput: document.getElementById('player__two')
    };

    const displayBoard = board => {
        for (let row of board) {
            let currentRow = document.createElement('div');
            currentRow.classList.add('board__row');
            DOM.gridContainer.appendChild(currentRow);

            for (let i = 0; i < row.length; i++) {
                let newSquare = document.createElement('div');
                newSquare.classList.add('square');
                currentRow.appendChild(newSquare);
            }
        }
    };


    const updateBoard = (element, sign) => {
        element.textContent === "" ? element.textContent = sign : null;
    }

    const resetBoard = () => {
        for (let row of DOM.gridContainer.children) {
            for (let i = 0; i < row.children.length; i++) {
                row.children[i].textContent = "";
            }
        }
    }

    return {
        DOM,
        displayBoard,
        updateBoard,
        resetBoard
    }
})();


const controller = (() => {
    const board = view.DOM.gridContainer;
    const startPlayBtn = view.DOM.startPlayBtn;
    let playerOne, playerTwo;

    startPlayBtn.addEventListener('click', () => {
        playerOne = model.Player(view.DOM.playerOneInput.value, 'X');
        playerOne.turn = true;  // player one always start first

        playerTwo = model.Player(view.DOM.playerTwoInput.value, 'O');
        model.gameActive = true;
    });


    board.addEventListener('click', e => {
        if (model.gameActive) {
            let el = e.target;
        
            if (playerOne.turn) {
                console.log(`it's ${playerOne.getName()} turn!`);
                if (el.textContent === "") {
                    view.updateBoard(el, playerOne.getMark());
                    playerOne.turn = false;
                    playerTwo.turn = true;
                }
            } else if (playerTwo.turn) {
                console.log(`it's ${playerTwo.getName()} turn!`);
                if (el.textContent === "") {
                    view.updateBoard(el, playerTwo.getMark());
                    playerOne.turn = true;
                    playerTwo.turn = false;
                }
            }
    
            // take parent index (row)
            let parentElement = el.parentElement;
            let parentIndex = Array.from(parentElement.parentNode.children).indexOf(parentElement);
    
            // take child's index (square)
            let childIndex = Array.from(el.parentNode.children).indexOf(el);
            
            model.setGameBoard(parentIndex, childIndex, el.textContent);
            
            if (model.checkWin() || model.checkTie()) {
                view.resetBoard();
                model.gameActive = false;
            }
        }
    });

    const init = () => {
        view.displayBoard(model.gameBoard);
    }

    return { init };
})(model, view);

controller.init();