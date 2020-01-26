/* Settings */
var scale = 45;

var tokenColor = ['#fc5c5e', '#68b147', '#41b1fc', '#E3AAFF', '#fdab78', '#FFABD5']; // red, green, blue, purple, orange, pink
var tokenStrokeColor = ['#fc0d1b', '#389818', '#1a9bfc', '#CC66FF', '#fc6922', '#FF8FC8'];

var shortcuts = '0123456789';

var abacusBottomRight = {x: 9.5, y: 10.5 };
var abacusStrech = .5;
var legendTopLeft = { x:abacusBottomRight.x + 1.5, y:1.5 };

/* Global variables and initializations */

var nbDigits = 6;
var digitMatrix = [0, 0, 0, 0, 0, 0];
var stem = 0;
var Stacks = [new Group(), new Group(), new Group(), new Group(), new Group(), new Group()];
var resultGroup = new Group();
var abacusGroup = new Group();
var comaPosition = 0;
var displayDecompositionGroup = new Group();
displayDecompositionGroup.visible = false;


var stackToSplitOrGroup = new Group();
// for group
var tokenDestination = new Point();
var tokensToMove = [];
// for split
var oneTokenToMove;
var tokenToMoveList = [];
var tokenDestinationList = [];

var animationFired = false;

/* Main */
disableScroll();
createAbacus(abacusBottomRight.x, abacusBottomRight.y, nbDigits, abacusStrech);

/* Scene functions */

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
        abacusGroup.addChild(woodStem);
    }
    woodStand = new Path();
    woodStand.add(new Point((x + 0.35)*scale, (y+.05)*scale));
    woodStand.add(new Point((x - stemNumber + 1 - 0.35)*scale, (y+.05)*scale));
    woodStand.strokeWidth = scale/5;
    woodStand.strokeColor = '#dfbc9a';
    woodStand.strokeCap = 'square';
    woodStand.index = stem;
    abacusGroup.addChild(woodStand);
    abacusGroup.sendToBack();
}

// Cursor
var cursor = new Path.RegularPolygon(new Point((abacusBottomRight.x)*scale, (abacusBottomRight.y+.5)*scale), 3, scale/3);
cursor.fillColor = '#986515';
cursor.stem = 0;

// onMouseDrag
function onMouseDrag(event) {
    cursor.position.x += event.delta.x;
};

// onMouseUp
function onMouseUp(event) {
    if ((abacusBottomRight.x - nbDigits + .5)*scale < event.point.x && event.point.x < (abacusBottomRight.x + .5)*scale) {
        var eps = 0;
        if ((abacusBottomRight.x - Math.floor(abacusBottomRight.x)) == 0) { eps = 0.5; }
        var detectedStem = Math.floor(abacusBottomRight.x) - Math.floor((event.point.x)/scale + eps);
        if (detectedStem < 0) {detectedStem = 0}
        if (detectedStem > nbDigits - 1) {detectedStem = nbDigits - 1}
        cursor.position.x = abacusBottomRight.x*scale - detectedStem*scale;
        cursor.stem = detectedStem
        stem = detectedStem;
    }
}

/* Toggle buttons */

