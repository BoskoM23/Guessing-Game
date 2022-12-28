"use strict";
function initGame() {
    const technologies = ["html", "css", "js", "node"];
    let combo = [
        Math.trunc(Math.random() * 4),
        Math.trunc(Math.random() * 4),
        Math.trunc(Math.random() * 4),
        Math.trunc(Math.random() * 4),
    ];
    const guessCells = Array.from(document.querySelectorAll(".guess"));
    const guesses = Array(combo.length);
    const checkCells = Array.from(document.querySelectorAll(".check"));
    const questionMarks = Array.from(
        document.querySelectorAll(".questionMark")
    );
    const scoreElement = document.querySelector(".score");
    const failsElement = document.querySelector(".fails");
    let currentCell = 0;
    let currentRow = 0;
    let fails = 0;
    let gameActive = true;
    function makeMove(index) {
        if (currentCell < combo.length * (currentRow + 1)) {
            guessCells[currentCell].classList.add(technologies[index]);
            guesses[currentCell % 4] = index;
            currentCell++;
        } else {
            console.log(guesses);
        }
    }
    function checkCombo() {
        if (gameActive && currentCell === (currentRow + 1) * 4) {
            const comboCopy = combo.slice();
            let reds = 0;
            let greens = 0;

            console.log(comboCopy);
            guesses.forEach((guess, index) => {
                if (guess === comboCopy[index]) {
                    greens++;
                    guesses[index] = -2;
                    comboCopy[index] = -1;
                }
            });
            console.log(comboCopy);
            guesses.forEach((guess, index) => {
                if (comboCopy.includes(guess)) {
                    reds++;
                    guesses[index] = -2;
                    comboCopy[comboCopy.indexOf(guess)] = -1;
                }
            });
            showGuesses(greens, reds);
            if (greens === 4 || currentRow === 4) {
                gameOver(greens === 4);
            } else {
                currentRow++;
                showNextRow();
            }
        }
    }
    function gameOver(win) {
        buttons.forEach((button) => {
            button.classList.add("hidden");
            score += 10;
            document.querySelector(".score").textContent = score;
        });
        questionMarks.forEach((qm, index) => {
            qm.classList.remove("questionMark");
            qm.classList.add(technologies[combo[index]]);
        });
        gameActive = false;
        if (win) {
            if (currentRow === 0) {
                scoreElement.textContent = 30;
            } else if (currentRow === 1) {
                scoreElement.textContent = 20;
            } else if (currentRow === 2) {
                scoreElement.textContent = 15;
            } else if (currentRow === 3) {
                scoreElement.textContent = 10;
            } else if (currentRow === 4) {
                scoreElement.textContent = 5;
            }
        } else {
            fails += 1;
            failsElement.textContent = fails;
        }
    }
    function showGuesses(greens, reds) {
        let checkCellIndex = currentRow * 4;
        while (greens > 0) {
            checkCells[checkCellIndex].classList.remove("hidden");
            checkCells[checkCellIndex].style.backgroundColor = "green";
            checkCellIndex++;
            greens--;
        }
        while (reds > 0) {
            checkCells[checkCellIndex].classList.remove("hidden");
            checkCells[checkCellIndex].style.backgroundColor = "red";
            checkCellIndex++;
            reds--;
        }
        while (checkCellIndex < 4 * (currentRow + 1)) {
            checkCells[checkCellIndex].classList.remove("hidden");
            checkCellIndex++;
        }
    }
    function showNextRow() {
        for (
            let cellIndex = currentRow * 4;
            cellIndex < 4 * (currentRow + 1);
            cellIndex++
        ) {
            guessCells[cellIndex].classList.remove("hidden");
        }
    }
    function undoMove() {
        if (currentCell > combo.length * currentRow && gameActive) {
            technologies.forEach((tech) => {
                guessCells[currentCell - 1].classList.remove(tech);
            });
            currentCell--;

        }
    }
    function startingConditions() {
        //reset guess cells
        guessCells.forEach((guessCell, index) => {
            technologies.forEach((tech) => {
                guessCell.classList.remove(tech);
            });
            if (index > 3) {
                guessCell.classList.add("hidden");
            }
        });
        //reset check cells
        checkCells.forEach((checkCell) => {
            checkCell.classList.add("hidden");
            checkCell.style.backgroundColor = "white";
        });
        //reset question marks
        questionMarks.forEach((qm) => {
            technologies.forEach((tech) => {
                qm.classList.remove(tech);
            });
            qm.classList.add("questionMark");
        });
        //reset buttons
        buttons.forEach((button) => {
            button.classList.remove("hidden");
        });
        scoreElement.textContent = 0;
        currentCell = 0;
        currentRow = 0;
        gameActive = true;
        combo = [
            Math.trunc(Math.random() * 4),
            Math.trunc(Math.random() * 4),
            Math.trunc(Math.random() * 4),
            Math.trunc(Math.random() * 4),
        ];
        console.log(
            combo,
            currentRow,
            currentCell,
            gameActive,
            guessCells,
            checkCells
        );
    }
    //revieling module design data pattern
    return {
        makeMove: makeMove,
        checkCombo: checkCombo,
        undoMove: undoMove,
        startingConditions: startingConditions,
    };
}
const game = initGame();
const buttons = Array.from(document.querySelectorAll(".btn"));
buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
        game.makeMove(index);
    });
});
document.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        game.checkCombo();
    }
    if (event.key == "u") {
        game.undoMove();
    }
    if (event.key == "r") {
        game.startingConditions();
    }
});
