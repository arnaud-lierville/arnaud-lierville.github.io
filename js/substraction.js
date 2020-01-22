/* Settings */
var scale = 45;

var tokenColor = [ '#fc5c5e', '#68b147', '#41b1fc', '#fdab78']; // red, green, blue, orange
var lowTokenColor = [ '#FDADAE', '#b3d8a3', '#a0d8fd', '#fed5bb']; // red, green, blue, orange
var tokenStrokeColor = ['#fc0d1b', '#389818', '#1a9bfc', '#fc6922'];
var lowTokenStrokeColor = ['#fd868d', '#9bcb8b', '#8ccdfd', '#fdb490'];

var shortcuts = '0123456789';

var abacusBottomRight = {x: 6, y: 11 };
var abacusStrech = .5;
var globalScaleForSmallDigit = .6;
var operationBottomRight = { x:15, y:5};
var legendTopLeft = { x:8, y:2};

/* Global variables and initializations */
var nbDigits = 3;
var digitMatrix = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var pointTextMatrix = [[new PointText(),new PointText(),new PointText(),new PointText()],[new PointText(),new PointText(),new PointText(),new PointText()],[new PointText(),new PointText(),new PointText(),new PointText()],[new PointText(),new PointText(),new PointText(),new PointText()]];
var stem = 0;
var line = 2;
var Stacks = [new Group(), new Group(), new Group(), new Group(), new Group()];
var resultPointText = new Group();
var isMonochrome = false;
var pathCursorLeftPostion;
var pathCursorRightPostion;
var legend = new PointText();
var legendBackground = new Path.Rectangle();

var calculInProgress = false;
var stackToSplit = new Group();
var tokenToMove;
var tokenToMoveList = [];
var tokenDestinationList = [];
var animationFired = false;
var strikeGroup = new Group();
var stemIsUpdated = [false, false, false];
var updateFromLeft = false;

/* Main */
disableScroll();
createAbacus(abacusBottomRight.x, abacusBottomRight.y, nbDigits, abacusStrech);
var toggleButton = toggleButton(operationBottomRight.x + 1, operationBottomRight.y - .25, .5, '#fc5c5e', '#C0C0C0');
pathCursor = createPathCursor();
pathCursor.visible = false;

