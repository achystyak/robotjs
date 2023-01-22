const { mouse, Button } = require("@nut-tree/nut-js");
const { Types } = require("./types");

const Utils = {
    mouse2Button: btn => {
        switch (btn) {
            case Types.mouse.LEFT: return Button.LEFT;
            case Types.mouse.RIGHT: return Button.RIGHT;
        }
    },
    getMousePosition: async ({ x, y }) => {
        const mousePos = await mouse.getPosition();
        return {
            x: x && x.offset ? mousePos.x + x.offset : x,
            y: y && y.offset ? mousePos.y + y.offset : y
        };
    },

    rand: (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min),

    sleep: ms =>
        new Promise(resolve => setTimeout(resolve, ms || Utils.rand(222, 1777))),
};

module.exports = { Utils };