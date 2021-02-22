/* globals variables */

var scale = 45
var offset = .3
var opacity = 0.2
var slideNumberPosition = { x: 13, y: 6 }
var maxZeroNumberLeft = 6
var maxZeroNumberRight = 11
var unityColor = '#68b147'
var zeroColor = '#74abb5'
var comaColor = '#fc5c5e'
var redColor = comaColor
var blueColor = '#41b1fc'
var lightGrayColor = '#C0C0C0'
var legendTopLeft = { x:7, y:1.5 }
var toggleFactorPosition = 9
var currentOrder = 0
var unitsWords = [  'cent-millionièmes',  
                    'dix-millionièmes',  
                    'millionièmes',  
                    'cent-millièmes',  
                    'dix-millièmes',  
                    'millièmes', 
                    'centièmes', 
                    'dixièmes', 
                    'unités', 
                    'dizaines', 
                    'centaines', 
                    'milliers', 
                    'dizaines de milliers', 
                    'centaines de milliers', 
                    'millions', 
                    'dizaines de millions', 
                    'centaines de millions', 
                    'milliards', 
                    'dizaines de milliards', 
                    'centaines de milliards',]

var unitsWordsSingular = [  'cent-millionième',  
                    'dix-millionième',  
                    'millionième',  
                    'cent-millième',  
                    'dix-millième',  
                    'millième', 
                    'centième', 
                    'dixième', 
                    'unité', 
                    'dizaine', 
                    'centaine', 
                    'millier', 
                    'dizaine de milliers', 
                    'centaine de milliers', 
                    'million', 
                    'dizaine de millions', 
                    'centaine de millions', 
                    'milliard', 
                    'dizaine de milliards', 
                    'centaine de milliards',]

/* Scenes objects and functions */

var numberInfo = new PointText((slideNumberPosition.x)*scale, (slideNumberPosition.y + 3)*scale)
numberInfo.justification = 'center'
numberInfo.fillColor = 'black'
numberInfo.fontFamily = 'sans-serif'
numberInfo.fontSize = scale*.7
numberInfo.position.x = Math.floor(numberInfo.position.x/scale)*scale + scale/2
numberInfo.position.y = Math.floor(numberInfo.position.y/scale)*scale + scale/2 - .1*scale
numberInfo.visible = false


var updateNumberInfo = function(order) {

    var copyNumberValue = getCopyNumberValue()
    var numberOfUnitOrder = Math.floor(copyNumberValue*Math.pow(10, -order))
    var digitOfUnitOrder = numberOfUnitOrder%10
    var currentUnitsWordsAccorded = unitsWords[order + 8]
    if (numberOfUnitOrder == 0 || numberOfUnitOrder == 1) {
        currentUnitsWordsAccorded = unitsWordsSingular[order + 8]
    }
    var msg =   'Il y a ' + numberOfUnitOrder + ' ' + currentUnitsWordsAccorded + ' dans ' + copyNumberValue + '\n\n' +
                digitOfUnitOrder + ' est le chiffre des '+ currentUnitsWordsAccorded +' de ' + copyNumberValue
    msg = msg.replaceAll('.', ',')
                
    numberInfo.content = msg
    numberInfo.visible = true
}

// Grid separator
var unitText = function(text, x, order) {

    var that = new PointText(new Point(x*scale, (slideNumberPosition.y - 1)*scale))
    that.justification = 'center'
    that.fillColor = 'black'
    that.content = text
    that.fontFamily = 'sans-serif'
    that.fontSize = scale*.7
    that.position.x = Math.floor(that.position.x/scale)*scale + scale/2
    that.position.y = Math.floor(that.position.y/scale)*scale + scale/2 - .1*scale
    that.visible = true
    that.order = order

    that.onMouseEnter = function () {
        updateNumberInfo(this.order)
    }
    that.onMouseLeave = function () {
        numberInfo.visible = false
    }

    return that
}

