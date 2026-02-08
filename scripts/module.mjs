import {LOG_MESSAGE, MODULE} from "./constants.mjs";
import {BotteDataModel} from "./features/botte/botte-data-model.mjs";

export const registeredClassFeatures = {}

Hooks.once('init', async function () {
    console.log(LOG_MESSAGE, "Initialization started")
    console.log(LOG_MESSAGE, "Registering class features")
    const templates = {};

    registeredClassFeatures.botte = CONFIG.FU.classFeatureRegistry.register(MODULE, "botte", BotteDataModel)

    Object.assign(templates, {
        "projectfu-french-ex.botte.sheet": "modules/projectfu-french-ex/templates/feature/botte/botte-sheet.hbs",
        "projectfu-french-ex.botte.preview": "modules/projectfu-french-ex/templates/feature/botte/botte-preview.hbs",
    })
    loadTemplates(templates);
    console.log(LOG_MESSAGE, "Class Features registered", registeredClassFeatures)

    console.log(LOG_MESSAGE, "Initialized")
});

Hooks.once("ready", async function () {})

Hooks.once("setup", function () {})
