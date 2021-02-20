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

/* Scenes objects and functions */

// Grid separator
var separatorGroup = new Group()

var unitText = function(text, x) {

    var that = new PointText(new Point(x*scale, (slideNumberPosition.y - 1)*scale))
    that.justification = 'center'
    that.fillColor = 'black'
    that.content = text
    that.fontFamily = 'sans-serif'
    that.fontSize = scale*.7
    that.position.x = Math.floor(that.position.x/scale)*scale + scale/2
    that.position.y = Math.floor(that.position.y/scale)*scale + scale/2 - .1*scale
    that.visible = true

    return that
}

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

    var ut1 = unitText('m', 16)
    var ut2 = unitText('c', 15)
    var ut3 = unitText('d', 14)
    var ut4 = unitText('U', 13)
    ut4.fillColor = unityColor
    var ut5 = unitText('D', 12)
    var ut6 = unitText('C', 11)
    var ut7 = unitText('M', 10)

    separatorGroup.addChildren([path, ut1, ut2, ut3, ut4, ut5, ut6, ut7])
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
            if (-11 < order < 10 && that.content != '_') {
                copyNumber.position.x += event.delta.x
                coma.visible = 0 > order
                coma.bringToFront()
                refreshZeroList(this)
                refreshFactor(order)
            }
        }
        that.onMouseUp = function() {
            copyNumber.position.x = Math.min(Math.floor(this.position.x/scale - 2)*scale, (slideNumberPosition.x + 10)*scale)
            copyNumber.position.x = Math.max(Math.floor(this.position.x/scale - 2)*scale, (slideNumberPosition.x - 8)*scale)
            if (copyNumber.position.y/scale <= slideNumberPosition.y + offset) {
                coma.visible = false
                copyNumber.position.x = (slideNumberPosition.x - 2)*scale
            }
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
separatorGroup.visible = false

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
}

var displayHelp = function() {
    legend.visible = !legend.visible;
    legendBackground.visible = !catPic.visible;
    catPic.visible = !catPic.visible;
}

// Legend
var legend = new PointText({
    point: [legendTopLeft.x*scale, legendTopLeft.y*scale],
    content:
    '\n\n' +
    'Souris :\n\n' +
    '-> permet de changer les chiffres du nombre du haut (clic)\n' +
    '-> permet de déplacer le nombre du bas (drag) \n\n' +
    'Raccourcis claviers :\n\n'  +
    'a : affiche l\'aide\n' +
    'Espace : avec ou sans le facteur multiplicatif',
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
};

var legendBackground = new Path.Rectangle(new Rectangle(new Point(0,0), legend.bounds.size + new Size(20*scale, 20*scale)));
legendBackground.fillColor = '#ffffff';
legend.bringToFront();

// logo
var catPic = new Raster('logo');
catPic.position = legend.bounds.topRight + new Point(-2*scale, .5*scale);
catPic.scale(0.1);
catPic.bringToFront();

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