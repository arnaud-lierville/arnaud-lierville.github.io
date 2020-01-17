/* Settings */
var scale = 65;

var tokenColor = [ '#fc5c5e', '#68b147', '#41b1fc', '#fdab78'];
var tokenStrokeColor = ['#fc0d1b', '#389818', '#1a9bfc', '#fc6922'];

var shortcuts = '0123456789';

var abacusBottomRight = {x: 6, y: 11 };
var abacusStrech = .5;
var operationBottomRight = { x:15, y:5};
var legendTopLeft = { x:8, y:2};

/* Global variables and initializations */
var nbDigits = 3;
var digitMatrix = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var pointTextMatrix = [[new PointText(),new PointText(),new PointText(),new PointText()],[new PointText(),new PointText(),new PointText(),new PointText()],[new PointText(),new PointText(),new PointText(),new PointText()],[new PointText(),new PointText(),new PointText(),new PointText()]];
var stem = 0;
var line = 1;
var Stacks = [new Group(), new Group(), new Group(), new Group(), new Group()];
var resultPointText = new Group();
var isMonochrome = false;
var stemIsUpdated = [false, false, false];
var stackToGroup = new Group();
var tokenDestination = new Point();
var tokensToMove = [];
var animationFired = false;

/* Main */
console.clear();
disableScroll();
createAbacus(abacusBottomRight.x, abacusBottomRight.y, nbDigits, abacusStrech);
var toggleButton = toggleButton(operationBottomRight.x + 1, operationBottomRight.y - .25, .5, '#fc5c5e', '#C0C0C0');

/* Scene functions */

// createAbacus
function createAbacus(x, y, stemNumber, strech) {
    for (var stem = 1 ; stem < stemNumber + 2; stem++) {
        woodStem = new Path();
        woodStem.add(new Point((x - stem + 1)*scale, y*scale));
        woodStem.add(new Point((x - stem + 1)*scale, (y-18.5*strech)*scale));
        woodStem.strokeWidth = scale/5;
        woodStem.strokeColor = '#dfbc9a';
        woodStem.strokeCap = 'round';
        woodStem.index = stem;
        woodStem.sendToBack();
    }
    woodStand = new Path();
    woodStand.add(new Point((x + 0.35)*scale, (y+.05)*scale));
    woodStand.add(new Point((x - stemNumber - 0.35)*scale, (y+.05)*scale));
    woodStand.strokeWidth = scale/5;
    woodStand.strokeColor = '#dfbc9a';
    woodStand.strokeCap = 'square';
    woodStand.index = stem;
    woodStand.sendToBack();
}

// Cursor
var cursor = new Path.RegularPolygon(new Point((abacusBottomRight.x)*scale, (abacusBottomRight.y+.5)*scale), 3, scale/3);
cursor.fillColor = '#986515';
cursor.stem = 1;

// onMouseDrag
function onMouseDrag(event) {
	    cursor.position.x += event.delta.x;
};

function onMouseUp(event) {
    var detectedStem = 5-Math.floor((event.point.x)/scale-.5);
    if (detectedStem < 0) {detectedStem = 0}
    if (detectedStem > 2) {detectedStem = 2}
    cursor.position.x = abacusBottomRight.x*scale - detectedStem*scale;
    cursor.stem = detectedStem
    stem = detectedStem;
}

// Plus symbol (+)
var plusPointTextDigit = new PointText();
plusPointTextDigit.position = new Point((15 - 4 + 0.1)*scale, 4*scale);
plusPointTextDigit.content = '+';
plusPointTextDigit.fillColor = 'black';
plusPointTextDigit.fontFamily = 'sans-serif';
plusPointTextDigit.fontWeight = 'bold';
plusPointTextDigit.fontSize = scale*1.1;

fixInitialBugPosition(plusPointTextDigit, 4, 4, operationBottomRight.x);

