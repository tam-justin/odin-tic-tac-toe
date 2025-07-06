const game = (function gameController(){
    let board = new Array(9);
    let marker = "";
    let started = false;
    let winner;
    let player1Ready = false;
    let player2Ready = false;

    let player1;
    let player2;

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
        game.board[tileNum - 1] = marker;
        changeMarker();
        display.updateBoard();
        if(checkForWin()){
            console.log("Game over!");
            endGame();
        }
        if(checkForTie()){
            console.log("Game over. Tied");
            endGame();
        };
    }

    const start = () => {
        //Flag that the game has begun, set up the event listeners.
        started = true;
        marker = (Math.random() < 0.5 ? "X" : "O");
        addTileListeners();

        // Disable the user name inputs.
        const player1Input = document.querySelector(".player1-input .nameInput");
        const player1_done = document.querySelector(".player1-input .add-name");
        player1Input.classList.add("hidden");
        player1_done.classList.add("hidden");

        const player2Input = document.querySelector(".player2-input .nameInput");
        const player2_done = document.querySelector(".player2-input .add-name");
        player2Input.classList.add("hidden");
        player2_done.classList.add("hidden");

        //Set the names of the users.
        game.player1 = createPlayer((player1Input.value == "" ? "Player 1" : player1Input.value), "O");
        game.player2 = createPlayer((player2Input.value == "" ? "Player 2" : player2Input.value), "X");
        display.changeNames(game.player1.name, game.player2.name);
    }

    const removeTileListeners = () => {
        tileArr = display.boardElement.children;
        for(let i = 0; i < tileArr.length; i++){
            tileArr[i].removeEventListener("click", updateMarker);
        }
    }

    const restart = () => {
        game.started = false;
        game.board = new Array(9);
        display.updateBoard();
        display.reset();
        game.player1Ready = false;
        game.player2Ready = false;
        game.player1 = undefined;
        game.player2 = undefined;
        game.winner = undefined;
    }

    const endGame = () => {
        display.showResults();
        removeTileListeners();
    }

    const checkForTie = () => {
        let flag = true;
        for(let i = 0; i < game.board.length; i++){
            if(game.board[i] === undefined){
                flag = false;
            }
        }
        return flag;
    }

    const checkForWin = () => {
        //Check Rows
        for(let i = 0; i < 3; i++){
            let row = [];

            //If the first slot is empty, skip the row.
            if(game.board[i*3] === undefined){
                continue;
            }
            
            for(let j = 0; j < 3; j++){
                let elem = game.board[i*3+j];
                if(elem === undefined){
                    continue;
                }
                row.push(elem);
            }

            const rowWin = row.every(elem => elem === row[0]);
            if(rowWin == true && row.length == 3){
                game.winner = row[0];
                return true;
            }
        }

        // Check Column
        for(let i = 0; i < 3; i++){
            let col = [];

            // If the first slot is empty, skip the col.
            if(game.board[i] === undefined){
                continue;
            }

            for(let j = 0; j < 3; j++){
                let elem = game.board[j*3+i];
                if(elem === undefined){
                    continue;
                }
                col.push(elem);
            }

            const colWin = col.every(elem => elem === col[0]);
            if(colWin == true && col.length == 3){
                game.winner = col[0];
                return true;
            }
        }

        // Check diag
        let diag1 = [];
        for(let i = 0; i < 3; i++){
            let elem = game.board[i * (3 + 1)];

            if(elem === undefined){
                continue;
            }
            diag1.push(elem);
        }
        const diag1Win = diag1.every(elem => elem === diag1[0]);
        
        if(diag1Win && diag1.length == 3){
            game.winner = diag1[0];
            return true;
        }

        let diag2 = [];
        for(let i = 0; i < 3; i++){
            let elem = game.board[(i+1) * (3-1)];

            if(elem === undefined){
                continue;
            }
            diag2.push(elem);
        }
        
        const diag2Win = diag2.every(elem => elem === diag2[0]);
        if(diag2Win && diag2.length == 3){
            game.winner = diag2[0];
            return true;
        }

        return false;
    }

    return {
        board,
        started,
        player1,
        player2,
        player1Ready,
        player2Ready,
        winner,
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
                setErrorMessage("Game Already Started!");
                return;
            }
            game.start();
            game.started = true;
        });

        // Restart Button
        const restartButton = document.querySelector("#restart-button");
        restartButton.addEventListener("click", () => {
            if(game.started != true){
                setErrorMessage("Game has not started. Cannot restart!");
                return;
            }
            game.restart();
            game.started = false;
        })

        // FAQ Section
        const questionButton = document.querySelector(".question-mark");
        const howToText = document.querySelector(".how-to");
        questionButton.addEventListener("mouseenter", () => {
            howToText.classList.remove("hidden");
        })
        questionButton.addEventListener("mouseleave", () => {
            howToText.classList.add("hidden");
        })

        // Name Buttons
        const player1_done = document.querySelector(".player1-input .add-name");
        player1_done.addEventListener("click", () => {
            const player1Input = document.querySelector(".player1-input .nameInput");
            if(game.player1Ready == false){
                player1Input.disabled = true;
                player1Input.style.backgroundColor = "rgba(200, 200, 200, 0.7)";
                game.player1Ready = true;
                player1_done.innerHTML = "Edit";
            }else{
                player1Input.disabled = false;
                player1Input.style.backgroundColor = "white";
                game.player1Ready = false;
                player1_done.innerHTML = "Done";
            }
        })

        const player2_done = document.querySelector(".player2-input .add-name");
        player2_done.addEventListener("click", () => {
            const player2Input = document.querySelector(".player2-input .nameInput");
            if(game.player2Ready == false){
                player2Input.disabled = true;
                player2Input.style.backgroundColor = "rgba(200, 200, 200, 0.7)";
                game.player2Ready = true;
                player2_done.innerHTML = "Edit";
            }else{
                player2Input.disabled = false;
                player2Input.style.backgroundColor = "white";
                game.player2Ready = false;
                player2_done.innerHTML = "Done";
            }
        })
    }

    const setErrorMessage = (message) => {
        const elem = document.querySelector(".right-side .error-message");
        elem.innerHTML = message;

        setTimeout(() => {
            elem.innerHTML = "";
        }, 2000);
    }

    const reset = () => {
        const player1Input = document.querySelector(".player1-input .nameInput");
        const player1_done = document.querySelector(".player1-input .add-name");
        player1Input.classList.remove("hidden");
        player1_done.classList.remove("hidden");
        player1Input.disabled = false;
        player1Input.value = "";
        player1Input.style.backgroundColor = "white";
        player1_done.innerHTML = "Done";

        const player2Input = document.querySelector(".player2-input .nameInput");
        const player2_done = document.querySelector(".player2-input .add-name");
        player2Input.classList.remove("hidden");
        player2_done.classList.remove("hidden");
        player2Input.disabled = false;
        player2Input.value = "";
        player2_done.innerHTML = "Done";
        player2Input.style.backgroundColor = "white";

        changeNames("Enter Player 1's Name", "Enter Player 2's Name");
    }

    const changeNames = (p1, p2) => {
        const player1Name = document.querySelector(".player1-section .nameQ");
        player1Name.innerHTML = p1;

        const player2Name = document.querySelector(".player2-section .nameQ");
        player2Name.innerHTML = p2;
    }

    const showResults = () => {
        const modal = document.querySelector(".results");
        const backdrop = document.querySelector(".modal-backdrop");
        const winnerText = document.querySelector(".winner");
        const congrats = document.querySelector(".congrats");
        const subtext = document.querySelector(".results .text");

        if(game.winner === undefined){
            congrats.innerHTML = "It was a tie!";
            winnerText.innerHTML = "Nobody won!"
            subtext.innerHTML = "There were no tiles left!"
            backdrop.style.visibility = "visible";
            modal.showModal();
        }else{
            congrats.innerHTML = "Congratulations!"
            winnerText.innerHTML = (game.winner == "O" ? game.player1.name : game.player2.name);
            subtext.innerHTML = "has won the game!"
            backdrop.style.visibility = "visible";
            modal.showModal();
        }

        const closeButton = document.querySelector(".results .close-button");
        closeButton.addEventListener("click", () => {
            modal.close();
            backdrop.style.visibility = "hidden";
        })
    }

    return {
        boardElement,
        reset,
        showResults,
        setupListeners,
        updateBoard,
        changeNames,
    }
})();

function createPlayer(name, marker){
    return {name, marker};
}

display.updateBoard();
display.setupListeners();