// ToggleButton Class
var ToggleButton = Base.extend({

    initialize: function (x, y, size, colorON, colorOFF, textON, textOFF, scale, refreshCallback, initState) {

        this.x = x;
        this.y = y;
        this.size = size;
        this.colorON = colorON;
        this.colorOFF = colorOFF;
        this.scale = scale;
        this.isON = initState;
        this.textON = textON;
        this.textOFF = textOFF;

        var buttonScale = this.size*this.scale;
        var rectangle = new Rectangle(new Point(this.x*this.scale, this.y*this.scale), new Size(1.75*buttonScale, 1*buttonScale));
        var cornerSize = new Size(buttonScale/2, 2*buttonScale/3);
        this.shape = new Shape.Rectangle(rectangle, cornerSize);
        this.shape.fillColor = this.colorON;
        this.shape.strokeWidth = 0;

        this.circle = new Shape.Circle(new Point(this.x*this.scale +0.5*buttonScale, this.y*this.scale +0.5*buttonScale), .45*buttonScale);
        this.circle.fillColor = "#ffffff";
        this.circle.strokeWidth = 0;

        this.caption = new PointText();
        this.caption.point = this.shape.position+ new Point(1.5*buttonScale, .2*buttonScale);
        if (this.isON) { this.caption.content = this.textON; } else { 
            this.caption.content = this.textOFF;
            this.shape.fillColor = this.colorOFF;
            this.circle.position += new Point(.75*this.size*this.scale, 0);
        }
        this.caption.fillColor = '#696969';
        this.caption.fontFamily = 'sans-serif';
        this.caption.fontWeight = 'normal';
        this.caption.fontSize = Math.floor(2*buttonScale/3);

        this.toggleButtonGroup = new Group();
        this.toggleButtonGroup.addChild(this.shape);
        this.toggleButtonGroup.addChild(this.circle);
        this.toggleButtonGroup.addChild(this.caption);

        this.toggleButtonGroup.onMouseDown = function() { refreshCallback(); }

        return this;
    },
    switch: function() {

        if (this.isON) {
            this.shape.fillColor = this.colorOFF;
            this.circle.position += new Point(.75*this.size*this.scale, 0);
            this.caption.content = this.textOFF;
        } else {
            this.shape.fillColor = this.colorON;
            this.circle.position -= new Point(.75*this.size*this.scale, 0);
            this.caption.content = this.textON;
        }
        this.isON = !this.isON;        
    }
});

// toggleButton callback functions  - MUST BE DECLARED BEFORE TOGGLEBUTTON INSTANTIATAION

var splitOrGroupSwitch = function() {
    toggleButtonSplitOrGroup.switch();
}

var colorOrMonochromeSwitch = function() {
    if (toggleButtonColorOrMonochrome.isON) {
        tokenColor = [ '#008080', '#008080', '#008080', '#008080', '#008080', '#008080'];
        tokenStrokeColor = ['#006666', '#006666', '#006666', '#006666', '#006666', '#006666'];
    } else {
        tokenColor = ['#fc5c5e', '#68b147', '#41b1fc', '#E3AAFF', '#fdab78', '#FFABD5'];
        tokenStrokeColor = ['#fc0d1b', '#389818', '#1a9bfc', '#CC66FF', '#fc6922', '#FF8FC8'];
    }
    toggleButtonColorOrMonochrome.switch();
    updateStacks();
}

var displayNumberSwitch = function() {
    resultGroup.visible = !resultGroup.visible;
    if (comaPosition < 1) { coma.visible = false; }
    toggleButtonDisplayNumber.switch();

    if (toggleButtonDecomposition.isON) {
        displayDecompositionGroup.visible = false;
        toggleButtonDecomposition.switch();
    }
}

var decompositionSwitch = function() {
    if (toggleButtonDecomposition.isON) {
        displayDecompositionGroup.visible = false;
    } else {
        displayDecompositionGroup.visible = true;
    }
    toggleButtonDecomposition.switch();
}