// Operation bar 
var  bar = new Path();
bar.add(new Point((15 - 4.2)*scale, 4.45*scale));
bar.add(new Point((15.3 + 0.1)*scale, 4.45*scale));
bar.strokeWidth = scale/12;
bar.strokeColor = 'black';
bar.sendToBack();

// RadioButtons
var selectedButtonValue = 0;

var radioButton0 = new Path.Circle(new Point((operationBottomRight.x+1.5)*scale, (operationBottomRight.y-1)*scale), scale/3);
radioButton0.fillColor = tokenColor[1];
radioButton0.strokeColor = tokenStrokeColor[1];
radioButton0.strokeWidth = scale/15;
radioButton0.shadowColor = new Color(0, 0, 0);
radioButton0.shadowBlur = 12;
radioButton0.shadowOffset = new Point(5, 5);
radioButton0.onMouseDown = function() {
    if (line == 1) { line = 2; } else  { line = 1; };
    selectedButtonValue = 0;
    radioButton1.shadowColor = null;
    radioButton0.shadowColor = new Color(0, 0, 0);
    radioButton0.shadowBlur = 12;
    radioButton0.shadowOffset = new Point(5, 5);
}

var radioButton1 = new Path.Circle(new Point((operationBottomRight.x+1.5)*scale, (operationBottomRight.y-2)*scale), scale/3);
radioButton1.fillColor = tokenColor[2];
radioButton1.strokeColor = tokenStrokeColor[2];
radioButton1.strokeWidth = scale/15;
radioButton1.onMouseDown = function() {
    if (line == 1) { line = 2; } else  { line = 1; };
    selectedButtonValue = 1;
    radioButton0.shadowColor = null;
    radioButton1.shadowColor = new Color(0, 0, 0);
    radioButton1.shadowBlur = 12;
    radioButton1.shadowOffset = new Point(5, 5);
}

// toggleButton
function toggleButton(x, y, size, colorUP, colorDOWN) {

    var buttonScale = size*scale;

    var rectangle = new Rectangle(new Point(x*scale, y*scale), new Size(1.75*buttonScale, 1*buttonScale));
    var cornerSize = new Size(buttonScale/2, 2*buttonScale/3);
    var shape = new Shape.Rectangle(rectangle, cornerSize);
    shape.fillColor = colorUP;
    shape.strokeWidth = 0;

    var circle = new Shape.Circle(new Point(x*scale +0.5*buttonScale, y*scale +0.5*buttonScale), .45*buttonScale);
    circle.fillColor = "#ffffff";
    circle.strokeWidth = 0;

    var toggleButton = new Group();
    toggleButton.addChild(shape);
    toggleButton.addChild(circle);
    toggleButton.onMouseDown = function() {
        switchToggleButton();
    }

    return [shape, circle, size, colorUP, colorDOWN];
}

