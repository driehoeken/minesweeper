import { cordsToStr, getRandomInt, getTile, strToCords } from "./misc.js";
const board = document.querySelector("#board");
//we can add new variable tileNumbersArray just to check if tile is number
//we also have to add emptyCords for better check of empty to reveal other empty lol
let bombCords = [];
let tileNumbers = {};
let tileNumbersArray = [];
let emptyCords = [];
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
const generateBoard = (height, width, bombsNum) => {
    bombCords = generateBombsCords(height, width, bombsNum);
    renderTiles(height, width);

    //setting bomb and tileNumbers
    bombCords.forEach((bomb) => {
        const bombPos = strToCords(bomb);
        const tile = getTile(bomb);
        //tile.classList.add("bomb");

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
    tileNumbersArray = Object.getOwnPropertyNames(tileNumbers);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let cordStr = `${j} ${i}`;
            if (!tileNumbersArray.includes(cordStr) && !bombCords.includes(cordStr)) {
                emptyCords.push(cordStr);
            }
        }
        console.log("e");
    }
    //rendering tileNumbers for debug or sth
    /*
    for (const tileCords in tileNumbers) {
        const tile = getTile(tileCords);
        tile.classList.add(`t${tileNumbers[tileCords]}`);
    }
    */
};
const handleTileClick = (e) => {
    const clickedTile = e.target;
    const tilePos = {
        x: clickedTile.getAttribute("data-x"),
        y: clickedTile.getAttribute("data-y"),
    };
    const tilePosStr = `${tilePos.x} ${tilePos.y}`;
    if (tileNumbersArray.includes(tilePosStr)) {
        clickedTile.classList.add(`t${tileNumbers[tilePosStr]}`);
    } else if (bombCords.includes(tilePosStr)) {
        console.log("bomb clicked ;c"); //game over ofc
    } else {
        const revealedTiles = [];
        const tilesToCheck = [tilePosStr];
        while (tilesToCheck.length > 0) {
            const centerCord = strToCords(tilesToCheck[0]);
            const centerCordStr = cordsToStr(centerCord);

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
                if (
                    emptyCords.includes(checkedTileStr) &&
                    !revealedTiles.includes(checkedTileStr)
                ) {
                    tilesToCheck.push(checkedTileStr);
                }
            }
            for (const checkedTile of numberTilesChecked) {
                const checkedTileStr = cordsToStr(checkedTile);
                if (
                    tileNumbersArray.includes(checkedTileStr) &&
                    !revealedTiles.includes(checkedTileStr)
                ) {
                    revealedTiles.push(checkedTileStr);
                }
            }
            revealedTiles.push(centerCordStr);
            tilesToCheck.shift();
            console.log(tilesToCheck);
        }
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
    console.log("rightClick");
};
generateBoard(9, 9, 10);
