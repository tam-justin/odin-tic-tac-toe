const game = (function gameController(){
    const board = new Array(9);

    const updateMarker = (event) => {
        const tile = event.target;
    }

    return {
        board,
    }
})();

const display = (function displayController(){
    const boardElement = document.querySelector(".board");

    const showBoard = () => {
        updateBoard();
    }

    const updateBoard = () => {
        boardElement.innerHTML = "";
        
        for(let i = 0; i < game.board.length; i++){
            const div = document.createElement("div");
            div.classList.add(".tile");
            div.innerHTML = game.board[i];
            div.id = `tile-${i+1}`;

            div.addEventListener("click", game.updateMarker);

            boardElement.appendChild(div);
        }
    }
})();

function createPlayer(name, marker){
    return {name, marker};
}

display.updateBoard();