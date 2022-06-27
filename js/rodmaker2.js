// when view is resized...
paper.view.onResize = function() {
    drawApp(paper.view.bounds.width, formulaInput.value, true)
};

/* utils */
var reducer = function(previousValue, currentValue) { return previousValue + currentValue }

function numberFormatting(value) { return value.toString().replace('.', ',') }
var deepEval = function(value) { try { return math.evaluate(value) } catch (e) { return false } }

var latexToImg = function(formula) {
    var wrapper = MathJax.tex2svg(formula, { em: 10, ex: 5, display: true })
    return wrapper.querySelector('svg')
}

function getTimeStamp() {
    var date = new Date();
    return date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear()+ '_' + date.getHours()+ 'h' + date.getMinutes()+ 'm' + date.getSeconds() + 's'
}

function getBlobURL(content, type) { return URL.createObjectURL(new Blob([content], {type: type })) }

function exportModel(paperWidth) {

    var svg = paper.project.exportSVG({ 
        asString: true,
        bounds: new Rectangle(new Point(paperWidth/4 - rodHeight, rodMarginTop - 1.5*rodHeight), new Size(paperWidth/2 + 2*rodHeight, (nbModelLine + 3)*rodHeight))
    })

    var match = svg.match(/height=\"(\d+)/m);
    var height = match && match[1] ? parseInt(match[1],10) : 200;
    var match = svg.match(/width=\"(\d+)/m);
    var width = match && match[1] ? parseInt(match[1],10) : 200;
    
    if (!svg.match(/xmlns=\"/mi)){ svg = svg.replace ('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ')  }
    
    // create a canvas element to pass through
    var canvas = document.createElement("canvas")
    canvas.width = 2*width
    canvas.height = 2*height
    canvas.style.width = width
    canvas.style.height = height

    var context = canvas.getContext("2d")
    context.scale(2,2)
    context.save();
    context.fillStyle = rodDefaultColor;   
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeRect(0, 0, canvas.width, canvas.height)
    context.restore();

    var url = getBlobURL(svg, 'image/svg+xml;charset=utf-8')
    var imgage = new Image;
    imgage.onload = function() {
        context.drawImage(this, 0, 0)
		var link = document.createElement("a")
		link.download = 'Modèle_' + getTimeStamp() + '.png'
		link.href = canvas.toDataURL("image/png")//.replace("image/png", "image/octet-stream")
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		delete link;
    }
    imgage.src = url
    bsOffcanvas.hide()
}

var pgcdFormula = function(aa ,bb) {

    var a = Math.max(aa, bb)
    var b = Math.min(aa, bb)
    var tempA = a

    var r = a%b
    var q = Math.floor(a/b)

    var pcgdFormula = a + '=' + q + '*' + b + '+' + r

    while(r != 0) {
        a = b, b = r, r = a%b, q = Math.floor(a/b)
        pcgdFormula += '=' + q + '*' + b + '+' + r
    }

    pcgdFormula += '=' + Math.floor(tempA/b) + '*' + b

    return pcgdFormula
}

var pgcd = function(a ,b) {
    var r = a, q = 1
    while(r != 0) { a = b, b = r, r = a%b, q = Math.floor(a/b) }
    return b
}

var bezout = function(a, b) {
    var gcd = pgcd(a, b)
    var u = 1
    var v = 1
    var cumA = a
    var cumB = b
    while(Math.abs(cumA - cumB) - gcd > 0.01) {
        if(cumA >= cumB) {
            v += 1
            cumB += b
        } else {
            u += 1
            cumA += a
        }
    }

    var formula = '?' + u + '*' + a + '=' + '?' + v + '*' + b + '+' + gcd
    if (cumB > cumA) { formula = '?' + u + '*' + a + '+' + gcd + '=' + '?' + v + '*' + b }
    return formula
}

/* shorcut examples */
formulaList = {
    'a': '42=40+2',
    'z': '42?=40+2',
    'e': '42=40+2?',
    'r': '12=3*4',
    't': '12?=3*4',
    'y': '12=3?*4',
    'u': '12=3*4?',
    'i': '3*4? = 12 = ?4*3',
    'o': '14 = 3*4 + 2?',
    'p': '2*5 = 10 = 5*2',
    'q': '4?=1.5 + 2,5',
    's': '1?=1/2+1/3+1/6',
    'd': '6=3+4',
    'f': '?11*1/3',
    'g': '2*3=20*1/5=6/5=1/5+1/5+1/5+1/5+1/5=7*1/3',
    'h': '1+23/10=1+23*1/10=1+1+1+3/10=1+2+3/10=3+0,3=3,3',
    'j': '?5*5/2=10=3.3+6,7=7+?3=5*2/3?',
    'k': '3?*1/2',
    'l': '1=1/2+1/3+1/6',
    'm': '?5*2=10=3.3+6,7=7+?3=5*2?',
    'w': '15=3?*5',
    'v': 'pgcd(77,24)',
    'b': 'bezout(77,24)'
}

function onKeyDown(event) {
    var shortKey = event.key
    if ('azertyuiopqsdfghjklmwvb'.indexOf(shortKey) > -1 && formulaInput != document.activeElement) {
        formulaInput.value = formulaList[shortKey]
        drawApp(paper.view.bounds.width, formulaList[shortKey], true)
        bsOffcanvas.hide()
    }
    if(shortKey == 'enter') { bsOffcanvas.hide() }
    if (shortKey == 'x' && formulaInput != document.activeElement) { exportModel(paper.view.bounds.width, rodMarginTop) }
    if (shortKey == 'c' && formulaInput != document.activeElement) { 
        drawApp(paper.view.bounds.width, formulaInput.value, false)
        exportModel(paper.view.bounds.width, rodMarginTop)
        drawApp(paper.view.bounds.width, formulaInput.value, true)
    }
}

/* scene */
var nbModelLine = 0
var rodHeight = 40
var textPosition = 27*rodHeight/40
var fracPosition = 20*textPosition/27
var rodMarginTop = 150
var fontSize = rodHeight/2
var rodDefaultColor = '#FFFFFF'
var rodDefalutStrokeColor = '#6b6b6b'
var greenColorList = ['#5cb85c', '#91cf91']
var braceColor = '#D9534F'


var html =  '<nav class="navbar navbar-light bg-light fixed-top">' +
            '<div class="container-fluid">' +
            '<a class="navbar-brand" href="#">Modèle en barres</a>' +
            '<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">' +
            '<span class="navbar-toggler-icon"></span>' +
            '</button>' +
            '<div class="offcanvas offcanvas-top navbar-custom" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">' +
            '<div class="offcanvas-header">' +
            '<h5 class="offcanvas-title" id="offcanvasNavbarLabel"></h5>' +
            '<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
            '</div>' +
            '<div class="offcanvas-body">' +
            '<ul class="navbar-nav justify-content-end flex-grow-1 pe-3">' +
            '<div class="d-flex" style="margin-bottom: 50px;">' +
            '<input class="form-control me-2" type="text" id="formulaInput">' +
            '<div class="form-switch form-check-inline">' +
            '<input type="checkbox" class="form-check-input" id="checkInput">' +
            '</div>' +
            '</div>' +
            '<li>' +
            '<div class="text-center">' +
            '<button type="button" class="btn btn-outline-success btn-custom" id="download" data-toggle="tooltip" data-placement="bottom" title="Raccourci => touche \'x\'">' +
            '<i class="fas fa-file-arrow-down pr-2" aria-hidden="true"></i>&nbsp; Télécharger l\'image avec les ?' +
            '</button>' +
            '<button type="button" class="btn btn-outline-danger btn-custom" id="empty-download" data-toggle="tooltip" data-placement="bottom" title="Raccourci => touche \'c\'">' +
            '<i class="fas fa-file-arrow-down pr-2" aria-hidden="true"></i>&nbsp; Télécharger l\'image sans les ?' +
            '</button>' +
            '</div>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</nav>'

var div = document.createElement('div')
div.innerHTML = html
document.body.insertBefore(div, document.body.firstChild);

var formulaInput = document.getElementById('formulaInput')
var checkInput = document.getElementById('checkInput')
var download = document.getElementById('download')
var emptyDownload = document.getElementById('empty-download')

var myOffcanvas = document.getElementById('offcanvasNavbar')
var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)

formulaInput.value = formulaList['i']

formulaInput.addEventListener('keyup', function(event) {
    if(event.key != 'Shift') { drawApp(paper.view.bounds.width, formulaInput.value, true) }
})

checkInput.addEventListener('change', function() {
    if (formulaInput.type === "password") {
        formulaInput.type = "text";
    } else {
        formulaInput.type = "password";
    }
})  

function keyup(event) { window.dispatchEvent(new Event('keyup')); }
function change(event) { window.dispatchEvent(new Event('change')); }

download.onclick = function() { exportModel(paper.view.bounds.width, rodMarginTop) }
download.onmouseenter = function() { download.style.setProperty('cursor', 'pointer') }
download.onMouseLeave = function() { download.style.setProperty('cursor', null) }

emptyDownload.onclick = function() { 
    drawApp(paper.view.bounds.width, formulaInput.value, false)
    exportModel(paper.view.bounds.width, rodMarginTop)
    drawApp(paper.view.bounds.width, formulaInput.value, true)
}
emptyDownload.onmouseenter = function() { emptyDownload.style.setProperty('cursor', 'pointer') }
emptyDownload.onMouseLeave = function() { emptyDownload.style.setProperty('cursor', null) }

/* main function */
function drawApp(paperWidth, formula, withMark) {

    project.clear()

    var currentFormula = formula

    /* testing pgcd input */
    if(currentFormula.substring(0, 4) == 'pgcd') {
        var getNumericValue = currentFormula.substring(4, currentFormula.length)
        getNumericValue = getNumericValue.replace(/\(*\)*/g, '')
        getNumericValue = getNumericValue.split(',')
        var a = parseInt(getNumericValue[0])
        var b = parseInt(getNumericValue[1])
        if(!isNaN(a) && !isNaN(b)) {
            currentFormula = pgcdFormula(a, b)
        }
    }

     /* testing bezout input */
    if(currentFormula.substring(0, 6) == 'bezout') {
        var getNumericValue = currentFormula.substring(6, currentFormula.length)
        getNumericValue = getNumericValue.replace(/\(*\)*/g, '')
        getNumericValue = getNumericValue.split(',')
        var a = parseInt(getNumericValue[0])
        var b = parseInt(getNumericValue[1])
        if(!isNaN(a) && !isNaN(b)) {
            currentFormula = bezout(a, b)
        }
    }


    var formulaSplitEqual = currentFormula.split('=')
    var lines = formulaSplitEqual.map(function(item) { return item.replace(/\,/g, '.').replace(/[a-zA-Z\s\?]*/g, '') }) 

    var sumList = []
    var modelLines = []
    var modelMax = 0
    nbModelLine = lines.length

    /* modelMax computing */
    for(var index in lines) {

        if(!isNaN(parseInt(lines[index]))) {

            var line = lines[index].split('+')
            modelLines.push(line)
    
            var tempSum = [0]
            for(var rod in line) {
                if(line[rod].indexOf('*') > -1) {
                    var productSplited = line[rod].split('*')
                    var factor = deepEval(productSplited[0])
                    var value = deepEval(productSplited[1])
                    if(!isNaN(factor) && !isNaN(value)) {
                        tempSum.push(factor*value)
                    }
                } else {
                    if(!isNaN(deepEval(line[rod]))) { tempSum.push(deepEval(line[rod])) }
                }
            }
            var lineSum = tempSum.reduce(reducer)
            sumList.push(lineSum)
        }
    }
    modelMax = Math.max.apply(Math, sumList)

    /* hidden cells computing */
    var modelLinesIsValueHidden = []
    for(var index in formulaSplitEqual) {
        var line = formulaSplitEqual[index].split('+').map(function(item) { return item.replace(/[0-9a-zA-Z\s.,\/]*/g, '') })
        modelLinesIsValueHidden.push(line)
    }

    /* model building */
    var realLileNumber = 0
    for(var i in modelLines) {
        var shift = 0
        var changeLine = false
        for(var j in modelLines[i]) {
            var productSplited = modelLines[i][j].split('*')
            var sum = deepEval(modelLines[i][j])
            var factor = deepEval(productSplited[0])
            var value = deepEval(productSplited[1])
            if(modelLinesIsValueHidden[i][j] == '*?') {
                if(factor != 0 && value != 0) {
                    new MultiPartition(shift, productSplited[1], productSplited[0], modelMax, realLileNumber, true, paperWidth, false, withMark)
                    shift += factor*value
                    changeLine = true
                }
            } else if(modelLinesIsValueHidden[i][j] == '*' || modelLinesIsValueHidden[i][j] == '?*?') {
                if(factor != 0 && value != 0) {
                    new MultiPartition(shift, productSplited[1], productSplited[0], modelMax, realLileNumber, false, paperWidth, true, withMark)
                    shift += factor*value
                    changeLine = true
                }
            } else if(modelLinesIsValueHidden[i][j] == '?*') {
                var isLastLine = nbModelLine == realLileNumber + 1
                var isFirstLine = realLileNumber == 0
                var type = 'none'
                if (isFirstLine) { type = 'top' }
                if (isLastLine) { type = 'bottom' }
                if(factor != 0 && value != 0) {
                    new MultiQuotition(shift, productSplited[1], productSplited[0], modelMax, realLileNumber, type, paperWidth, withMark)
                    shift += factor*value
                    changeLine = true
                }
            } else if(modelLinesIsValueHidden[i][j] == '?') {
                if(sum != 0) {
                    new Rod(shift, modelLines[i][j], modelMax, realLileNumber, true, true, paperWidth, rodDefaultColor, withMark)
                    shift += sum
                    changeLine = true
                }
            }  else {
                if(sum != 0) {
                    new Rod(shift, modelLines[i][j], modelMax, realLileNumber, false, true, paperWidth, rodDefaultColor, withMark)
                    shift += sum
                    changeLine = true
                }
            }  
        }
        if(changeLine == true) { realLileNumber += 1 }
    }
}
/* ########### Rod ###############
@param {number} shift - somme jusqu'au départ
@param {string} originalValue - valeur de la barre
@param {number} sum - valeur totale de la ligne
@param {number} line - numéro de la ligne
@param {boolean} isValueHidden - true => la valeur de la barre est cachée
@param {boolean} isSwitchON - true => value / ?
@param {number} paperWidth - global paperWidth
@param {number} color - color in hexadecimal
@param {boolean} withMark - if false turn '?' in white
*/
var Rod = Base.extend({

    initialize: function(shift, originalValue, sum, line, isValueHidden, isSwitchON, paperWidth, color, withMark) {

        var value = deepEval(originalValue)

        if(value && value != undefined && value != 0 && sum !=0 && sum != Infinity) {
            this.rodGroup = new Group();
            this.isValueHidden = isValueHidden
            var rodLength = paperWidth/2
        
            var rectangle = new Rectangle(new Point(paperWidth/4 + shift*rodLength/sum, rodMarginTop + line*rodHeight), new Size(value*rodLength/sum, rodHeight));
            this.path = new Path.Rectangle(rectangle);
            this.path.fillColor = color
            this.path.strokeColor = rodDefalutStrokeColor
            this.path.strokeWidth = 2
            this.path.selected = false;
            this.text = new PointText(new Point(paperWidth/4 + 0.5*value*rodLength/sum + shift*rodLength/sum, rodMarginTop + textPosition + line*rodHeight));
            this.text.justification = 'center';
            this.text.fillColor = 'black';
            this.text.fontSize = fontSize
            this.text.content = numberFormatting(value)
            if (isValueHidden) { 
                this.text.content = '?'
                if(!withMark) { this.text.fillColor = 'white' }
            }

            this.svgGroup = new Group()
            var isValueFraction = originalValue.toString().indexOf('/') > -1
            var fractionSpited = originalValue.toString().split('/')
            var numerator = fractionSpited[0]
            var denominator = fractionSpited[1]
            if(!isNaN(numerator) && !isNaN(denominator)) {
                this.svgGroup = paper.project.importSVG(latexToImg('\\dfrac{'+ numerator + '}{' + denominator + '}'));
                this.svgGroup.scale(rodHeight/6);
                this.svgGroup.position.x = paperWidth/4 + 0.5*value*rodLength/sum + shift*rodLength/sum
                this.svgGroup.position.y = rodMarginTop + fracPosition + line*rodHeight
            }

            this.text.visible = !isValueFraction
            this.svgGroup.visible = isValueFraction

            if (isValueHidden) { this.text.visible = true; this.svgGroup.visible = !isValueFraction}

            this.rodGroup.addChild(this.path)
            this.rodGroup.addChild(this.text)
            this.rodGroup.addChild(this.svgGroup)
    
            if(isSwitchON) {
    
                var that = this
    
                this.rodGroup.onMouseDown = function() {
    
                    if(that.isValueHidden) {
                        that.isValueHidden = false
                        that.text.content = numberFormatting(value)
                        that.text.visible = !isValueFraction
                        that.svgGroup.visible = isValueFraction
                    } else {
                        that.isValueHidden = true
                        that.text.content = '?'
                        that.text.visible = true
                        that.svgGroup.visible = !isValueFraction
                    }
                }
        
                this.rodGroup.onMouseEnter = function() { view.element.style.setProperty('cursor', 'pointer') }
                this.rodGroup.onMouseLeave = function() { view.element.style.setProperty('cursor', null) }
            }

            return this.rodGroup
        } else { return null }
}})

/* ########### Brace ###############
@param {number} shift - somme jusqu'au départ
@param {string} originalValue - valeur itérée
@param {string} originalFactor - nombre de fois la value
@param {number} sum - valeur totale de la ligne
@param {number} line - numéro de la ligne
@param {boolean} isValueHidden - true => la valeur de la barre est cachée
@param {boolean} isSwitchON - true => factor / ?
@param {string} type - top or bottom or none
@param {number} paperWidth - global paperWidth
@param {boolean} withMark - if false turn '?' in white
*/
var Brace = Base.extend({

    initialize: function(shift, originalValue, originalFactor, sum, line, isValueHidden, isSwitchON, type, paperWidth, withMark) {

        var value = deepEval(originalValue)
        var factor = deepEval(originalFactor)

        if(factor && value) {
            this.brace = new Group()
            this.isValueHidden = isValueHidden

            var u = value*factor*paperWidth/(8*sum)
            var barceLength = paperWidth/2
            var yShift = rodMarginTop + line*rodHeight
            var xShift = shift*barceLength/sum

            var epsilon = 0
            if (type == 'top') { epsilon = 1}
            
            this.path = new Path();
            this.path.add(xShift + paperWidth/4, -rodHeight*epsilon + yShift);
            this.path.curveTo(new Point(xShift + paperWidth/4 + .25*u, -1.4*rodHeight*epsilon + .2*rodHeight + yShift), new Point(xShift + paperWidth/4 + 1*u, -1.5*rodHeight*epsilon + .25*rodHeight + yShift));
            this.path.curveTo(new Point(xShift + paperWidth/4 + 1.75*u, -1.6*rodHeight*epsilon + .3*rodHeight + yShift), new Point(xShift + paperWidth/4 + 2*u, -2*rodHeight*epsilon + .5*rodHeight + yShift));
            this.path.curveTo(new Point(xShift + paperWidth/4 + 2.25*u, -1.6*rodHeight*epsilon + .3*rodHeight + yShift), new Point(xShift + paperWidth/4 + 3*u, -1.5*rodHeight*epsilon + .25*rodHeight + yShift));
            this.path.curveTo(new Point(xShift + paperWidth/4 + 3.75*u, -1.4*rodHeight*epsilon + .2*rodHeight + yShift), new Point(xShift + paperWidth/4 + 4*u, -rodHeight*epsilon + yShift));
            this.path.strokeColor = braceColor
            this.path.strokeWidth = 2
            this.path.selected = false;
            this.text = new PointText(new Point(xShift + paperWidth/4 + 2*u, rodHeight + epsilon*(-2.75*rodHeight) + yShift));
            this.text.justification = 'center';
            this.text.fillColor = braceColor
            this.text.fontSize = fontSize
            this.text.content = numberFormatting(factor) + ' x';
            if (isValueHidden) { 
                this.text.content = '? x'
                if(!withMark) { this.text.fillColor = 'white' }
             }

            this.brace.addChild(this.path)
            this.brace.addChild(this.text)

            if(isSwitchON) {
                var that = this

                this.brace.onMouseDown = function() {

                    if(that.isValueHidden) {
                        that.isValueHidden = false
                        that.text.content = numberFormatting(factor) + ' x';
                    } else {
                        that.isValueHidden = true
                        that.text.content = '? x'
                    }
                }

                this.brace.onMouseEnter = function() { view.element.style.setProperty('cursor', 'pointer') }
                this.brace.onMouseLeave = function() { view.element.style.setProperty('cursor', null) }
            }

            this.brace.switch = function() {
                if (that.isValueHidden) {
                    that.isValueHidden = false
                    that.text.content = numberFormatting(factor) + ' x';
                } else {
                    that.isValueHidden = true
                    that.text.content = '? x'
                }
            }
            return this.brace
        }        
    }
})

/*  ########### MultiPartition ###############
(On connait le nombre de part, on cherche la taille de chaque part)
@param {number} shift - somme jusqu'au départ
@param {string} originalValue - valeur itérée
@param {string} originalFactor - nombre de fois la value => CONNU
@param {number} sum - valeur totale de la ligne
@param {number} line - numéro de la ligne
@param {boolean} isValueHidden - true => la valeur de la barre est cachée
@param {number} paperWidth - global paperWidth
@param {boolean} groupByColor - true or false
@param {boolean} withMark - if false turn '?' in white
*/
var MultiPartition = Base.extend({

    initialize: function(shift, originalValue, originalFactor, sum, line, isValueHidden, paperWidth, groupByColor, withMark) {

        var value = deepEval(originalValue)
        var factor = deepEval(originalFactor)
        var nbBlockColor = 0
        var shortFactor

        if (groupByColor && value < 1) {
            nbBlockColor = parseInt(factor*value)
            shortFactor = parseInt(parseInt(factor*value)/value)
        }

        if(factor && value) {
            this.multiPartition = new Group()
            for(var rodNumber = 0; rodNumber < factor; rodNumber++) {
                var color = rodDefaultColor
                if (nbBlockColor != 0 && rodNumber < shortFactor) { color = greenColorList[Math.floor(parseInt((rodNumber*nbBlockColor)/shortFactor))%2] }
                var rod = new Rod(shift + rodNumber*value, originalValue, sum, line, isValueHidden, true, paperWidth, color, withMark)
                this.multiPartition.addChild(rod)
            }

            return this.multiPartition
        }
    }
})

/* ########### MultiQuotition ###############
(on connait la taille des part, on cherche le nombre de parts)
@param {number} shift - somme jusqu'au départ
@param {string} originalValue - valeur itérée => CONNU
@param {string} originalFactor - nombre de fois la value
@param {number} sum - valeur totale de la ligne
@param {number} line - numéro de la ligne
@param {string} type - top or bottom or none
@param {number} paperWidth - global paperWidth
@param {boolean} withMark - if false turn '?' in white
*/
var MultiQuotition = Base.extend({

    initialize: function(shift, originalValue, originalFactor, sum, line, type, paperWidth, withMark) {

        var value = deepEval(originalValue)
        var factor = deepEval(originalFactor)

        if(factor && value) {

            this.multiQuotition = new Group()

            var xShift = shift*paperWidth/(2*sum)
            var u = value*factor*paperWidth/(8*sum)

            this.multiPartition = new Group()

            var nbBlockColor = 0
            var shortFactor = 0

            if (value < 1) {
                nbBlockColor = parseInt(factor*value)
                shortFactor = parseInt(parseInt(factor*value)/value)
            }

            for(var rodNumber = 0; rodNumber < factor; rodNumber++) {
                var color = rodDefaultColor
                if (nbBlockColor != 0 && rodNumber < shortFactor) { color = greenColorList[Math.floor(parseInt((rodNumber*nbBlockColor)/shortFactor))%2] }
                var rod = new Rod(shift + rodNumber*value, originalValue, sum, line, false, factor < 3, paperWidth, color, withMark)
                this.multiPartition.addChild(rod)
            }

            this.multiPartition.visible = false

            if(factor > 2) {
                var startRod = new Rod(shift, originalValue, sum, line, false, false, paperWidth, rodDefaultColor, withMark)
                var endRod = new Rod(shift + (factor - 1)*value, originalValue, sum, line, false, false, paperWidth, rodDefaultColor, withMark)
                var coma = new PointText()
                coma = new PointText(new Point(xShift + paperWidth/4 + 2*u, textPosition + rodMarginTop + line*rodHeight));
                coma.justification = 'center';
                coma.fillColor = 'black';
                coma.fontSize = fontSize*2
                coma.content = '...';

                if(type != 'none') {
                    this.brace = new Brace(shift, originalValue, factor, sum, line + 1, true, true, type, paperWidth, withMark)
                    this.multiQuotition.addChild(startRod)
                    this.multiQuotition.addChild(endRod)
                    this.multiQuotition.addChild(coma)
                    this.multiQuotition.addChild(this.brace)

                    var that = this
                    this.brace.onMouseDown = function() {
                        that.multiPartition.visible = !that.multiPartition.visible
                        that.brace.switch()
                    }
                }
                return this.multiQuotition
            } else {
                this.multiPartition.visible = true
                return this.multiPartition
            }
        }
    }
})