import { getRandomInt, getTile } from "./misc.js";
const board = document.querySelector("#board");
//we can add new variable tileNumbersArray just to check if tile is number
//we also have to add emptyCords for better check of empty to reveal other empty lol
let bombCords = [];
let tileNumbers = {};
let tileNumbersArray = [];
const generateBombsCords = (height, width, bombsNum) => {
    const bombsCords = [];
    let leftBombs = bombsNum;
    while (leftBombs > 0) {
        const bombHelp = `${getRandomInt(width)} ${getRandomInt(height)}`;
        if (!bombsCords.includes(bombHelp)) {
            bombsCords.push(bombHelp);
            leftBombs -= 1;
        }
    }
    return bombsCords;
};
const renderTiles = (height, width) => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("data-x", j);
            tile.setAttribute("data-y", i);
            tile.addEventListener("click", (e) => {
                handleTileClick(e);
            });
            board.appendChild(tile);
        }
    }
};
const generateBoard = (height, width, bombsNum) => {
    bombCords = generateBombsCords(height, width, bombsNum);
    renderTiles(height, width);

    //setting bomb and tileNumbers
    bombCords.forEach((bomb) => {
        const bombPos = {
            x: bomb.split(" ")[0],
            y: bomb.split(" ")[1],
        };
        const tile = getTile(bombPos.x, bombPos.y);
        tile.classList.add("bomb");

        const tilesToCheck = [
            {
                x: Number(bombPos.x) - 1,
                y: Number(bombPos.y) - 1,
            },
            {
                x: Number(bombPos.x),
                y: Number(bombPos.y) - 1,
            },
            {
                x: Number(bombPos.x) + 1,
                y: Number(bombPos.y) - 1,
            },
            {
                x: Number(bombPos.x) - 1,
                y: Number(bombPos.y),
            },
            {
                x: Number(bombPos.x) + 1,
                y: Number(bombPos.y),
            },
            {
                x: Number(bombPos.x) - 1,
                y: Number(bombPos.y) + 1,
            },
            {
                x: Number(bombPos.x),
                y: Number(bombPos.y) + 1,
            },
            {
                x: Number(bombPos.x) + 1,
                y: Number(bombPos.y) + 1,
            },
        ];

        for (const tile of tilesToCheck) {
            const checkedTile = getTile(tile.x, tile.y);
            if (checkedTile !== null && !bombCords.includes(`${tile.x} ${tile.y}`)) {
                if (tileNumbers[`${tile.x} ${tile.y}`] === undefined) {
                    tileNumbers[`${tile.x} ${tile.y}`] = 1;
                } else {
                    tileNumbers[`${tile.x} ${tile.y}`] = tileNumbers[`${tile.x} ${tile.y}`] + 1;
                }
            }
        }
        tileNumbersArray = Object.getOwnPropertyNames(tileNumbers);
    });

    //rendering tileNumbers for debug or sth
    for (const cords in tileNumbers) {
        const tilePos = {
            x: cords.split(" ")[0],
            y: cords.split(" ")[1],
        };
        const tile = getTile(tilePos.x, tilePos.y);
        tile.classList.add(`t${tileNumbers[cords]}`);
    }
};
const handleTileClick = (e) => {
    const clickedTile = e.target;
    const tilePos = {
        x: clickedTile.getAttribute("data-x"),
        y: clickedTile.getAttribute("data-y"),
    };
    const tilePosStr = `${tilePos.x} ${tilePos.y}`;
    if (tileNumbersArray.includes(tilePosStr)) {
        console.log("number clicked"); //reveal only one
    } else if (bombCords.includes(tilePosStr)) {
        console.log("bomb clicked ;c"); //game over ofc
    } else {
        console.log("empty"); //reaveal other empty
    }
};
generateBoard(9, 9, 10);
console.log(tileNumbers);
