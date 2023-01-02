export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};
export const getTile = (x, y) => {
    return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
};