var displayDecomposition = function() {

    displayDecompositionGroup.removeChildren();

    if (comaPosition <4) {

        var stopPrint = false;
        var stringNumber = '';
        for(var stem = comaPosition; stem < nbDigits; stem++) {
            if (!stopPrint) {
                if(digitMatrix[stem] > 9) { 
                    stringNumber = '?' + stringNumber; 
                } else { 
                    stringNumber = digitMatrix[stem].toString() + stringNumber; 
                }
            }
            var sumOfNextDigit = 0;
            for (var n = stem + 1; n < nbDigits; n++) { sumOfNextDigit += digitMatrix[n]; }
            if (sumOfNextDigit == 0) { stopPrint = true; }
        }

        var numberText = new PointText({ point: [(abacusBottomRight.x + 2)*scale, (abacusBottomRight.y - 8)*scale] });
        numberText.fillColor = 'black';
        numberText.fontFamily = 'sans-serif';
        numberText.fontWeight = 'normal';
        numberText.fontSize = 1*scale;
        numberText.content = stringNumber;

        displayDecompositionGroup.addChild(numberText);

        if(comaPosition == 3) {
            var frac1 = new Fraction((abacusBottomRight.x + 2)*scale + numberText.bounds.width*1.1 , (abacusBottomRight.y - 8)*scale, digitMatrix[2], 1);
            var frac2 = new Fraction((abacusBottomRight.x + 2)*scale + numberText.bounds.width*1.1 + frac1.width*1.1 , (abacusBottomRight.y - 8)*scale, digitMatrix[1], 2);
            new Fraction((abacusBottomRight.x + 2)*scale + numberText.bounds.width*1.1 + frac1.width*1.1 +frac2.width*1.1, (abacusBottomRight.y - 8)*scale, digitMatrix[0], 3);
        }
        if(comaPosition == 2) {
            var frac1 = new Fraction((abacusBottomRight.x + 2)*scale + numberText.bounds.width*1.1 , (abacusBottomRight.y - 8)*scale, digitMatrix[1], 1);
            var frac2 = new Fraction((abacusBottomRight.x + 2)*scale + numberText.bounds.width*1.1 + frac1.width*1.1 , (abacusBottomRight.y - 8)*scale, digitMatrix[0], 2);
        }
        if(comaPosition == 1) {
            var frac1 = new Fraction((abacusBottomRight.x + 2)*scale + numberText.bounds.width*1.1 , (abacusBottomRight.y - 8)*scale, digitMatrix[0], 1);
        }
    }
}

var Fraction = Base.extend({
    initialize: function(x, y, c, n) {

        var plusSymbol = new PointText({ point: [x, y - 0.1*scale] });
        plusSymbol.fillColor = 'black';
        plusSymbol.fontFamily = 'sans-serif';
        plusSymbol.fontWeight = 'normal';
        plusSymbol.fontSize = 1*scale;
        plusSymbol.content = '+'; 

        var denominator = new PointText({ point: [x + plusSymbol.bounds.width*1.2, y + .55*scale] });
        denominator.fillColor = 'black';
        denominator.fontFamily = 'sans-serif';
        denominator.fontWeight = 'normal';
        denominator.fontSize = 1*scale;
        denominator.content = Math.pow(10, n).toString();

        var numerator = new PointText({ point: [x + + plusSymbol.bounds.width*1.2, y - 0.45*scale] });
        numerator.fillColor = 'black';
        numerator.fontFamily = 'sans-serif';
        numerator.fontWeight = 'normal';
        numerator.fontSize = 1*scale;
        numerator.content = c.toString();
        numerator.position.x += (denominator.bounds.width - numerator.bounds.width)*.5;

        var bar = new Path(denominator.bounds.topLeft, denominator.bounds.topRight);
        bar.strokeColor = 'black';
        bar.strokeWidth = scale/10;

        this.width = plusSymbol.bounds.width + denominator.bounds.width;

        displayDecompositionGroup.addChild(plusSymbol);
        displayDecompositionGroup.addChild(denominator);
        displayDecompositionGroup.addChild(numerator);
        displayDecompositionGroup.addChild(bar);
    }
});

