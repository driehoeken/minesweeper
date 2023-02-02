import { cordsToStr, getRandomInt, getTile, strToCords } from "./misc.js";
const board = document.querySelector("#board");
const flagsLeftElement = document.querySelector(".flags-left");
let bombCords = [];
let tileNumbers = {};
let tileNumbersArray = [];
let emptyCords = [];
let flagsleft;
//randomizing cords for bombs
const generateBombsCords = (height, width, bombsNum) => {
    const bombsCords = [];
    let leftBombs = bombsNum;
    while (leftBombs > 0) {
        const bombCords = `${getRandomInt(width)} ${getRandomInt(height)}`;
        if (!bombsCords.includes(bombCords)) {
            bombsCords.push(bombCords);
            leftBombs -= 1;
        }
    }
    return bombsCords;
};
//rendering tiles, adding them attributes and event listeners
const renderTiles = (height, width) => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.classList.add("hidden");
            tile.setAttribute("data-x", j);
            tile.setAttribute("data-y", i);
            tile.addEventListener("click", (e) => {
                handleTileClick(e);
            });
            tile.addEventListener("contextmenu", (e) => {
                handleTileRightClick(e);
            });
            board.appendChild(tile);
        }
    }
};
//setting flagsLeft, emptyArray, bombCords, tileNumbers and tileNumbersArray
const settingVars = (height, width, bombsNum) => {
    bombCords = generateBombsCords(height, width, bombsNum);
    flagsleft = bombsNum;
    flagsLeftElement.textContent = flagsleft;
    renderTiles(height, width);

    //setting tileNumbers
    bombCords.forEach((bomb) => {
        const bombPos = strToCords(bomb);

        const tilesToCheck = [
            {
                x: bombPos.x - 1,
                y: bombPos.y - 1,
            },
            {
                x: bombPos.x,
                y: bombPos.y - 1,
            },
            {
                x: bombPos.x + 1,
                y: bombPos.y - 1,
            },
            {
                x: bombPos.x - 1,
                y: bombPos.y,
            },
            {
                x: bombPos.x + 1,
                y: bombPos.y,
            },
            {
                x: bombPos.x - 1,
                y: bombPos.y + 1,
            },
            {
                x: bombPos.x,
                y: bombPos.y + 1,
            },
            {
                x: bombPos.x + 1,
                y: bombPos.y + 1,
            },
        ];

        //checking 8 tiles around bomb and adding all of them +1 value
        for (const tile of tilesToCheck) {
            const tileCords = cordsToStr(tile);
            const checkedTile = getTile(tileCords);
            if (checkedTile !== null && !bombCords.includes(`${tile.x} ${tile.y}`)) {
                if (tileNumbers[`${tile.x} ${tile.y}`] === undefined) {
                    tileNumbers[`${tile.x} ${tile.y}`] = 1;
                } else {
                    tileNumbers[`${tile.x} ${tile.y}`] = tileNumbers[`${tile.x} ${tile.y}`] + 1;
                }
            }
        }
    });
    //setting tileNumbersArray
    tileNumbersArray = Object.getOwnPropertyNames(tileNumbers);
    //setting emptyCords
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let cordStr = `${j} ${i}`;
            if (!tileNumbersArray.includes(cordStr) && !bombCords.includes(cordStr)) {
                emptyCords.push(cordStr);
            }
        }
    }
};
const handleTileClick = (e) => {
    const clickedTile = e.target;
    //return if it is flag
    if (clickedTile.classList.contains("flag")) {
        return;
    }
    const tilePos = {
        x: clickedTile.getAttribute("data-x"),
        y: clickedTile.getAttribute("data-y"),
    };
    const tilePosStr = `${tilePos.x} ${tilePos.y}`;
    //if single number is clicked, it will reveal only clicked tile
    if (tileNumbersArray.includes(tilePosStr)) {
        clickedTile.classList.add(`t${tileNumbers[tilePosStr]}`);
    }
    //if bomb is clicked it is game over ;c
    else if (bombCords.includes(tilePosStr)) {
        console.log("bomb clicked ;c"); //game over ofc
    }
    //otherwise, empty tile is clicked and it will reveal all empty tiles and tiles with number which are connected lol
    else {
        const revealedTiles = [];
        const tilesToCheck = [tilePosStr];
        while (tilesToCheck.length > 0) {
            const centerCord = strToCords(tilesToCheck[0]);
            const centerCordStr = cordsToStr(centerCord);
            //array of tiles which could be empty and we have to check them
            const emptyTilesChecked = [
                {
                    x: centerCord.x,
                    y: centerCord.y - 1,
                },
                {
                    x: centerCord.x - 1,
                    y: centerCord.y,
                },
                {
                    x: centerCord.x + 1,
                    y: centerCord.y,
                },
                {
                    x: centerCord.x,
                    y: centerCord.y + 1,
                },
            ];
            //array of tiles which could contain number and we have to check them
            const numberTilesChecked = [
                {
                    x: centerCord.x,
                    y: centerCord.y - 1,
                },
                {
                    x: centerCord.x - 1,
                    y: centerCord.y - 1,
                },
                {
                    x: centerCord.x + 1,
                    y: centerCord.y - 1,
                },
                {
                    x: centerCord.x + 1,
                    y: centerCord.y + 1,
                },
                {
                    x: centerCord.x - 1,
                    y: centerCord.y + 1,
                },
                {
                    x: centerCord.x - 1,
                    y: centerCord.y,
                },
                {
                    x: centerCord.x + 1,
                    y: centerCord.y,
                },
                {
                    x: centerCord.x,
                    y: centerCord.y + 1,
                },
            ];
            for (const checkedTile of emptyTilesChecked) {
                const checkedTileStr = cordsToStr(checkedTile);
                //if this tile is empty and was not revealed,  add this tile to tilesToCheck
                if (
                    emptyCords.includes(checkedTileStr) &&
                    !revealedTiles.includes(checkedTileStr)
                ) {
                    tilesToCheck.push(checkedTileStr);
                }
            }
            for (const checkedTile of numberTilesChecked) {
                const checkedTileStr = cordsToStr(checkedTile);
                //if this tile contains number and was not revealed, add this tile to revealedTiles
                if (
                    tileNumbersArray.includes(checkedTileStr) &&
                    !revealedTiles.includes(checkedTileStr)
                ) {
                    revealedTiles.push(checkedTileStr);
                }
            }
            //add tile to revealed and delete it from tiles to check
            revealedTiles.push(centerCordStr);
            tilesToCheck.shift();
        }
        //reveal tiles from revealedTiles
        for (const tileCords of revealedTiles) {
            const tile = getTile(tileCords);
            tile.classList.remove("hidden");
            if (emptyCords.includes(tileCords)) {
                tile.classList.add("empty");
            } else {
                tile.classList.add(`t${tileNumbers[tileCords]}`);
            }
        }
    }
};
const handleTileRightClick = (e) => {
    e.preventDefault();
    if (flagsleft <= 0) {
        return;
    }
    const clickedTile = e.target;
    if (clickedTile.classList.contains("flag")) {
        flagsleft += 1;
    } else {
        flagsleft -= 1;
    }
    flagsLeftElement.textContent = flagsleft;
    clickedTile.classList.toggle("flag");
};
settingVars(9, 9, 10);