// createAbacus
function createAbacus(x, y, stemNumber, strech) {
    for (var stem = 1 ; stem < stemNumber + 1; stem++) {
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
    woodStand.add(new Point((x - stemNumber + 1 - 0.35)*scale, (y+.05)*scale));
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

// onMouseUp
function onMouseUp(event) {
    var detectedStem = 5-Math.floor((event.point.x)/scale-.5);
    if (detectedStem < 0) {detectedStem = 0}
    if (detectedStem > 2) {detectedStem = 2}
    cursor.position.x = abacusBottomRight.x*scale - detectedStem*scale;
    cursor.stem = detectedStem
    stem = detectedStem;
}

// createPathCursor
function createPathCursor() {

    var pathCursor = new Path();

    varVirtualPointTextDigit = new PointText();
    varVirtualPointTextDigit.position = new Point((operationBottomRight.x - 0 + 0.1)*scale, (operationBottomRight.y - 1)*scale);
    varVirtualPointTextDigit.fontFamily = 'sans-serif';
    varVirtualPointTextDigit.fontWeight = 'bold';
    varVirtualPointTextDigit.fontSize = scale*1.1;
    varVirtualPointTextDigit.content = "7"
    varVirtualPointTextDigit.position = new Point((operationBottomRight.x - stem + 0.1)*scale, (operationBottomRight.y - 1)*scale);

    pathCursorSize = varVirtualPointTextDigit.bounds.size*1;
    pathCursorSize.width = pathCursorSize.width*1.2;
    pathCursorSize.height = pathCursorSize.height*.727;
    pathCursor = new Path.Rectangle(new Rectangle(varVirtualPointTextDigit.bounds.topLeft + new Point(-.05*scale, .15*scale), pathCursorSize));
    pathCursor.strokeColor = '#986515';
    pathCursor.strokeWidth = scale/12;
    pathCursorRightPostion = pathCursor.position
    pathCursorLeftPostion = pathCursorRightPostion - new Point(2*scale, 0);
    varVirtualPointTextDigit.visible = false;

    return pathCursor;
}

// Minus symbol (-)
var minusPointTextDigit = new PointText();
minusPointTextDigit.position = new Point((15 - 3 + 0.1)*scale, 4*scale);
minusPointTextDigit.content = '-';
minusPointTextDigit.fillColor = 'black';
minusPointTextDigit.fontFamily = 'sans-serif';
minusPointTextDigit.fontWeight = 'bold';
minusPointTextDigit.fontSize = scale*1.1;
fixInitialBugPosition(minusPointTextDigit, 3, 4, operationBottomRight.x);

// Operation bar 
var  bar = new Path();
bar.add(new Point((15 - 2.2)*scale, 4.45*scale));
bar.add(new Point((15.3 + 0.1)*scale, 4.45*scale));
bar.strokeWidth = scale/12;
bar.strokeColor = 'black';
bar.sendToBack();

// RadioButtons
var selectedButtonValue = 1;

var radioButton0 = new Path.Circle(new Point((operationBottomRight.x+1.5)*scale, (operationBottomRight.y-1)*scale), scale/3);
radioButton0.fillColor = '#C0C0C0';
radioButton0.strokeColor = '#999999';
radioButton0.strokeWidth = scale/15;
radioButton0.onMouseDown = function() {
    if (line == 1) { line = 2; } else  { line = 1; };
    selectedButtonValue = 0;
    radioButton1.shadowColor = null;
    radioButton0.shadowColor = new Color(0, 0, 0);
    radioButton0.shadowBlur = 12;
    radioButton0.shadowOffset = new Point(5, 5);
}

var radioButton1 = new Path.Circle(new Point((operationBottomRight.x+1.5)*scale, (operationBottomRight.y-2)*scale), scale/3);
radioButton1.fillColor = '#C0C0C0';
radioButton1.strokeColor = '#999999';
radioButton1.strokeWidth = scale/15;
radioButton1.shadowColor = new Color(0, 0, 0);
radioButton1.shadowBlur = 12;
radioButton1.shadowOffset = new Point(5, 5);
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

// alert calculInProgress
alert = new PointText({
    point: [(legendTopLeft.x+1)*scale, (legendTopLeft.y+5)*scale],
    content: 
    'Échanges en cours ...\n\n'  +
    'Continuez les échanges ou \n'  +
    'tapez \'e\' pour effacer',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25,
    visible: false
});

// legend
legend = new PointText({
    point: [legendTopLeft.x*scale, legendTopLeft.y*scale],
    content: 
    'Souris et raccourcis claviers :\n'  +
    '\n'  +
    'a : affiche l\'aide\n' +
    'Flèches gauche et droite : déplace le curseur\n' +
    'Flèches haut et bas : ajoute et enlève un jeton\n' +
    '1, 2, 3, ... : crée des jetons\n' +
    'Espace : change de nombre\n' +
    'r : montre/cache le résultat\n' +
    'e : efface tout\n\n' +
    'Cliquez sur une pile pour casser un jeton',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25,
});

legend.onMouseDown = function(event) { 
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
};

legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft, legend.bounds.size));
var legendBackground = new Path.Rectangle(new Rectangle(new Point(legendTopLeft.x*scale, (legendTopLeft.y-2)*scale), new Size(15*scale, 15*scale)));
legendBackground.fillColor = '#ffffff';
legend.bringToFront();