// ToggleButton instantiation
var toggleButtonDecomposition = new ToggleButton(abacusBottomRight.x + 2, abacusBottomRight.y - 3.25, .5,'#FF6666', '#66ffff', 'Décompostion affichée', 'Décompostion cachée', scale, decompositionSwitch, false);
var toggleButtonSplitOrGroup = new ToggleButton(abacusBottomRight.x + 2, abacusBottomRight.y - 2.5, .5,'#20b2aa', '#B22028', 'Grouper', 'Casser', scale, splitOrGroupSwitch, true);
var toggleButtonDisplayNumber = new ToggleButton(abacusBottomRight.x + 2, abacusBottomRight.y - 1.75, .5, '#133337', '#C0C0C0', 'Nombre affiché', 'Nombre caché', scale, displayNumberSwitch, true);
var toggleButtonColorOrMonochrome = new ToggleButton(abacusBottomRight.x + 2, abacusBottomRight.y - 1, .5, tokenColor[5], '#C0C0C0',  'Couleurs', 'Monochrome', scale, colorOrMonochromeSwitch, true);

/* Button */

var Button = Base.extend({
    initialize: function(x, y, color, strokeColor, fontSizeScale, textColor, caption, scale, refreshCallback) {

        this.buttonText = new PointText();
        this.buttonText.point = new Point(x*scale,y*scale);
        this.buttonText.fillColor = textColor;
        this.buttonText.fontFamily = 'sans-serif';
        this.buttonText.fontWeight = 'normal';
        this.buttonText.fontSize = fontSizeScale*scale;
        this.buttonText.content = caption;

        var buttonTextDimension = {
            x: this.buttonText.bounds.size.width,
            y: this.buttonText.bounds.size.height
        }
        var newTopLeft = new Point(this.buttonText.bounds.topLeft.x - buttonTextDimension.x*.1, this.buttonText.bounds.topLeft.y - buttonTextDimension.y*.1);
        var newBottomRight = new Point(this.buttonText.bounds.bottomRight.x + buttonTextDimension.x*.1, this.buttonText.bounds.bottomRight.y + buttonTextDimension.y*.1);

        this.button = new Path.Rectangle(new Rectangle(newTopLeft, newBottomRight), new Size(fontSizeScale*scale/9, fontSizeScale*scale/9));                
        this.button.fillColor = color;
        this.button.strokeColor = strokeColor;
        this.button.strokeWidth = scale/15;
        this.button.sendToBack();

        this.buttonGroup = new Group();
        this.buttonGroup.addChild(this.button);
        this.buttonGroup.addChild(this.buttonText);
        this.buttonGroup.onMouseDown = function() {
            refreshCallback()
        }
        
    }
});

// button callback functions - MUST BE DECLARED BEFORE BUTTON INSTANTIATAION
function reset() {
    digitMatrix = [0, 0, 0, 0, 0, 0];
    updateStacks();
}

