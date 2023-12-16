import { autoCompleteCallbackData } from './autocomplete.js';
import { regex, keywordRegex, ggbParameters } from './var.js';
import { saveGgbFile, exportPDF, exportSVG, saveTextFile } from './files-utils.js'
import { examplesTable } from './examples.js'

/* modals */

const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
const aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'));
const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));

document.getElementById('errorModal').addEventListener('hidden.bs.modal', event => {
    document.getElementById("filename").value = ''
})

/* utils */

function evalCode() {
    ggbApplet.reset()
    let ggbCode = editor.getValue();
    ggbApplet.evalCommand(ggbCode);
    return false;
}

function openAbout() {
    aboutModal.show()
}

function ggbOnInit() {//param) { ??
    reframe()
    console.log('GeoGebra CLI loaded.')
    loadExample('intro')
}

function reframe() {
    ggbApplet.setCoordSystem(-10,10,-10,10)
}

function resetGGB() {
    ggbApplet.reset()
    ggbApplet.setCoordSystem(-10,10,-10,10)
    editor.setValue("");
    editor.clearSelection()
}

function loadExample(name) {
    ggbApplet.reset()
    ggbApplet.setCoordSystem(-10,10,-10,10)
    editor.setValue(examplesTable[name]);
    editor.clearSelection()
    evalCode()
    exampleModal.hide()
}

function saveFile() {
    saveTextFile(editor.getValue())
}

function openUpload() {
    uploadModal.show()
}

function uploadFile() {
    // Get the file input element
    let fileInput = document.getElementById('fileInput');

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        let reader = new FileReader();

        // Read the contents of the file
        reader.onload = function (e) {
            let fileContent = e.target.result;
            ggbApplet.reset()
            ggbApplet.setCoordSystem(-10,10,-10,10)
            editor.setValue(fileContent)
            editor.clearSelection()
            evalCode()
            uploadModal.hide()
        };

        // Read the file as text
        reader.readAsText(file);
    } else {
        alert('Please select a file to upload.');
    }
}

const inputFileName = document.getElementById("filename");
inputFileName.addEventListener("keyup", logKey);
function logKey(e) {
    var str = document.getElementById("filename").value
    let m;
    let matched = null
    if ((m = regex.exec(str)) !== null) {
        m.forEach((match, groupIndex) => {
            matched = match
        });
    }
    if(matched == null) {
        errorModal.show()
    }
}

/* ace editor */
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
//editor.session.setMode("ace/mode/javascript");
editor.session.setMode('ace/mode/text', function() {
    var rules = editor.session.$mode.$highlightRules.getRules();

    for (var stateName in rules) {
        if (Object.prototype.hasOwnProperty.call(rules, stateName)) {
            rules[stateName].unshift(
            /*{
                token: 'my_token',
                regex: 'two'
            },*/
            {
                token : "constant.numeric", // decimal integers and floats
                regex : /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?|True|False|true|false/
            },
            {
                token: "variable.language",
                regex: keywordRegex,
            },
            );
        }
    }
    // force recreation of tokenizer
    editor.session.$mode.$tokenizer = null;
    editor.session.bgTokenizer.setTokenizer(editor.session.$mode.getTokenizer());
    // force re-highlight whole document
    editor.session.bgTokenizer.start(0);
});

editor.setOptions({
    enableBasicAutocompletion: [{
        getCompletions: (editor, session, pos, prefix, callback) => {
            // note, won't fire if caret is at a word that does not have these letters
            callback(null, autoCompleteCallbackData );
        },
    }],
    // to make popup appear automatically, without explicit _ctrl+space_
    enableLiveAutocompletion: true,
});

/* ggb */
var applet = new GGBApplet('5.0', ggbParameters);
//when used with Math Apps Bundle, uncomment this:
//applet.setHTML5Codebase('GeoGebra/HTML5/5.0/webSimple/');

window.onload = function () { 
    applet.inject('ggbApplet');
}

export { openAbout, evalCode, ggbOnInit, exampleModal, loadExample, resetGGB, saveGgbFile, exportSVG, exportPDF, saveFile, openUpload, uploadFile }