/* Key functions */
function onKeyDown(event) {

    console.log(event.key);

    if (calculInProgress) {
        alert.visible = true;
    }

    // moving cursor on abacus
    if (event.key == 'left') {
        pathCursor.position.x -= scale;
        cursor.position.x -= scale;
        cursor.stem += 1
        stem = stem + 1;
        if (stem == 3) {
            stem = 0;
            cursor.position.x = abacusBottomRight.x*scale;
            pathCursor.position = pathCursorRightPostion;
            cursor.stem = 1
        }
    }
    if (event.key == 'right') {
        pathCursor.position.x += scale;
        cursor.position.x += scale;
        cursor.stem -= 1
        stem = stem - 1;
        if (stem == -1) {
            stem = 2;
            cursor.position.x = (abacusBottomRight.x-2)*scale;
            pathCursor.position = pathCursorLeftPostion;
            cursor.stem = 3
        }
    }
    
    // adding one token
    if (event.key == 'up') {
        if (!calculInProgress) {
            updateDigitMatrix(line, stem, '+', 1)
        }
    }

    // removing one token
    if (event.key == 'down') {
        if (!calculInProgress) {
            updateDigitMatrix(line, stem, '-', 1)
        }
    }
    // create tokens
    if (shortcuts.indexOf(event.key) >= 0) {
        if (!calculInProgress) {
            updateDigitMatrix(line, stem, null, parseInt(event.key));
        }
    }
    // change number line
    if (event.key == 'space' || event.key == '-') {

        if (!calculInProgress) {

            if (line == 1) { 
                line = 2;
                pathCursor.visible = false;
                cursor.visible = true;
            } else  { 
                 line = 1;
                 pathCursor.visible = true;
                 cursor.visible = false;
                };
    
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
    }

    // removing all the tokens
    if (event.key == 'e') {

        resetOperation();
        stem = 0;
        cursor.position.x = abacusBottomRight.x*scale;
        pathCursor.position = pathCursorRightPostion;
        cursor.stem = 1;
        strikeGroup.removeChildren();
        line = 2;
        pathCursor.visible = false;
        cursor.visible = true;
        stemIsUpdated = [false, false, false];
        updateFromLeft = false;
        selectedButtonValue = 1;
        radioButton0.shadowColor = null;
        radioButton1.shadowColor = new Color(0, 0, 0);
        radioButton1.shadowBlur = 12;
        radioButton1.shadowOffset = new Point(5, 5);
    }

    // display the result number
    if (event.key == 'r') {
        switchToggleButton();       
    }

    // a : legend
    if (event.key == 'a') {
        legend.visible = !legend.visible;
        legendBackground.visible = !legendBackground.visible;
    };

    if (event.key != 'a') {
        legend.visible = false;
        legendBackground.visible = false;
    };
}

// resetOperation
function resetOperation() {
    for (var stem = 0; stem < nbDigits; stem++) {
        for (var line = 0; line < 3; line++) {
            digitMatrix[line][stem] = 0;
        }
    }
    calculInProgress = false;
    alert.visible = false;
    updateSub();
    updateDigits();
    updateStacks();
    freezeSubstraction(false);
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
    updateSub();
    updateDigits();
    updateStacks();
}

// updateSub
function updateSub() {
    for(var stem = 0; stem < nbDigits; stem++) {
        digitMatrix[0][stem] = digitMatrix[2][stem] - digitMatrix[1][stem];
    }
}

// updateDigits
function updateDigits() {

    strikeGroup.removeChildren();

    // line 0 : result
    var d0 = digitMatrix[0][0]; pointTextDigit0 = pointTextMatrix[0][0];
    var d1 = digitMatrix[0][1]; pointTextDigit1 = pointTextMatrix[0][1];
    var d2 = digitMatrix[0][2]; pointTextDigit2 = pointTextMatrix[0][2];
    if (d2 < 0) { d2 = '?'; }
    if (d1 < 0) { d1 = '?'; }
    if (d0 < 0) { d0 = '?'; }

    if (d2 != 0) {
        newUpdatePointTextDigit(d0, pointTextDigit0, 0, 0, 0, false); 
        newUpdatePointTextDigit(d1, pointTextDigit1, 1, 0, 1, false); 
        newUpdatePointTextDigit(d2, pointTextDigit2, 2, 0, 2, false); 
    } else {
        if (d1 != 0) {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 0, 0, false); 
            newUpdatePointTextDigit(d1, pointTextDigit1, 1, 0, 1, false); 
            newUpdatePointTextDigit(' ', pointTextDigit2, 2, 0, 2, false); 
        } else {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 0, 0, false); 
            newUpdatePointTextDigit(' ', pointTextDigit1, 1, 0, 1, false);
            newUpdatePointTextDigit(' ', pointTextDigit2, 2, 0, 2, false);
        }
    }

    // line 1 : number to be substracted
    var d0 = digitMatrix[1][0]; pointTextDigit0 = pointTextMatrix[1][0];
    var d1 = digitMatrix[1][1]; pointTextDigit1 = pointTextMatrix[1][1];
    var d2 = digitMatrix[1][2]; pointTextDigit2 = pointTextMatrix[1][2];

    if (d2 != 0) {
        newUpdatePointTextDigit(d0, pointTextDigit0, 0, 1, 0, false); 
        newUpdatePointTextDigit(d1, pointTextDigit1, 1, 1, 1, false); 
        newUpdatePointTextDigit(d2, pointTextDigit2, 2, 1, 2, false); 
    } else {
        if (d1 != 0) {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 1, 0, false); 
            newUpdatePointTextDigit(d1, pointTextDigit1, 1, 1, 1, false); 
            newUpdatePointTextDigit(' ', pointTextDigit2, 2, 1, 2, false); 
        } else {
            if (d0 != 0) {
                newUpdatePointTextDigit(d0, pointTextDigit0, 0, 1, 0, false); 
                newUpdatePointTextDigit(' ', pointTextDigit1, 1, 1, 1, false); 
                newUpdatePointTextDigit(' ', pointTextDigit2, 2, 1, 2, false); 
            } else {
                newUpdatePointTextDigit(' ', pointTextDigit0, 0, 1, 0, false); 
                newUpdatePointTextDigit(' ', pointTextDigit1, 1, 1, 1, false); 
                newUpdatePointTextDigit(' ', pointTextDigit2, 2, 1, 2, false); 
            }
        }
    }

    // line 2 : number from wich is subtracted the other
    var d0 = digitMatrix[2][0]; pointTextDigit0 = pointTextMatrix[2][0];
    var d1 = digitMatrix[2][1]; pointTextDigit1 = pointTextMatrix[2][1];
    var d2 = digitMatrix[2][2]; pointTextDigit2 = pointTextMatrix[2][2];
    var newD1 = ((d1+1)%10).toString()+ d1.toString();
    if (updateFromLeft) { newD1 = (d1+1).toString()+ (d1%10).toString(); }
    // no split
    if (d0 < 10 && d1 < 10) {
        if (d2 != 0) {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
            newUpdatePointTextDigit(d1, pointTextDigit1, 1, 2, 1, false); 
            newUpdatePointTextDigit(d2, pointTextDigit2, 2, 2, 2, false); 
        } else {
            if (d1 != 0) {
                newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                newUpdatePointTextDigit(d1, pointTextDigit1, 1, 2, 1, false); 
                newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
            } else {
                if (d0 != 0) {
                    newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                } else {
                    newUpdatePointTextDigit(' ', pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                }
            }
        }
    }

    // line2
    // split2 and split1
    if (d0 > 9 && d1 > 9) {
        if (d2 != 0) {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false);
            newUpdatePointTextDigit(newD1, pointTextDigit1, 1, 2, 1, true);
            newUpdatePointTextDigit((d2+1).toString()+ d2.toString(), pointTextDigit2, 2, 2, 2, true);
        } else {
            if (d1 != 0) {
                newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                newUpdatePointTextDigit(newD1, pointTextDigit1, 1, 2, 1, true);
                newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
            } else {
                if (d0 != 0) {
                    newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                } else {
                    newUpdatePointTextDigit(' ', pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                }
            }
        }
    }

    // line2
    // split1
    if (d0 > 9 && d1 < 10) {
        if (d2 != 0) {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false);
            newUpdatePointTextDigit(newD1, pointTextDigit1, 1, 2, 1, true);
            newUpdatePointTextDigit(d2, pointTextDigit2, 2, 2, 2, false);
        } else {
            if (d1 != 0) {
                newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                newUpdatePointTextDigit(newD1, pointTextDigit1, 1, 2, 1, true);
                newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
            } else {
                if (d0 != 0) {
                    newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                } else {
                    newUpdatePointTextDigit(' ', pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                }
            }
        }
    }

    // line2
    // split2
    if (d1 > 9 && d0 <10) {
        if (d2 != 0) {
            newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false);
            newUpdatePointTextDigit(d1, pointTextDigit1, 1, 2, 1, false);
            newUpdatePointTextDigit((d2+1).toString()+ d2.toString(), pointTextDigit2, 2, 2, 2, true);
        } else {
            if (d1 != 0) {
                newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                newUpdatePointTextDigit(d1, pointTextDigit1, 1, 2, 1, false);
                newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
            } else {
                if (d0 != 0) {
                    newUpdatePointTextDigit(d0, pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                } else {
                    newUpdatePointTextDigit(' ', pointTextDigit0, 0, 2, 0, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit1, 1, 2, 1, false); 
                    newUpdatePointTextDigit(' ', pointTextDigit2, 2, 2, 2, false); 
                }
            }
        }
    }
}