/* Key functions */
function onKeyDown(event) {
    if (!animationFired) {

        if (event.key != 'h') {
            legend.visible = false;
            legendBackground.visible = false;
        }

        // moving cursor on abacus
        if (event.key == 'left') {
            cursor.position.x -= scale;
            cursor.stem += 1
            stem = stem + 1;
            if (stem == 3) {
                stem = 0;
                cursor.position.x = abacusBottomRight.x*scale;
                cursor.stem = 1
            }
        }
        if (event.key == 'right') {
            cursor.position.x += scale;
            cursor.stem -= 1
            console.log('Stem: '+ cursor.stem);
            stem = stem - 1;
            if (stem == -1) {
                stem = 2;
                cursor.position.x = (abacusBottomRight.x-2)*scale;
                cursor.stem = 3
            }
        }

        // adding one token
        if (event.key == 'up') {
            if (!stemIsUpdated[stem]) {
                updateDigitMatrix(line, stem, '+', 1)
            }
            
        }
        // removing one token
        if (event.key == 'down') {
            if (!stemIsUpdated[stem]) {
                updateDigitMatrix(line, stem, '-', 1)
            }
        }
        // create tokens
        if (shortcuts.indexOf(event.key) >= 0) {
            if (!stemIsUpdated[stem]) {
                updateDigitMatrix(line, stem, null, parseInt(event.key));
            }
        }
        // change token's color
        if (event.key == 'space') {
            
            if (line == 1) { line = 2; } else  { line = 1; };

            if (selectedButtonValue == 1) {
                selectedButtonValue = 0;
                radioButton1.shadowColor = null;
                radioButton0.shadowColor = new Color(0, 0, 0);
                radioButton0.shadowBlur = 12;
                radioButton0.shadowOffset = new Point(5, 5);
            } else {
                selectedButtonValue = 1;
                radioButton0.shadowColor = null;
                radioButton1.shadowColor = new Color(0, 0, 0);
                radioButton1.shadowBlur = 12;
                radioButton1.shadowOffset = new Point(5, 5);
            }
        }

        // removing all the tokens
        if (event.key == 'e') {
            console.log('resetOperation');
            resetOperation();
            stem = 0;
            cursor.position.x = abacusBottomRight.x*scale;
            cursor.stem = 1;
            if (line == 1) { line = 2; } else  { line = 1; };
            selectedButtonValue = 0;
            radioButton1.shadowColor = null;
            radioButton0.shadowColor = new Color(0, 0, 0);
            radioButton0.shadowBlur = 12;
            radioButton0.shadowOffset = new Point(5, 5);
        }

        // display the result number
        if (event.key == 'r') {
            switchToggleButton();       
        }

        // grouping tokens on the current stem
        if (event.key == 'g') {
            if(!animationFired) {
                if (digitMatrix[0][stem] > 9) {
                    stemIsUpdated[stem] = true;
                    stackToGroup = Stacks[stem];
                    fireAnimation(stem);
                }
            }
        }

        // h : legend
        if (event.key == 'h') {
            legend.visible = !legend.visible;
            legendBackground.visible = !legendBackground.visible;
        };

        // m : monochrome
        if (event.key == 'm') {
            isMonochrome = !isMonochrome;
            if (isMonochrome) {
                tokenColor = [ '#008080', '#008080', '#008080', '#008080'];
                tokenStrokeColor = ['#006666', '#006666', '#006666', '#006666'];
                radioButton0.fillColor = '#008080';
                radioButton0.strokeColor = '#006666';            
                radioButton1.fillColor = '#008080';
                radioButton1.strokeColor = '#006666';
            } else {
                tokenColor = [ '#fc5c5e', '#68b147', '#41b1fc', '#fdab78'];
                tokenStrokeColor = ['#fc0d1b', '#389818', '#1a9bfc', '#fc6922'];
                radioButton0.fillColor = tokenColor[1];
                radioButton0.strokeColor = tokenStrokeColor[1];            
                radioButton1.fillColor = tokenColor[2];
                radioButton1.strokeColor = tokenStrokeColor[2];
            }
            updateDigits();
            updateStacks();
        }
    }
}

// switchToggleButton
function switchToggleButton() {
    if (resultPointText.visible) {
        resultPointText.visible = false;
        toggleButton[0].fillColor = toggleButton[4];
        toggleButton[1].position += new Point(.75*toggleButton[2]*scale, 0);
    } else {
        resultPointText.visible = true;
        toggleButton[0].fillColor = toggleButton[3];
        toggleButton[1].position -= new Point(.75*toggleButton[2]*scale, 0);
    }     
}

// Legend
var legend = new PointText({
    point: [legendTopLeft.x*scale, legendTopLeft.y*scale],
    content: 
    'Souris et raccourcis claviers :\n'  +
    '\n'  +
    'h : affiche l\'aide\n' +
    'Flèches gauche et droite : déplace le curseur\n' +
    'Flèches haut et bas : ajoute et enlève un jeton\n' +
    '1, 2, 3, ... : crée des jetons\n' +
    'Espace : change la couleur du jeton\n' +
    'r : montre/cache le résultat\n' +
    'g : regroupe les jetons (retenue)\n'  +
    'm : active/désactive la couleur\n'  +
    'e : efface tout\n',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25,
});

