const model = (() => {
    const gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const setGameBoard = (parentIndex, childIndex, value) => {
        gameBoard[parentIndex][childIndex] = value;
    };

    const checkRow = row => {
        if (row.every(el => el !== "")) {
            if (row.every(el => el === row[0])) return true;
            else return false;
        }
    }
    
    const checkRows = () => {
        let win = false;

        for (let row of gameBoard) {
            if (checkRow(row)) {
                win = true;
                break;
            }
        }

        return win;
    }


    const resetGameBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = "";
            }
        }
    }


    const checkWin = () => {
        if (checkRows()) {
            alert('win!');
            resetGameBoard();
            return true;
        } else return;
    }

    return {
        gameBoard,
        setGameBoard,
        checkWin,
    };
})();


const view = (() => {
    const gridContainer = document.getElementById('board__container');

    const displayBoard = board => {
        for (let row of board) {
            let currentRow = document.createElement('div');
            currentRow.classList.add('board__row');
            gridContainer.appendChild(currentRow);

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
        for (let row of gridContainer.children) {
            for (let i = 0; i < row.children.length; i++) {
                row.children[i].textContent = "";
            }
        }
    }

    return {
        gridContainer,
        displayBoard,
        updateBoard,
        resetBoard
    }
})();


const controller = (() => {
    const board = view.gridContainer;

    board.addEventListener('click', e => {
        let el = e.target;
        view.updateBoard(el, 'X');

        // take parent index (row)
        let parentElement = el.parentElement;
        let parentIndex = Array.from(parentElement.parentNode.children).indexOf(parentElement);

        // take child's index (square)
        let childIndex = Array.from(el.parentNode.children).indexOf(el);
        
        model.setGameBoard(parentIndex, childIndex, el.textContent);
        
        if (model.checkWin()) {
            view.resetBoard();
        }
    });

    const init = () => {
        view.displayBoard(model.gameBoard);
    }

    return { init };
})(model, view);

controller.init();