function newUpdatePointTextDigit(digit, pointTextDigit, stem, line, color, isStriked) {

    pointTextDigit.content = digit;
    var localScale = 1;

    if (digit < 0) { pointTextDigit.content = "?"; }
    if (digit > 9 || (typeof digit == 'string' && digit != '?' && digit != ' ')) { localScale = globalScaleForSmallDigit; }
    if (typeof digit == 'string' && digit.length == 4) { localScale = globalScaleForSmallDigit*.75; }

    pointTextDigit.position = new Point((operationBottomRight.x - stem + 0.1)*scale, (operationBottomRight.y - line)*scale);
    pointTextDigit.fillColor = tokenColor[color];
    pointTextDigit.fontFamily = 'sans-serif';
    pointTextDigit.fontWeight = 'bold';
    pointTextDigit.fontSize = localScale*scale*1.1;

    if (isStriked) { strikeDigit(stem, line, digit.length); }
    if (line == 0) { resultPointText.addChild(pointTextDigit); }

    fixInitialBugPosition(pointTextDigit, stem, operationBottomRight.y - line, operationBottomRight.x);
}


//strikeDigit
function strikeDigit(stem, line, nbOfDigits) {

    if (nbOfDigits) {
        var strike = new PointText();
        strikeGroup.addChild(strike);
        
        strike.position = new Point((operationBottomRight.x - stem + 0.1)*scale, (operationBottomRight.y - line)*scale);
        strike.fillColor = 'black';
        strike.fontFamily = 'sans-serif';
        strike.fontWeight = 'bold';
        strike.content = "/";
        strike.fontSize = globalScaleForSmallDigit*scale*1.1;
        var corXposition = 0;
        if ( nbOfDigits == 3 && updateFromLeft) {
            if (digitMatrix[line][stem] > 10 ) { strike.content = " /"; } else { strike.content = "/ /"; corXposition = .1 }
            strike.fontSize = strike.fontSize*.75;
        }
        strike.fontSize = globalScaleForSmallDigit*scale*1.1;
    
        fixInitialBugPosition(strike, stem, operationBottomRight.y - line, operationBottomRight.x);
        strike.position.x -= (nbOfDigits - 1)*strike.bounds.size.width;
        if ( nbOfDigits == 3 && updateFromLeft) {
            strike.position.x += (1.8 - corXposition)*strike.bounds.size.width;
        }
    }    
}

