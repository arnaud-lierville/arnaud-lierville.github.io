import { regex } from './var.js'

function getFileName() {
    var str = document.getElementById("filename").value
    let m;
    var fileName = 'no-mame'
    if ((m = regex.exec(str)) !== null) {
        m.forEach((match, groupIndex) => {
            fileName = match
        });
    }
    return fileName.replaceAll('.','')
}

function saveGgbFile() {
    evalCode()
    ggbApplet.getBase64(
        function (b) {
            document.getElementById("Base64").value = b
            downloadBase64File(b, getFileName() + '.ggb')
        });
}

function downloadBase64File(contentBase64, fileName) {
    const linkSource = `data:application/pdf;base64,${contentBase64}`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove(); 
}

function exportSVG() {
    evalCode()
    getFileName()
    ggbApplet.exportSVG((svg) => {
        const linkSource = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = getFileName();
        downloadLink.click();
        downloadLink.remove(); 
    });
}

function exportPDF() {
    evalCode()
    ggbApplet.exportPDF(1, pdf => {
        const linkSource = pdf;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = getFileName();
        downloadLink.click();
        downloadLink.remove();
    });
}

function saveTextFile(content) {
    const downloadLink = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.target = '_self';
    downloadLink.download = getFileName();
    downloadLink.click();
    downloadLink.remove();
}

export { saveGgbFile, exportPDF, exportSVG, saveTextFile }