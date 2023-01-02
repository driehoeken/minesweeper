import { getRandomInt } from "./misc.js";
const board = document.querySelector("#board");

const generateBombsData = (height, width, bombsNum) => {
    const bombs = [];
    const bombsHelper = [];
    let leftBombs = bombsNum;
    while (leftBombs > 0) {
        const bombPos = {
            x: getRandomInt(width),
            y: getRandomInt(height),
        };
        const bombHelp = `${bombPos.x}, ${bombPos.y}`;
        if (!bombsHelper.includes(bombHelp)) {
            bombs.push(bombPos);
            bombsHelper.push(bombHelp);
            leftBombs -= 1;
        }
    }
    return bombs;
};
const renderTiles = (height, width) => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
            console.log(i, j);
        }
    }
};
renderTiles(9, 9);