// updateStacks
function updateStacks() {

    for (var stem = 0; stem < nbDigits + 2; stem++) {

        var stack = Stacks[stem];
        stack.removeChildren();

        // tokens "plus"
        var digit1 = digitMatrix[2][stem];
        var digit2 = digitMatrix[1][stem];
        var digit3 = digitMatrix[0][stem];

        if (digit2 > 0 && digit3 > -1) {
            for(var level = 1; level < digit3 + 1; level++) {
                var token = createToken(stem, level, stem, false);
                stack.addChild(token);
            }
            for(var level = 1; level <  digit2 + 1; level++) {
                var token = createToken(stem, level + digit3, stem, true);
                stack.addChild(token);
            }
        } else {
            for(var level = 1; level < digit1 + 1; level++) {
                var token = createToken(stem, level, stem, false);
                stack.addChild(token);
            }
        }

        stack.stem = stem;

        stack.onMouseDown = function(event) {

            if (this.stem == 2) {
                otherCondition = digitMatrix[2][2] > 0 && digitMatrix[2][1] == 0 && digitMatrix[0][0] <0;
            } else { otherCondition = false; }

            if(!animationFired) {
                
                if ((digitMatrix[2][this.stem] > 0 && this.stem > 0 && digitMatrix[0][this.stem - 1] < 0) || otherCondition) {
                    calculInProgress = true;
                    alert.visible = true;
                    freezeSubstraction(true);
                    digitMatrix[2][this.stem] -= 1;
                    digitMatrix[2][this.stem - 1] += 10;
                    if (this.stem == 1 && stemIsUpdated[2]) { updateFromLeft = true; }
                    stemIsUpdated[this.stem] = true;
                    stackToSplit = this;
                    fireAnimation(this.stem);
                }
            }
        }
    }
}

