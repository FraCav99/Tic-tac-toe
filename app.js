import model from './model.js';
import view from './view.js';

const controller = (() => {
    const board = view._DOM.gridContainer;
    const startPlayBtn = view._DOM.startPlayBtn;
    const labelContainer = view._DOM.labelsContainer;
    const playerOneLabel = view._DOM.playerOneLabel;
    const playerTwoLabel = view._DOM.playerTwoLabel;
    let playerOne, playerTwo;

    const resetGame = () => {
        view._resetBoard();
        model._resetGameBoard();
        model._gameActive = false;
        view._showElement(view._DOM.inputDiv, 'flex');
        view._hideElement(board);
        view._hideElement(labelContainer);
        view._hideElement(view._DOM.modalBox);
    }

    startPlayBtn.addEventListener('click', () => {
        playerOne = model._Player(view._DOM.playerOneInput.value, 'X');
        playerOne.turn = true;  // player one always start first

        playerTwo = model._Player(view._DOM.playerTwoInput.value, 'O');
        
        if (playerOne.getName() && playerTwo.getName()) {
            // Set names for labels and main title
            playerOneLabel.textContent = playerOne.getName();
            playerTwoLabel.textContent = playerTwo.getName();


            model._gameActive = true;
            view._hideElement(view._DOM.inputDiv);
            view._applyTextHighlightEffect(playerOneLabel);
            view._showElement(board, 'block');
            view._showElement(labelContainer, 'flex');
        }
    });


    board.addEventListener('click', e => {
        if (model._gameActive) {
            let el = e.target;
        
            if (playerOne.turn) {
                view._applyTextHighlightEffect(playerOneLabel);
                view._removeTextHighlightEffect(playerTwoLabel);

                if (el.textContent === "") {
                    view._updateBoard(el, playerOne.getMark());
                    playerOne.turn = false;
                    playerTwo.turn = true;
                }
            } else if (playerTwo.turn) {
                view._applyTextHighlightEffect(playerTwoLabel);
                view._removeTextHighlightEffect(playerOneLabel);
                
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
                view._showElement(view._DOM.modalBox, 'block');

                // Change title inside modal according to winner's name (or tie)
                if (checkWin.winningArr.includes(playerOne.getMark())) {
                    view._DOM.modalBoxWinnerTitle.textContent = `${playerOne.getName()} win`;
                }
                if (checkWin.winningArr.includes(playerTwo.getMark())) {
                    view._DOM.modalBoxWinnerTitle.textContent = `${playerTwo.getName()} win`;
                }
            } else if (checkTie) {
                view._showElement(view._DOM.modalBox, 'block');
                view._DOM.modalBoxWinnerTitle.textContent = 'Tie!';
            }
        }
    });

    // Reset the game after win
    view._DOM.modalBoxResetBtn.addEventListener('click', () => {
        resetGame();
    });

    const init = () => {
        view._displayBoard(model._gameBoard);
    }

    return { init };
})(model, view);

controller.init();