legend.onMouseDown = function(event) { 
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
};

var legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft, legend.bounds.size));
var legendBackground = new Path.Rectangle(new Rectangle(new Point(legendTopLeft.x*scale, (legendTopLeft.y-2)*scale), new Size(15*scale, 15*scale)));
legendBackground.fillColor = '#ffffff';
legend.bringToFront();

/* Abacus tools */

// resetOperation
function resetOperation() {
    for (var stem = 0; stem < nbDigits + 2; stem++) {
        for (var line = 0; line < 4; line++) {
            digitMatrix[line][stem] = 0;
        }
    }
    stemIsUpdated[0] = false;
    stemIsUpdated[1] = false;
    stemIsUpdated[2] = false;
    updateSum();
    updateDigits();
    updateStacks();
}

// updateDigitMatrix
function updateDigitMatrix(line, stem, sign, val) {
    var digit = digitMatrix[line][stem];
    if (digit < 9 && sign == '+') { 
        digitMatrix[line][stem] = digit + 1; 
    };
    if (digit > 0 && sign == '-' && val == 1) { 
        digitMatrix[line][stem] = digit - 1; 
    };
    if (-1 < val < 10 && sign == null ) { 
        digitMatrix[line][stem] = val; 
    };

    updateSum();
    updateDigits();
    updateStacks();

}

// updateSum