// freezeSubstraction
function freezeSubstraction(bool) {
    if (bool) {
        cursor.visible = false;
        pathCursor.visible = false;
        radioButton0.visible = false;
        radioButton1.visible = false;
    } else {
        cursor.visible = true;
        pathCursor.visible = true;
        radioButton0.visible = true;
        radioButton1.visible = true;
    }
}

// fireAnimation
function fireAnimation(stem) {

    // token to move
    var numberOfTokensOnStem = stackToSplit.children.length;
    stackToSplit.fillColor = tokenColor[stem];
    stackToSplit.strokeColor = tokenStrokeColor[stem];
    tokenToMove = stackToSplit.children[numberOfTokensOnStem - 1];
    // switch to previous color
    tokenToMove.fillColor = tokenColor[stem - 1];
    tokenToMove.strokeColor = tokenStrokeColor[stem - 1];

    // compute the token distination
    var level = digitMatrix[2][stem - 1];
    for (var n = 0; n<10; n++) {

        // -10 to compensate the 10 tokens just uptated in digitMatrix
        var virtualToken = createToken(stem - 1, level + 1 + n - 10, stem - 1, false); 
        virtualToken.visible = false;
        tokenDestinationList.push(virtualToken);
        tokenToMoveList.push(tokenToMove.clone());
    }

    // fire moveTokens
    view.on('frame', moveTokens);
}

// moveTokens
var moveTokens = function onFrame(event) {

    animationFired = true;
    tokenToMove.visible = false;
    var vectors = [];

    for (var n = 0; n < 10; n++) {
        vectors[n] = tokenDestinationList[n].position - tokenToMoveList[n].position;
        tokenToMoveList[n].position += vectors[n] / 30;
    }

    var vectorsLengthList = [];
    for (var n = 0; n < 10; n++) { vectorsLengthList.push(vectors[n].length); }

    if (Math.max.apply(Math, vectorsLengthList) < 1.5) {

        stackToSplit = new Group();
        tokenToMoveList = [];
        tokenDestinationList = [];
        animationFired = false;
        updateSub();
        updateDigits();
        updateStacks();

        paper.view.detach('frame', this.onFrame);
    }
};

// createToken
function createToken(stem, level, color, isLowColored) {
    var token = new Path.Rectangle(new Rectangle(new Point((abacusBottomRight.x - stem -.4)*scale,(abacusBottomRight.y - level*abacusStrech)*scale), new Size(.8*scale,0.4*scale)), new Size(scale/9, scale/9));
    if (!isLowColored) {
        token.fillColor = tokenColor[color];
        token.strokeColor = tokenStrokeColor[color];
    } else {
        token.fillColor = lowTokenColor[color];
        token.strokeColor = lowTokenStrokeColor[color];
    }
    token.strokeWidth = scale/15;
    token.selected = false;
    return token;
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