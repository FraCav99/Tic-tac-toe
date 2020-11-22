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

    // const AiMove = () => {
    //     let randomPick = Math.floor(Math.random() * 3);
    // }

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


export default model;