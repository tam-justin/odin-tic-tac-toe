const game = (function gameController(){
    let board = new Array(9);
    let marker = "X";
    let started = false;

    const addTileListeners = () => {
        const tileArr = display.boardElement.children;

        for(let i = 0; i < tileArr.length; i++){
            tileArr[i].addEventListener("click", updateMarker, {once: true});
            console.log(`Tile ${i+1} Listener Added`);
        }
    }

    const changeMarker = () => {
        if(marker == "X"){
            
        }else if(marker == "O"){

        }
        marker = (marker == "X" ? "O" : "X");
    }

    const updateMarker = (event) => {
        const tile = event.target;
        let tileID = tile.id;
        console.log(`Updating Marker for ${tile.id}`);
        const tileNum = tileID.split("-")[1];
        board[tileNum - 1] = marker;
        changeMarker();
        display.updateBoard();
        checkForWin();
    }

    const start = () => {
        started = true;
        addTileListeners();
    }

    const restart = () => {

    }

    const endGame = () => {

    }

    const checkForWin = () => {

    }

    return {
        board,
        started,
        start,
        restart,
        addTileListeners,
        updateMarker,
    }

})();

const display = (function displayController(){
    const boardElement = document.querySelector(".board");

    const updateBoard = () => {
        console.log("Updating board!");
        const tileArr = boardElement.children;
        
        for(let i = 0; i < tileArr.length; i++){
            tileArr[i].innerHTML = "";
            if(game.board[i] === "X"){
                const x = document.createElement("div");
                x.classList.add("x");
                x.innerHTML = "&#x2717";
                tileArr[i].appendChild(x);
            }else if(game.board[i] === "O"){
                const circle = document.createElement("div");
                circle.classList.add("circle");
                tileArr[i].appendChild(circle);
            }
        }
    }

    const setupListeners = () => {
        console.log("Setting up page!");

        // Start Button
        const startButton = document.querySelector("#start-button");
        startButton.addEventListener("click", () => {
            if(game.started == true){
                display.setErrorMessage("Game Already Started!");
                return;
            }
            game.start();
            game.started = true;
        });

        const restartButton = document.querySelector("#restart-button");
        restartButton.addEventListener("click", () => {
            if(game.started != true){
                display.setErrorMessage("Game has not started. Cannot restart!");
                return;
            }
            game.restart();
            game.started = false;
        })

        const questionButton = document.querySelector(".question-mark");
        const howToText = document.querySelector(".how-to");
        questionButton.addEventListener("mouseenter", () => {
            howToText.classList.remove("hidden");
        })

        questionButton.addEventListener("mouseleave", () => {
            howToText.classList.add("hidden");
        })
    }

    const setErrorMessage = (message) => {
        const elem = document.querySelector(".error-message");
        elem.innerHTML = message;
    }

    return {
        boardElement,
        setupListeners,
        updateBoard,
    }
})();

function createPlayer(name, marker){
    return {name, marker};
}

game.addTileListeners();
display.updateBoard();
display.setupListeners();