const view = (() => {
    const _DOM = {
        gridContainer: document.getElementById('board__container'),
        startPlayBtn: document.getElementById('start__play'),
        playerOneInput: document.getElementById('player__one'),
        playerTwoInput: document.getElementById('player__two'),
        inputDiv: document.getElementById('players__name'),
        mainTitle: document.getElementById('title'),
        labelsContainer: document.querySelector('.labels__container'),
        playerOneLabel: document.getElementById('player__one__name'),
        playerTwoLabel: document.getElementById('player__two__name')
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
        element.textContent = sign;
    }

    const _resetBoard = () => {
        for (let row of _DOM.gridContainer.children) {
            for (let i = 0; i < row.children.length; i++) {
                row.children[i].textContent = "";
            }
        }

        _DOM.playerOneInput.value = "";
        _DOM.playerTwoInput.value = "";
    }

    const _hideElement = el => {
        el.style.display = 'none';
    }

    const _showElement = (el, displayMode) =>  {
        el.style.display = displayMode;
    }


    const _updateMainTitle = text => {
        _DOM.mainTitle.textContent = text;
    }

    const _applyTextHighlightEffect = el => {
        el.classList.add('highlight_name');
    }

    const _removeTextHighlightEffect = el => {
        el.classList.remove('highlight_name');
    }

    return {
        _DOM,
        _displayBoard,
        _updateBoard,
        _resetBoard,
        _hideElement,
        _showElement,
        _updateMainTitle,
        _applyTextHighlightEffect,
        _removeTextHighlightEffect
    }
})();

export default view;