var separatorGroup = new Group()
var separator = function() {

    for (var i = -11; i<14; i++) {
        var path = new Path();
        path.strokeColor = 'grey';
        path.strokeWidth = 1.5;
        path.add(new Point((slideNumberPosition.x + i)*scale, (slideNumberPosition.y - 2.2)*scale));
        path.add(new Point((slideNumberPosition.x + i)*scale, (slideNumberPosition.y + 1.3)*scale));
        separatorGroup.addChild(path)
        separatorGroup.bringToFront()
    }
    var path = new Path();
    path.strokeColor = 'grey';
    path.strokeWidth = 1.5;
    path.add(new Point((slideNumberPosition.x + -11)*scale, (slideNumberPosition.y + .15)*scale));
    path.add(new Point((slideNumberPosition.x + 13)*scale, (slideNumberPosition.y + .15)*scale));
    separatorGroup.addChild(path)
    separatorGroup.bringToFront()

    var path = new Path();
    path.strokeColor = 'grey';
    path.strokeWidth = 1.5;
    path.add(new Point((slideNumberPosition.x + -11)*scale, (slideNumberPosition.y + .15 - 1.35)*scale));
    path.add(new Point((slideNumberPosition.x + 13)*scale, (slideNumberPosition.y + .15 - 1.35)*scale));

    var ut04 = unitText('...', 20, -7)
    var ut03 = unitText('...', 19, -6)
    var ut02 = unitText('...', 18, -5)
    var ut01 = unitText('...', 17, -4)
    var ut1 = unitText('m', 16, -3)
    var ut2 = unitText('c', 15, -2)
    var ut3 = unitText('d', 14, -1)
    var ut4 = unitText('U', 13, 0)
    ut4.fillColor = unityColor
    var ut5 = unitText('D', 12, 1)
    var ut6 = unitText('C', 11, 2)
    var ut7 = unitText('M', 10, 3)
    var ut8 = unitText('...', 9, 4)
    var ut9 = unitText('...', 8, 5)
    var ut10 = unitText('...', 7, 6)
    var ut11 = unitText('...', 6, 7)

    separatorGroup.addChildren([path, ut04, ut03, ut02, ut01, ut1, ut2, ut3, ut4, ut5, ut6, ut7, ut8, ut9, ut10, ut11])
    separatorGroup.bringToFront()

    return separatorGroup
}

// Zero digits
var zeroDigit = function(x, y) {

    var that = new PointText(new Point(x*scale, y*scale))
    that.justification = 'center'
    that.fillColor = zeroColor
    that.content = '0'
    that.fontFamily = 'sans-serif'
    that.fontWeight = 'bold'
    that.fontSize = scale*1.3
    that.position.x = Math.floor(that.position.x/scale)*scale + scale/2
    that.position.y = Math.floor(that.position.y/scale)*scale + scale/2 + offset*scale
    that.visible = true

    return that
}

var rightZeroList = []
for (var i = 0; i<maxZeroNumberRight + 1; i++) {
    var zd = zeroDigit(slideNumberPosition.x + i, slideNumberPosition.y + 1)
    zd.visible = false
    rightZeroList.push(zd)
}

var leftZeroList = []
for (var i = 0; i<maxZeroNumberLeft; i++) {
    var zd = zeroDigit(slideNumberPosition.x - i, slideNumberPosition.y + 1)
    zd.visible = false
    leftZeroList.push(zd)
}

// Coma
var coma = new PointText(new Point((slideNumberPosition.x + 0.74)*scale, (slideNumberPosition.y + 1.2)*scale))
coma.fillColor = comaColor
coma.fontFamily = 'math'
coma.fontWeight = 'bold'
coma.fontSize = 1.5*scale
coma.content = ","
coma.visible = false
comaState = false


// Factor
var factor = new PointText(new Point((toggleFactorPosition  + 2.5)*scale, 2*scale))
factor.fillColor = redColor
factor.fontFamily = 'sans-serif'
factor.fontWeight = 'bold'
factor.fontSize = 1.3*scale
factor.content = ''

