
const fs = require("fs");
const yaml = require("js-yaml");
const { performance } = require("perf_hooks");
const { Utils } = require("./src/utils");
const { Robot } = require("./src/robot");

const runAction = async action => {
    for (let actionKey of Object.keys(action)) {

        const [module, func] = actionKey.split(":");
        await Robot[module][func](action[actionKey]);

        if (action.MouseSpeed) {
            await Utils.sleep(1 / (action.MouseSpeed / 1000)); // ms
        }
    }
};

const runScene = async scene => {
    for (let action of scene.Actions) {
        await runAction(action);

        if (scene.MouseSpeed) {
            await Utils.sleep(1 / (scene.MouseSpeed / 1000)); // ms
        }
    }
};

const runScript = async script => {
    for (let runInfo of script.Run) {
        if (runInfo.Scenes) {
            for (let sceneName of runInfo.Scenes) {
                const scene = script.Scenes.find(scene => scene.Name === sceneName);
                if (scene) {
                    await runScene(scene);
                }
            }
        }
        if (runInfo.Actions) {
            for (let action of runInfo.Actions) {
                await runAction(action);
            }
        }
    }
};

// ================

async function main() {
    const script = yaml.load(
        fs.readFileSync("../script.yaml", "utf8")
    );
    await runScript(script);
}

// ================

const timings = async fn => {
    const startTime = performance.now();
    await fn();
    const endTime = performance.now();
    console.log(`Call took ${endTime - startTime} milliseconds`);
};

timings(main).then(
    () => console.log("Done")
);