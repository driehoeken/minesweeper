export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};
export const getTile = (x, y) => {
    return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
};
export const cordsToStr = (obj) => {
    return `${obj.x} ${obj.y}`;
};
export const strToCords = (str) => {
    return {
        x: Number(str.split(" ")[0]),
        y: Number(str.split(" ")[1]),
    };
};