// Digits
var digit = function(value, x, y, isDragable, canBeModified, offset, isUnity, index) {

    var that = new PointText(new Point(x*scale, y*scale))
    that.x = x // original position
    that.justification = 'center'
    that.fillColor = 'black'
    if (!isNaN(value)) { 
        that.content = value.toString()
        that.isScalar = true
    } else {
        that.content = '_'
        that.isScalar = false
        that.fillColor = 'white'
        if (canBeModified && !isUnity) { that.opacity = opacity }
    }
    that.fontFamily = 'sans-serif'
    that.fontWeight = 'bold'
    that.fontSize = scale*1.3
    that.position.x = Math.floor(that.position.x/scale)*scale + scale/2
    that.position.y = Math.floor(that.position.y/scale)*scale + scale/2 + offset*scale

    if (canBeModified) {
        that.onClick = function(event) {
            separator.sendToBack()
            this.opacity = 1
            var curentValue = parseInt(this.content, 10)
            var newValue
            if (isNaN(curentValue)) {
                newValue = 0
            } else {
                newValue = (curentValue + 1)%11
            }
            if (newValue === 10) {
                this.content = '_'
                this.isScalar = false
                copyNumber.children[index].isScalar = false
                if (!isUnity) { this.opacity = opacity }
                copyNumber.children[index].content = '_'
                copyNumber.children[index].fillColor = 'white'
            } else {
                this.content = newValue.toString();
                this.isScalar = true
                copyNumber.children[index].isScalar = true
                copyNumber.children[index].content = newValue.toString();
                if (!isUnity) { 
                    copyNumber.children[index].fillColor = 'black'
                } else {
                    copyNumber.children[index].fillColor = unityColor
                }
            }
            refreshZeroList(copyNumber.children[0])
        }

        if (!isUnity) {
            that.onMouseEnter = function () {
                if (that.content === '_') {
                    that.fillColor = 'black'
                }
            }
            that.onMouseLeave = function () {
                if (that.content === '_') {
                    that.fillColor = 'white'
                }
            }
        }

    }
    
    if (isDragable) {
        that.onMouseEnter = function () {
            document.body.style.cursor = "pointer"
        }
        that.onMouseLeave = function () {
            document.body.style.cursor = "default"
        }
        that.onMouseDrag = function(event) {
            var order = slideNumberPosition.x - Math.floor(this.position.x/scale)
            if (-11 < order && order < 10 && that.content != '_') {
                copyNumber.position.x += event.delta.x
                coma.visible = 0 > order
                comaState = 0 > order
                coma.bringToFront()
                refreshZeroList(this)
                refreshFactor(order)
            }
        }
        that.onMouseUp = function() {
            currentOrder = slideNumberPosition.x - Math.floor(this.position.x/scale)
            currentOrder = Math.min(currentOrder, 6)
            currentOrder = Math.max(currentOrder, -12 + 5)
            copyNumber.position.x = Math.min(Math.floor(this.position.x/scale - 2)*scale, (slideNumberPosition.x + 5)*scale)
            copyNumber.position.x = Math.max(Math.floor(this.position.x/scale - 2)*scale, (slideNumberPosition.x - 8)*scale)
            refreshZeroList(this)
        }
    }

    return that
}

var number = function(isDragable) {

    var x = slideNumberPosition.x
    var y = slideNumberPosition.y

    var yOffset = 0
    var digitOffset = 0

    if (isDragable) {
        yOffset = 1
        digitOffset = offset
    }

    var group = new Group()
    var d0 = digit(2, x, y + yOffset, isDragable, !isDragable, digitOffset, true, 0)
    d0.fillColor = unityColor
    var d1 = digit(4, x-1, y + yOffset, false, !isDragable, digitOffset, false, 1)
    var d2 = digit('_', x-2, y + yOffset, false, !isDragable, digitOffset, false, 2)
    var d3 = digit('_', x-3, y + yOffset, false, !isDragable, digitOffset, false, 3)
    var d4 = digit('_', x-4, y + yOffset, false, !isDragable, digitOffset, false, 4)
    var d5 = digit('_', x-5, y + yOffset, false, !isDragable, digitOffset, false, 5)
    group.addChildren([d0, d1, d2, d3, d4, d5])

    return group
}