var randomAbacus = function() {
    digitMatrix = [Math.floor(Math.random()*10), Math.floor(Math.random()*10), Math.floor(Math.random()*10), Math.floor(Math.random()*10), Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
    updateStacks();
}

var displayHelp = function() {
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
}

var addToken = function() {
    digitMatrix[stem] += 1;
    updateStacks();
}

var subToken = function() {
    digitMatrix[stem] -= 1;
    if (digitMatrix[stem] <0) { digitMatrix[stem] = 0; }
    updateStacks();
}

var divideByTen = function() {

    if (comaPosition < 5) {
        comaPosition++;
        moveElements('right');
    }
    if (comaPosition > 0) { coma.visible = true; } else { coma.visible = false; }
}

var multiplyByTen = function() {

    if (comaPosition > 0) {
        comaPosition--;
        moveElements('left');
    }
    if (comaPosition > 0) { coma.visible = true; } else { coma.visible = false; }
}

// Button's instantiations
var clearButton = new Button(abacusBottomRight.x + 2, abacusBottomRight.y - 5.5, tokenColor[2], tokenStrokeColor[2], .5, '#ffffff', 'Effacer', scale, reset);
var randomButton = new Button(abacusBottomRight.x + 2, abacusBottomRight.y - 4.5, tokenColor[1], tokenStrokeColor[1], .5, '#ffffff', 'Hasard', scale, randomAbacus);
var helpButton = new Button(abacusBottomRight.x + 2, abacusBottomRight.y + 0.5, tokenColor[5], tokenStrokeColor[5], .5, '#ffffff', 'Aide', scale, displayHelp);
var plusButton = new Button(.5, 5, '#bfbfbf', '#808080', 0.5, '#ffffff' , ' PLUS ', scale, addToken);
var minusButton = new Button(.5, 6, '#bfbfbf', '#808080', 0.5, '#ffffff', 'MOINS', scale, subToken);
var multiplyByTenButton = new Button(.5, 8, '#bad2d7', '#76A5AF', 0.5, '#ffffff', 'Multiplier\n par 10', scale, multiplyByTen);
var divideByTenButton = new Button(.5, 10, '#bad2d7', '#76A5AF', 0.5, '#ffffff', 'Diviser\n par 10', scale, divideByTen);

/* Key functions */
function onKeyDown(event) {
    if (!animationFired) {

        if (event.key != 'l') {
            legend.visible = false;
            legendBackground.visible = false;
        }

        // moving cursor on abacus
        if (event.key == 'left') {
            cursor.position.x -= scale;
            cursor.stem += 1
            stem += 1;
            if (stem == nbDigits) {
                stem = 0;
                cursor.stem = 0
                cursor.position.x = abacusBottomRight.x*scale;
            }
        }
        if (event.key == 'right') {
            cursor.position.x += scale;
            cursor.stem -= 1
            stem -= 1;
            if (stem == -1) {
                stem = nbDigits - 1;
                cursor.stem = nbDigits - 1
                cursor.position.x = (abacusBottomRight.x - nbDigits + 1)*scale;
            }
        }

        // adding one token
        if (event.key == 'up') {
            addToken();
        }
        // removing one token
        if (event.key == 'down') {
            subToken();
        }
        // create tokens
        if (shortcuts.indexOf(event.key) >= 0) {
            console.log(event.key);
            if (!animationFired) {
                digitMatrix[stem] = parseInt(event.key);
                updateStacks();
                cursor.position.x += scale;
                cursor.stem -= 1
                stem -= 1;
                if (stem == -1) {
                    stem = nbDigits - 1;
                    cursor.stem = nbDigits - 1
                    cursor.position.x = (abacusBottomRight.x - nbDigits + 1)*scale;
                }
            }
        }

        // removing all the tokens
        if (event.key == 'e') {
            stem = 0;
            cursor.position.x = abacusBottomRight.x*scale;
            cursor.stem = 0;
            digitMatrix = [0, 0, 0, 0, 0, 0];
            updateStacks();
        }

        // display the result number
        if (event.key == 'n') {
            displayNumberSwitch();
        }

        // group tokens on the current stem
        if (event.key == 'g') {
            if (!toggleButtonSplitOrGroup.isON) { toggleButtonSplitOrGroup.switch(); }
            stackToSplitOrGroup = Stacks[stem];
            fireAnimation(stem);
        }

        // split last token on the current stem
        if (event.key == 'c') {
            if (toggleButtonSplitOrGroup.isON) { toggleButtonSplitOrGroup.switch(); }
            stackToSplitOrGroup = Stacks[stem];
            fireAnimation(stem);
        }

        // switch toggleButton grouper/casser
        if (event.key == 'space') {
            splitOrGroupSwitch();
        }

        // l : legend
        if (event.key == 'l') {
            displayHelp();
        };

        // m : monochrome
        if (event.key == 'm') {
            colorOrMonochromeSwitch();
        }

        // d : decomposition
        if (event.key == 'd') {
            decompositionSwitch();
        }

        // ':' : divide by 10
        if (event.key == ':') {
            divideByTen();
        }

        // f : multiply by 10
        if (event.key == 'f' || event.key == '*') {
            multiplyByTen();
        }

        // h : random number
        if (event.key == 'h') {
            randomAbacus();
        }
    }
}

// Legend
var legend = new PointText({
    point: [legendTopLeft.x*scale, legendTopLeft.y*scale],
    content: 
    'Souris et raccourcis claviers :\n'  +
    '\n'  +
    'l : affiche la légende\n' +
    'Flèches gauche et droite : déplace le curseur\n' +
    'Flèches haut et bas : ajoute et enlève un jeton\n' +
    '1, 2, 3, ... : crée des jetons\n' +
    'g : regroupe dix jetons\n'  +
    'c : casse un jeton en dix\n'  +
    'Espace : grouper ou casser en cliquant\n' +
    '* ou f : multiplie par dix\n'  +
    ': -> divise par dix\n'  +
    'n : montre/cache le résultat\n' +
    'd : montre/cache la décomposition\n' +
    'm : active/désactive la couleur\n'  +
    'h : crée un nombre au hasard\n'  +
    'e : efface tout',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25
});

legend.onMouseDown = function(event) { 
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
};

var legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft, legend.bounds.size + new Size(scale, 1*scale)));
legendBackground.fillColor = '#ffffff';
legend.bringToFront();