function updateSum() {

    if (!stemIsUpdated[0] && !stemIsUpdated[1] && !stemIsUpdated[2]) {

        digitMatrix[0][0] = digitMatrix[1][0] + digitMatrix[2][0];
        digitMatrix[0][1] = digitMatrix[1][1] + digitMatrix[2][1] + digitMatrix[3][1];
        digitMatrix[0][2] = digitMatrix[1][2] + digitMatrix[2][2] + digitMatrix[3][2];
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (stemIsUpdated[0] && !stemIsUpdated[1] && stemIsUpdated[2]) {

        updateStemSum(0);
        digitMatrix[0][1] = digitMatrix[1][1] + digitMatrix[2][1] + digitMatrix[3][1];
        updateStemSum(2);
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (!stemIsUpdated[0] && stemIsUpdated[1] && stemIsUpdated[2]) {

        digitMatrix[0][0] = digitMatrix[1][0] + digitMatrix[2][0];
        updateStemSum(1);
        updateStemSum(2);
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (!stemIsUpdated[0] && !stemIsUpdated[1] && stemIsUpdated[2]) {

        digitMatrix[0][0] = digitMatrix[1][0] + digitMatrix[2][0];
        digitMatrix[0][1] = digitMatrix[1][1] + digitMatrix[2][1] + digitMatrix[3][1];
        updateStemSum(2);
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (!stemIsUpdated[0] && stemIsUpdated[1] && !stemIsUpdated[2]) {

        digitMatrix[0][0] = digitMatrix[1][0] + digitMatrix[2][0];
        updateStemSum(1);
        digitMatrix[0][2] = digitMatrix[1][2] + digitMatrix[2][2] + digitMatrix[3][2];
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (stemIsUpdated[0] && !stemIsUpdated[1] && !stemIsUpdated[2]) {

        updateStemSum(0);
        digitMatrix[0][1] = digitMatrix[1][1] + digitMatrix[2][1] + digitMatrix[3][1];
        digitMatrix[0][2] = digitMatrix[1][2] + digitMatrix[2][2] + digitMatrix[3][2];
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (stemIsUpdated[0] && stemIsUpdated[1] && !stemIsUpdated[2]) {
        updateStemSum(0);
        updateStemSum(1);
        digitMatrix[0][2] = digitMatrix[1][2] + digitMatrix[2][2] + digitMatrix[3][2];
        digitMatrix[0][3] = digitMatrix[3][3];
    }

    if (stemIsUpdated[0] && stemIsUpdated[1] && stemIsUpdated[2]) {

        updateStemSum(0);
        updateStemSum(1);
        updateStemSum(2);
        digitMatrix[0][3] = digitMatrix[3][3];
    }
}

function updateStemSum(stem) {

    digitMatrix[0][stem] = (digitMatrix[1][stem] + digitMatrix[2][stem] + digitMatrix[3][stem])%10;
    digitMatrix[3][stem + 1] = Math.trunc((digitMatrix[1][stem] + digitMatrix[2][stem] + digitMatrix[3][stem])/10);
}

// updateDigits
function updateDigits() {

    // line 0 red or orange
    for (var stem = 0; stem < nbDigits + 1; stem++) {
        pointTextDigit = pointTextMatrix[0][stem];
        var digit = digitMatrix[0][stem];
        var sumOfPreviousDigits = 0;
        var color = 0;
        var quoDigit = digitMatrix[3][stem + 1];
        if (quoDigit != 0) {color = 3}

        if (digit == 0) {
            for (var d = stem + 1; d < nbDigits + 1; d++) {
                sumOfPreviousDigits +=  digitMatrix[0][d];
            }
            if (sumOfPreviousDigits != 0) { 
                updatePointTextDigit(digit, pointTextDigit, stem, 0, color); 
            } else {
                updatePointTextDigit(" ", pointTextDigit, stem, 0, color); 
            }
        } else {
            updatePointTextDigit(digit, pointTextDigit, stem, 0, color);
        }
    }
    // line green 1 (number 1) and line blue 2 (number 2)
    for (var line = 1; line <3; line++) {
        for (var stem = 0; stem < nbDigits + 1; stem++) {
            pointTextDigit = pointTextMatrix[line][stem];
            var digit = digitMatrix[line][stem];
            var sumOfPreviousDigits = 0;
            if (digit == 0) {
                for (var d = stem + 1; d < nbDigits + 1; d++) {
                    sumOfPreviousDigits +=  digitMatrix[line][d];
                }
                if (sumOfPreviousDigits != 0) { 
                    updatePointTextDigit(digit, pointTextDigit, stem, line, line); 
                } else {
                    updatePointTextDigit(" ", pointTextDigit, stem, line, line); 
                }
            } else {
                updatePointTextDigit(digit, pointTextDigit, stem, line, line);
            }
        }
    }
    // line orange (quotient)
    for (var stem = 0; stem < nbDigits + 1; stem++) {
        pointTextDigit = pointTextMatrix[3][stem];
        var digit = digitMatrix[3][stem];
        if (digit != 0) {
            updatePointTextDigit(digit, pointTextDigit, stem, 3, 3);
        } else {
            updatePointTextDigit(" ", pointTextDigit, stem, 3, 3);
        }
    }
}

// updateStacks
function updateStacks() {
    // stem O

    for (var stem = 0; stem < nbDigits + 2; stem++) {

        var quoDigit = digitMatrix[3][stem +1];
        var stack = Stacks[stem];
        stack.removeChildren();

        // no quotient
        if (quoDigit == 0) {
            // green (line 1)
            var digit1 = digitMatrix[1][stem];
            for (var level = 1; level < digit1 + 1; level++) {
                var token = createToken(stem, level, 1);
                stack.addChild(token);
            }
            // blue (line 2)
            var digit2 = digitMatrix[2][stem];
            for (var level = digit1 + 1; level < digit2 + digit1 + 1; level++) {
                var token = createToken(stem, level, 2);
                stack.addChild(token);
            }
            // current quotient (orange)
            if (digitMatrix[3][stem] != 0) {
                var token = createToken(stem, digit2 + digit1 + 1, 3);
                stack.addChild(token);
            }
        } else { // quotient (line 3)
            var remDigit = digitMatrix[0][stem];
            for (var level = 1; level < remDigit + 1; level++) {
                var token = createToken(stem, level, 3);
                stack.addChild(token);
            }
        }
        stack.stem = stem;
        stack.onMouseDown = function(event) {
            if(!animationFired) {
                if (digitMatrix[0][this.stem] > 9) {
                    stemIsUpdated[this.stem] = true;
                    stackToGroup = this;
                    fireAnimation(this.stem);
                }
            }
        }
    }
}

function fireAnimation(stem) {

    // tokens to move TODO -> 10
    var numberOfTokens = stackToGroup.children.length;
    for (var n = 0; n < 10; n++) {
        tokensToMove[n] = stackToGroup.children[numberOfTokens - (n + 1)];
    }
    // switch to orange color
    stackToGroup.fillColor = tokenColor[3];
    stackToGroup.strokeColor = tokenStrokeColor[3];
    // compute the token distination
    if (digitMatrix[3][stem + 2] == 0) {
        var level = digitMatrix[1][stem + 1] + digitMatrix[2][stem + 1] + digitMatrix[3][stem + 1];
    } else {
        var level = digitMatrix[0][stem + 1];
    }
    var virtualToken = createToken(stem + 1, level + 1, 3);
    virtualToken.visible = false;
    tokenDestination = new Point(virtualToken.position.x, virtualToken.position.y);
    // fire moveTokens
    view.on('frame', moveTokens);
}

var moveTokens = function onFrame(event) {
    animationFired = true;
    var vectors = [];
    for (var n = 0; n < 10; n++) {
        vectors[n] = tokenDestination - tokensToMove[n].position;
        tokensToMove[n].position += vectors[n] / 30;
    }
    var vectorsLengthList = [];
    for (var n = 0; n < 10; n++) {
        vectorsLengthList.push(vectors[n].length);
    }
    if (Math.max.apply(Math, vectorsLengthList)<1.5) {
        stackToGroup = new Group();
        tokenDestination = new Point();
        for (var n = 0; n < 10; n++) {
            tokensToMove[0].remove();
        }
        animationFired = false;
        updateSum();
        updateDigits();
        updateStacks();

        paper.view.detach('frame', this.onFrame);

    }
    
};

// createToken
function createToken(stem, level, color) {
    var token = new Path.Rectangle(new Rectangle(new Point((abacusBottomRight.x - stem -.4)*scale,(abacusBottomRight.y - level*abacusStrech)*scale), new Size(.8*scale,0.4*scale)), new Size(scale/9, scale/9));
    token.fillColor = tokenColor[color];
    token.strokeColor = tokenStrokeColor[color];
    token.strokeWidth = scale/15;
    token.selected = false;
    return token;
}

// updatePointTextDigit
function updatePointTextDigit(digit, pointTextDigit, stem, line, color) {

    // TODO: typer digit...
    if (digit == " ") { 
        pointTextDigit.content = digit; 
    } else {
        if (digit > 9) {
            pointTextDigit.content = "?";
        } else {
            pointTextDigit.content = digit;
        }
    }
    
    pointTextDigit.position = new Point((operationBottomRight.x - stem + 0.1)*scale, (operationBottomRight.y - line)*scale);
    pointTextDigit.fillColor = tokenColor[color];
    pointTextDigit.fontFamily = 'sans-serif';
    pointTextDigit.fontWeight = 'bold';
    pointTextDigit.fontSize = scale*1.1;
    if (line == 0) {
        resultPointText.addChild(pointTextDigit);
    }
    fixInitialBugPosition(pointTextDigit, stem, operationBottomRight.y - line, operationBottomRight.x);
}

// fixInitialBugPosition
function fixInitialBugPosition(pointTextDigit, stem, line, x) {
    pointTextDigit.position = new Point((x - stem + 0.1)*scale, line*scale);
}

/* Other tools */

function disableScroll() { 
    // Get the current page scroll position 
    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
  
        // if any scroll is attempted, set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
}