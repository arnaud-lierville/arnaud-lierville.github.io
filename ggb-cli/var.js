import { autoCompleteCallbackData } from "./autocomplete.js"

const regex = /^(?!\\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\\|\\*\?\\:<>\/$"]*[^\\.\\|\\*\\?\\\:<>\/$"]+$/;
let keywordRegex = '(' + autoCompleteCallbackData.map(item => item.value).join('|') + ')'

/* ggbParameters */
let ggbParameters = {
    // https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters
    "appName": "classic",
    "id": "ggbApplet",
    "prerelease": false,
    //"width": 600,
    //"height": 450,
    "showToolBar": false,
    "borderColor": null,
    "showMenuBar": false,
    "showAlgebraInput": false,
    "showResetIcon": false,
    "enableLabelDrags": false,
    "enableShiftDragZoom": true,
    "enableRightClick": false,
    "capturingThreshold": null,
    "showToolBarHelp": false,
    "errorDialogsActive": true,
    "useBrowserForJS":true,
    "showZoomButtons": true,
    "showFullscreenButton": true,
    //"showLogging": true,
    //"preventFocus": true,
    //"filename":"../empty.ggb"
};

export { regex, keywordRegex, ggbParameters }