function displayResult() {

    resultGroup.removeChildren();

    var stopPrint = false;
    for(var stem = 0; stem  < nbDigits; stem++) {
        var displayDigit = new PointText({
            point: [(abacusBottomRight.x - 0.25)*scale, (abacusBottomRight.y + 1.7)*scale]
        });
        displayDigit.point -= new Point(stem*scale, 0);
        displayDigit.content = digitMatrix[stem];
        if (digitMatrix[stem] > 9 ) { displayDigit.content = '?'; }
        displayDigit.fillColor = tokenColor[stem];
        displayDigit.fontFamily = 'sans-serif';
        displayDigit.fontWeight = 'bold';
        displayDigit.fontSize = scale;
        displayDigit.bringToFront();
        if (stopPrint && comaPosition < stem) { displayDigit.visible = false; } else { displayDigit.visible = true; }
        resultGroup.addChild(displayDigit);
        var sumOfNextDigit = 0;
        for (var n = stem + 1; n < nbDigits; n++) { sumOfNextDigit += digitMatrix[n]; }
        if (sumOfNextDigit == 0) { stopPrint = true; }
    }
}

// coma
var coma = new PointText({
    point: [(abacusBottomRight.x + 0.1)*scale, (abacusBottomRight.y + 2)*scale]
});
coma.fillColor = 'black';
coma.fontFamily = 'math';
coma.fontWeight = 'bold';
coma.fontSize = 2.5*scale;
coma.content = ",";
coma.visible = false;
resultGroup.bringToFront();

/* Abacus tools */

// updateStacks
function updateStacks() {

    for(var stem = 0; stem < nbDigits; stem++) {

        var stack = Stacks[stem];
        stack.removeChildren();

        for(var level = 1; level < digitMatrix[stem] +1; level++) {
            var token = createToken(stem, level, stem);
            stack.addChild(token);
        }

        stack.stem = stem;
        stack.onMouseDown = function(event) {
            if(!animationFired) {
                stackToSplitOrGroup = this;
                fireAnimation(this.stem);
            }
        }
    }
    stack.bringToFront();
    displayResult();
    displayDecomposition();    
}