/* function */

var hideZeroList = function() {
    for (var i = 0; i<maxZeroNumberRight; i++) {
        if (leftZeroList[i]) { leftZeroList[i].visible = false }
        rightZeroList[i].visible = false
    }
    rightZeroList[maxZeroNumberRight].visible = false
}

var refreshZeroList = function(digit) {
    hideZeroList()
    var size = sizeNumber(originalNumber)
    var end = slideNumberPosition.x - Math.floor(digit.position.x/scale)

    if (size != 0) {
        for (var index = 0; index < -(end + size) + 1; index++) {
            if(rightZeroList[index]) {
                rightZeroList[index].sendToBack()
                rightZeroList[index].visible = true
            }
        }
    
        for (var index = 0; index < end; index++) {
            if (leftZeroList[index]) {
                leftZeroList[index].sendToBack()
                leftZeroList[index].visible = true
            }
        }
    } else {
        coma.visible = false
        comaState = false
        copyNumber.position.x = (slideNumberPosition.x - 2)*scale
        refreshFactor(0)
    }
}

var sizeNumber = function(group) {
    if (group.children[5].isScalar) {
        return 6
    } else {
        if (group.children[4].isScalar) {
            return 5
        } else {
            if (group.children[3].isScalar) {
                return 4
            } else {
                if (group.children[2].isScalar) {
                    return 3
                } else {
                    if (group.children[1].isScalar) {
                        return 2
                    } else {
                        if (group.children[0].isScalar) {
                            return 1
                        } else {
                            return 0
                        }
                    }
                }
            }
        }
    }
}

var getNumber = function(group) {
    
    var number = 0
    for(var index = 0; index < 6; index ++) {
        if (group.children[index].isScalar) {
            number += parseInt(group.children[index].content, 10)*Math.pow(10, index)
        }
    }

    return number
}

var getCopyNumberValue = function() {
    var originalNumberValue = getNumber(originalNumber)
    var size = sizeNumber(originalNumber)
    var copyNumberValue  = originalNumberValue.toString()
    var nbZeroToAddToleft = 1 - currentOrder - size
    if (nbZeroToAddToleft > 0) {
        copyNumberValue  = (new Array(nbZeroToAddToleft + 1)).join('0') + copyNumberValue
        copyNumberValue = copyNumberValue.slice(0,1) + '.' + copyNumberValue.slice(1)
    } else {
        if(currentOrder > -1) {
            copyNumberValue  = copyNumberValue + (new Array(currentOrder + 1)).join('0')
        } else {
            copyNumberValue = copyNumberValue.slice(0, size + currentOrder) + '.' + copyNumberValue.slice(size + currentOrder)
        }
    }
    copyNumberValue = parseFloat(copyNumberValue)
    return copyNumberValue
}

var factorSwitch = function() {
    toggleFactor.switch();
    factor.visible = !factor.visible
}

var separatorSwitch = function() {
    separatorGroup.visible = ! separatorGroup.visible
}

