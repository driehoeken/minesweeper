const board = document.querySelector("#board");
const render = (height, width) => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
            console.log(i, j);
        }
    }
};
render(9, 9);
