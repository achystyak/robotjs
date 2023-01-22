const {
    screen,
    mouse,
    keyboard,
    clipboard,
    imageResource,
    // getWindows, 
    // getActiveWindow, 
    // windowWithTitle, 
} = require("@nut-tree/nut-js");
require("@nut-tree/template-matcher");

const { Types } = require("./types");
const { Utils } = require("./utils");

const Robot = {
    Screen: {
        imagePosition: async ({ image, region }) => {
            const confidence = 0.6;
            const searchRegion = {
                left: region && region.left ? region.left : 0,
                top: region && region.top ? region.top : 0,
                width: region && region.width
                    ? region.width : await screen.width(),
                height: region && region.height
                    ? region.height : await screen.height()
            };
            const imageRect = await screen.find(
                imageResource(`../images/${image}`),
                { confidence, searchRegion }
            );
            return {
                x: imageRect.left + imageRect.width / 2,
                y: imageRect.top + imageRect.height / 2,
            };
        }
    },
    Mouse: {
        move: async ({ x, y, image, region, speed }) => {
            if (x && y) {
                console.log(x, y);
                const position = await Utils.getMousePosition({ x, y });
                console.log({ position });
                return await mouse.move([position]);
            }
            if (image && region) {
                const position = await Robot.Screen.imagePosition({
                    image, region
                });
                return await mouse.move([position]);
            }
        },

        click: async (button) => {
            const btn = Utils.mouse2Button(button);
            return await mouse.click(btn);
        },

        dbClick: async (button) => mouse.doubleClick(Utils.mouse2Button(button)),

        press: async (button) => mouse.pressButton(Utils.mouse2Button(button)),

        release: async (button) => mouse.releaseButton(Utils.mouse2Button(button)),

        scroll: ({ amount, directon }) => {
            switch (directon) {
                case Types.direction.UP:
                    return mouse.scrollUp(amount);
                case Types.direction.DOWN:
                    return mouse.scrollDown(amount);
                case Types.direction.LEFT:
                    return mouse.scrollLeft(amount);
                case Types.direction.RIGHT:
                    return mouse.scrollRight(amount);
            }
        },
    },
    Keyboard: {
        type: text => keyboard.type(text),
        press: key => keyboard.pressKey(Types.keyboardKeys[key]),
        release: key => keyboard.releaseKey(Types.keyboardKeys[key]),
    },
    Clipboard: {
        get: text => clipboard.getContent(text),
        set: text => clipboard.setContent(text),
    }
};

module.exports = { Robot };