var factorList = ['10', '100', '1000', '10 000', '100 000', '1 000 000', '10 000 000', '100 000 000', '1 000 000 000', '10 000 000 000', '100 000 000 000', '1 000 000 000 000']
var refreshFactor = function(order) {
    if (order > 0) { factor.content = 'x ' + factorList[Math.min(5, order - 1)] }
    if (order < 0) { factor.content = ': ' + factorList[Math.min(11, -1 - order )] }
    if (order === 0) { factor.content = '' }
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

        this.toggleButtonGroup.onMouseDown = function() { refreshCallback() }

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

/* Icon Menu */
var IconMenu = Base.extend({
    initialize: function(point, name, scale, refreshCallback) {

        var picture = new Raster(name);
        picture.position = point;
        picture.scale(scale)
        picture.onMouseDown = function() {
            refreshCallback();
        }
        return IconMenu;
    }
})

/* main */

var separator = separator()
separator.sendToBack()

var originalNumber = number(false)
var copyNumber = number(true)

var toggleFactor = new ToggleButton(toggleFactorPosition, 1.05, 1, redColor, lightGrayColor, '', '', scale, factorSwitch, true);
var separatorButton = new IconMenu(new Point(5, 1.55)*scale, 'grid', .08, separatorSwitch)

// onKeyDown
function onKeyDown(event) {

    if (event.key != 'a') {
        legend.visible = false;
        legendBackground.visible = false;
        catPic.visible = false;
    }

    if (event.key == 'a') { displayHelp() }
    if (event.key == 'space') { factorSwitch() }
    if (event.key == 'g') { separatorGroup.visible = !separatorGroup.visible }
    if (event.key == 'left') {
        copyNumber.position.x -= scale
        copyNumber.position.x = Math.max(copyNumber.position.x, (slideNumberPosition.x - 8)*scale)
        refreshZeroList(copyNumber.children[0])
        currentOrder = slideNumberPosition.x - Math.floor(copyNumber.children[0].position.x/scale)
        coma.visible = 0 > currentOrder
        comaState = 0 > currentOrder
        refreshFactor(currentOrder)
    }
    if (event.key == 'right') {
        copyNumber.position.x += scale
        copyNumber.position.x = Math.min(copyNumber.position.x, (slideNumberPosition.x + 5)*scale)
        refreshZeroList(copyNumber.children[0])
        currentOrder = slideNumberPosition.x - Math.floor(copyNumber.children[0].position.x/scale)
        coma.visible = 0 > currentOrder
        comaState = 0 > currentOrder
        refreshFactor(currentOrder)
    }

}

var comaState
var displayHelp = function() {
    legend.visible = !legend.visible;
    legendBackground.visible = !catPic.visible;
    catPic.visible = !catPic.visible;
    if(coma.visible && legend.visible) {
        comaState = true
        coma.visible = false
    }
    if(comaState && !legend.visible) {
        coma.visible = true
    }
}

// Legend
var legend = new PointText({
    point: [legendTopLeft.x*scale, legendTopLeft.y*scale],
    content:
    '\n\n' +
    'Souris :\n\n' +
    '-> change les chiffres du nombre du haut (cliquez)\n' +
    '-> déplace le nombre du bas (déplacez) \n' +
    '-> affiche le chiffre et le nombre d\'unités,\n de centaines, de dizaines, ..., de dixièmes, de millièmes, ... (survolez)\n\n' +
    'Raccourcis claviers :\n\n'  +
    'a : affiche l\'aide\n' +
    'g : active/désactive la grille des unités\n' +
    'Espace : avec ou sans le facteur multiplicatif\n' +
    'Flèches gauche et droite : déplace le nombre du bas',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25
});

legend.onMouseDown = function(event) { 
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
    catPic.visible = !catPic.visible;
    separatorGroup.visible = true
    separatorButton.visible = true
    if(comaState) {
        coma.visible = true
    }
};

var legendBackground = new Path.Rectangle(new Rectangle(new Point(0,0), legend.bounds.size + new Size(20*scale, 20*scale)));
legendBackground.fillColor = '#ffffff';
legend.bringToFront();

// logo
var catPic = new Raster('logo');
catPic.position = legend.bounds.topRight + new Point(-2*scale, .5*scale);
catPic.scale(0.1);
catPic.bringToFront();

function onMouseMove(event) {
	mousePos = event.point;
    if (Math.floor(mousePos.y/scale) === 4 && separatorGroup.visible) {
        originalNumber.visible = false
    } else {
        originalNumber.visible = true
    }
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

disableScroll()