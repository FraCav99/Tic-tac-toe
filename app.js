const model = (() => {
    const _gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    let _gameActive = false;

    const _setGameBoard = (parentIndex, childIndex, value) => {
        _gameBoard[parentIndex][childIndex] = value;
    };

    const checkMatch = arr => {
        if (arr.every(el => el !== "")) {
            if (arr.every(el => el === arr[0])) return true;
            else return false;
        }
    }
    
    const checkRows = () => {
        let win = false;
        let winningRow;

        for (let row of _gameBoard) {
            if (checkMatch(row)) {
                win = true;
                winningRow = row;
                break;
            }
        }

        return {win, winningRow};
    }


    const checkCols = () => {
        // temporary store column like "row" array
        let col = [];
        let win = false;

        for (let i = 0; i < _gameBoard.length; i++) {
            // take only the value corresponding to index value for every row
            col = _gameBoard.map(val => val[i]);
            
            if (checkMatch(col)) {
                win = true;
                break;
            } else {
                col = [];
            }
        }

        return {win, col};
    }


    const checkDiags = () => {
        let win = false;
        let winningDiag;

        const leftDiag = () => {
            let diag = [];
            let isLeft = false;

            // left diags (starting from first row)
            for (let i = 0; i < _gameBoard.length; i++) {
                diag.push(_gameBoard[i][i]);
            }

            if (checkMatch(diag)) {
                isLeft = true;
            }
            else {
                diag = [];
            }

            return {isLeft, diag};
        }

        const rightDiag = () => {
            let diag = [];
            let isRight = false;

            // right diags (starting from first row)
            for (let i = 0; i < _gameBoard.length; i++) {
                diag.push(_gameBoard[i][_gameBoard.length - (i + 1)]);
            }

            if (checkMatch(diag)) {
                isRight = true;
            }
            else {
                diag = [];
            }

            return {isRight, diag};
        }

        const rightDiagonal = rightDiag();
        const leftDiagonal = leftDiag();

        if (rightDiagonal.isRight) {
            win = true;
            winningDiag = rightDiagonal.diag;
        } else if (leftDiagonal.isLeft) {
            win = true;
            winningDiag = leftDiagonal.diag;
        }

        return {win, winningDiag};
    }


    const _resetGameBoard = () => {
        for (let i = 0; i < _gameBoard.length; i++) {
            for (let j = 0; j < _gameBoard[i].length; j++) {
                _gameBoard[i][j] = "";
            }
        }
    }


    const _checkTie = () => {
        let tie = 0;
        let isTie = false;

        for (let row of _gameBoard) {
            if (row.every(el => el !== "")) tie++;
            else break;
        }

        if (tie === 3) isTie = true;

        return isTie;
    }


    const _checkWin = () => {
        let win = false;
        let winningArr;

        const checkRow = checkRows();
        const checkCol = checkCols();
        const checkDiag = checkDiags();

        if (checkRow.win) {
            win = true;
            winningArr = checkRow.winningRow;
        } else if (checkCol.win) {
            win = true;
            winningArr = checkCol.col;
        } else if (checkDiag.win) {
            win = true;
            winningArr = checkDiag.winningDiag;
        }

        return {win, winningArr};
    }


    // Create players
    const _Player = (name, mark) => {
        const getName = () => name;
        const getMark = () => mark;
        let turn = false;

        return { getName, getMark, turn }
    }

    return {
        _gameBoard,
        _gameActive,
        _setGameBoard,
        _checkWin,
        _checkTie,
        _resetGameBoard,
        _Player
    };
})();


const view = (() => {
    const _DOM = {
        gridContainer: document.getElementById('board__container'),
        startPlayBtn: document.getElementById('start__play'),
        playerOneInput: document.getElementById('player__one'),
        playerTwoInput: document.getElementById('player__two')
    };

    const _displayBoard = board => {
        for (let row of board) {
            let currentRow = document.createElement('div');
            currentRow.classList.add('board__row');
            _DOM.gridContainer.appendChild(currentRow);

            for (let i = 0; i < row.length; i++) {
                let newSquare = document.createElement('div');
                newSquare.classList.add('square');
                currentRow.appendChild(newSquare);
            }
        }
    };


    const _updateBoard = (element, sign) => {
        element.textContent === "" ? element.textContent = sign : null;
    }

    const _resetBoard = () => {
        for (let row of _DOM.gridContainer.children) {
            for (let i = 0; i < row.children.length; i++) {
                row.children[i].textContent = "";
            }
        }
    }

    return {
        _DOM,
        _displayBoard,
        _updateBoard,
        _resetBoard
    }
})();


const controller = (() => {
    const board = view._DOM.gridContainer;
    const startPlayBtn = view._DOM.startPlayBtn;
    let playerOne, playerTwo;

    startPlayBtn.addEventListener('click', () => {
        playerOne = model._Player(view._DOM.playerOneInput.value, 'X');
        playerOne.turn = true;  // player one always start first

        playerTwo = model._Player(view._DOM.playerTwoInput.value, 'O');
        model._gameActive = true;
    });


    board.addEventListener('click', e => {
        if (model._gameActive) {
            let el = e.target;
        
            if (playerOne.turn) {
                if (el.textContent === "") {
                    view._updateBoard(el, playerOne.getMark());
                    playerOne.turn = false;
                    playerTwo.turn = true;
                }
            } else if (playerTwo.turn) {
                if (el.textContent === "") {
                    view._updateBoard(el, playerTwo.getMark());
                    playerOne.turn = true;
                    playerTwo.turn = false;
                }
            }
    
            // take parent index (row)
            let parentElement = el.parentElement;
            let parentIndex = Array.from(parentElement.parentNode.children).indexOf(parentElement);
    
            // take child's index (square)
            let childIndex = Array.from(el.parentNode.children).indexOf(el);
            
            model._setGameBoard(parentIndex, childIndex, el.textContent);

            const checkWin = model._checkWin();
            const checkTie = model._checkTie();
            
            if (checkWin.win) {
                if (checkWin.winningArr.includes(playerOne.getMark())) console.log(`${playerOne.getName()} win`);
                if (checkWin.winningArr.includes(playerTwo.getMark())) console.log(`${playerTwo.getName()} win`);
                view._resetBoard();
                model._resetGameBoard();
                model._gameActive = false;
            } else if (checkTie) {
                console.log('Tie');
                view._resetBoard();
                model._resetGameBoard();
                model._gameActive = false;
            }
        }
    });

    const init = () => {
        view._displayBoard(model._gameBoard);
    }

    return { init };
})(model, view);

controller.init();