// fireAnimation
function fireAnimation(stem) {

    if (toggleButtonSplitOrGroup.isON && stem < nbDigits - 1) {

        // tokens to group
        var numberOfTokens = stackToSplitOrGroup.children.length;
        if (numberOfTokens > 9) {
            for (var n = 0; n < 10; n++) {
                tokensToMove[n] = stackToSplitOrGroup.children[numberOfTokens - (n + 1)];
                // turn to next color
                tokensToMove[n].fillColor = tokenColor[stem + 1];
                tokensToMove[n].strokeColor = tokenStrokeColor[stem + 1];
            }
            
            var level = digitMatrix[stem + 1];
            var virtualToken = createToken(stem + 1, level + 1, stem + 1);
            virtualToken.visible = false;
            tokenDestination = new Point(virtualToken.position.x, virtualToken.position.y);
            
            // fire moveTokens
            view.on('frame', groupTokens);
        }
    }
    if (!toggleButtonSplitOrGroup.isON && stem >0 && digitMatrix[stem] > 0) {

        // token to split
        var numberOfTokensOnStem = stackToSplitOrGroup.children.length;
        oneTokenToMove = stackToSplitOrGroup.children[numberOfTokensOnStem - 1];
        // switch to previous color
        oneTokenToMove.fillColor = tokenColor[stem - 1];
        oneTokenToMove.strokeColor = tokenStrokeColor[stem - 1];

        // compute the token distination
        var level = digitMatrix[stem - 1];
        for (var n = 0; n < 10; n++) {
            var virtualToken = createToken(stem - 1, level + 1 + n, stem - 1); 
            virtualToken.visible = false;
            tokenDestinationList.push(virtualToken);
            tokenToMoveList.push(oneTokenToMove.clone());
        }
        // fire moveTokens
        view.on('frame', splitToken);
    }
}

// splitToken
var splitToken = function onFrame(event) {

    animationFired = true;
    oneTokenToMove.visible = false;
    var vectors = [];

    for (var n = 0; n < 10; n++) {
        vectors[n] = tokenDestinationList[n].position - tokenToMoveList[n].position;
        tokenToMoveList[n].position += vectors[n] / 30;
    }

    var vectorsLengthList = [];
    for (var n = 0; n < 10; n++) { vectorsLengthList.push(vectors[n].length); }

    if (Math.max.apply(Math, vectorsLengthList) < 1.5) {

        digitMatrix[stackToSplitOrGroup.stem - 1] += 10;
        digitMatrix[stackToSplitOrGroup.stem] -= 1;
        updateStacks();
        stackToSplitOrGroup = new Group();
        tokenToMoveList = [];
        tokenDestinationList = [];
        animationFired = false;
        paper.view.detach('frame', this.onFrame);
    }
};

// groupTokens
var groupTokens = function onFrame(event) {
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

        digitMatrix[stackToSplitOrGroup.stem + 1] += 1;
        digitMatrix[stackToSplitOrGroup.stem] -= 10;
        updateStacks();
        stackToSplitOrGroup = new Group();
        tokenDestination = new Point();
        animationFired = false;
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

var moveElements = function(way) {
    if (way == 'right') { var epsilon = 1 };
    if (way == 'left') { var epsilon = -1 };

    abacusBottomRight.x += epsilon*1;
    abacusGroup.removeChildren();
    toggleButtonDecomposition.toggleButtonGroup.position += new Point(epsilon*scale, 0);
    toggleButtonSplitOrGroup.toggleButtonGroup.position += new Point(epsilon*scale, 0);
    toggleButtonDisplayNumber.toggleButtonGroup.position += new Point(epsilon*scale, 0);
    toggleButtonColorOrMonochrome.toggleButtonGroup.position += new Point(epsilon*scale, 0);
    clearButton.buttonGroup.position += new Point(epsilon*scale, 0);
    randomButton.buttonGroup.position += new Point(epsilon*scale, 0);
    helpButton.buttonGroup.position += new Point(epsilon*scale, 0);
    legend.position += new Point(epsilon*scale, 0);
    legendBackground.position += new Point(epsilon*scale, 0);
    cursor.position += new Point(epsilon*scale, 0);
    displayDecompositionGroup.position += new Point(epsilon*scale, 0);
    createAbacus(abacusBottomRight.x, abacusBottomRight.y, nbDigits, abacusStrech);
    updateStacks();
}

/* Other tools */

// disableScroll
function disableScroll() { 
    // Get the current page scroll position 
    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
  
        // if any scroll is attempted, set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
}