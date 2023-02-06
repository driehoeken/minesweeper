export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};
export const getTile = (cords) => {
    const [x, y] = cords.split(" ");
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
export const gettingFlagsLeftText = (flags) => {
    let flagsLeftText = `${flags}`;
    if (flags < 100) {
        flagsLeftText = "0" + flagsLeftText;
    }
    if (flags < 10) {
        flagsLeftText = "0" + flagsLeftText;
    }
    return flagsLeftText;
};
