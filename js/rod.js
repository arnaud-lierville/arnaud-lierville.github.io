/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* GLOBALS VARS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

var planWidth = 28;
var planHeight = 18;
var gridScale = 45;
var gridFillColor = '#74abb5';
var xTopLegend = gridScale;
var yTopLegend = gridScale;
var rodStrokeWidth = gridScale/15;
var rodStrokeColor = '#D3D3D3';
var colorRod = ['#f2e1c9', '#e71f43', '#9fc94d', '#f487ab', '#fff035', '#118550', '#100f17', '#9d3b37','#1a7cba', '#f17331'];
var longRodColor = '#A3A3A3'

var rodGroup = new Group();
var gridGroup = new Group();
var menuGroup = new Group();
var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };

var activeRod = null;
var isGridVisible = false;
var keySequence = ''
var sequenceFlag = false
var allRodsRevelead = false
var isMagic = false

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* SETUP FUNCTIONS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// gridSetup
function gridSetup(gridScale, gridFillColor) {
    for (var y = 3; y < planHeight; y++) {
    	for(var x = 1; x < planWidth; x++) {
            var circle = new Path.Circle({ center: new Point(x, y)*gridScale, radius: 2, fillColor: gridFillColor });
            gridGroup.addChild(circle);
    	};
    };
    gridGroup.sendToBack();
};

// setupRodMenu
function setupRodMenu() { for(var l = 1; l<11; l++) { menuGroup.addChild(new MenuRod(l)); } };

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* SCENE ELEMENTS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// longRodInput
var longRodInput = new PointText({ point: [20*gridScale, 1.9*gridScale], fillColor: '#666666', fontSize: 50, visible: false });

// Legend
var legend = new PointText({
    point: [3.5*gridScale, 3.5*gridScale],
    content: 
    'Souris et raccourcis claviers :\n'  +
    '\n'  +
    'h : affiche l\'aide\n' +
    'm : affiche le menu\n' +
    'g : active/désactive la grille\n' +
    'Flèches : déplace la réglette\n' +
    'Espace ou double-click : pivote la réglette\n' +
    'Click : active la réglette\n' +
    'Entrer : désactive la réglette\n' +
    'Supprimer : supprime la réglette\n' +
    '1, 2, 3, ... : crée la réglette 1, 2, 3, ...\n' +
    'a, z, e, r, t, y, ... : crée le tapis 1, 2, 3, ...\n' +
    'l + x + touche entrée : crée une barre de x jusqu\' 25\n' +
    'x : magix ! => montre/cache les valeurs des réglettes\n'  +
    's : crée l\'escalier\n'  +
    'c : efface tout\n',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25,
    onMouseDown: function(event) { 
        if (activeRod) { activeRod.levitate(false) };
        switchLegend()
    }
});

// legendBackground
var legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft*0.8, legend.bounds.size*1.1));
legendBackground.fillColor = '#ffefd6';
legend.bringToFront();

// logo
var catPic = new Raster('logo');
catPic.position = legend.bounds.topRight + new Point(-60, 80);
catPic.scale(0.1);
catPic.bringToFront();

//switchLegend and legendBackground anc catPic function
var switchLegend = function() {
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
    catPic.visible = !catPic.visible;
}

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* CLASSES */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// Rod Class
var Rod = Base.extend({
    initialize: function(x, y, l) {
        rod = null
        if(l>0) {
            var rodRectangle = new Rectangle(new Point((x+1)*gridScale, (y+3)*gridScale), new Size(l*gridScale, gridScale));
            var rod = new Path.Rectangle(rodRectangle);
            rod.currentColor = longRodColor;
            if(l<11) { rod.currentColor = colorRod[l-1]; }
            rod.fillColor = rod.currentColor;
            rod.rodValue = new PointText({ fillColor: rod.currentColor, content: parseInt(l), fontSize: 40, visible: false });
            rod.strokeColor = rodStrokeColor;
            rod.strokeWidth = rodStrokeWidth;
            rod.selected = false;
            rod.isSelectable = true;
            rod.isUP = false;
            rod.rodLength = l;
            rod.parity = l%2;
            rod.flip = function() {
                this.show(false)
                if (this.rodLength !=1) {
                    if (this.isUP) {
                        this.rotate(90, this.bounds.bottomLeft);
                        this.isUP = false;
                        this.rodValue.fontSize = 40
                    } else {
                        this.rotate(-90, this.bounds.topLeft);
                        this.isUP = true;
                        if(this.rodLength > 9) { this.rodValue.fontSize = 33 }
                    };
                };
                this.show(allRodsRevelead)
            };
            rod.onDoubleClick = function(event) {  if (event.point.y > 2*gridScale) { this.flip(); } }
            rod.levitate = function(bool) {
                if(bool) {
                    rod.shadowColor = new Color(0, 0, 0);
                    rod.shadowBlur = 12;
                    rod.shadowOffset = new Point(5, 5);
                    rod.bringToFront();
                } else {
                    rod.shadowColor = null;
                    activeRod = null;
                }
            }
            rod.levitate(true)
            rod.show = function(isON) {
                if(isON) {
                    this.fillColor = '#FFFFFF'
                    rod.rodValue.position.x = this.position.x
                    var epsilon = 0
                    if(!this.isUP || this.rodLength == 1) { epsilon = .05*gridScale }
                    rod.rodValue.position.y = this.position.y + epsilon
                    rod.rodValue.visible = true
                } else {
                    this.fillColor = this.currentColor
                    rod.rodValue.visible = false
                }
            }
            rod.show(allRodsRevelead)
            rod.delete = function() {
                this.rodValue.remove()
                this.remove()
            }
        rodGroup.addChild(rod);
        }
        return rod;
    }
})

// IconMenu Class
var IconMenu = Base.extend({
    initialize: function(point, name, scale, callback) {
        var picture = new Raster(name);
        picture.position = point;
        picture.scale(scale)
        picture.onMouseDown = function() {
            turnOFFLegend();
            callback();
        }
        return picture;
    }
})

// MenuRod Class
var MenuRod = Base.extend({
    initialize: function(l) {
        var menuRod = new Path.Rectangle(new Rectangle(new Point(xTopLegend + (l-1)*gridScale, yTopLegend), new Size(gridScale, gridScale)));
        menuRod.fillColor = colorRod[l-1];
        menuRod.strokeColor = rodStrokeColor;
        menuRod.strokeWidth = rodStrokeWidth;
        menuRod.selected = false;
        menuRod.isSelectable = false;
        menuRod.onMouseDown = function(event) { activeRod = createRod(l); };
        return menuRod
    }
})

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* MAIN FUNCTIONS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// createRod
function createRod(l) {
    turnOFFLegend()
    if (activeRod) { activeRod.levitate(false) };
    var x = Math.floor(Math.random() * 10);
    var y = Math.floor(Math.random() * 10)%12;
    var rod = new Rod(x, y, l)
    return rod;
};

// // hits beetween rods
// function turnToColorRodsHittedByActiveRod() {
//     console.log('turnToColorRodsHittedByActiveRod')
//     if (activeRod) {
//         for(var index in rodGroup.children) { 
//             var rod = rodGroup.children[index]
//             var intersections = rod.getIntersections(activeRod);
//             if(intersections.length > 2) { rod.show(false) } else { rod.show(allRodsRevelead) }
//         }
//     };
// }

// resetKeySequence
function resetKeySequence() {
    sequenceFlag = false
    keySequence = ''
    longRodInput.visible = false
}

// turnOFFLegend
function turnOFFLegend() {
    legend.visible = false;
    legendBackground.visible = false;
    catPic.visible = false;
}

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* CARPET AND STAIRS FUNCTIONS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// carpet
function carpet(letter) {
    if (activeRod) { activeRod.levitate(false) }
    var letterToNumber = { a: 1,  z: 2, e: 3, r:4, t:5, y:6, u:7, i:8, o:9, p:10 }
    var n = letterToNumber[letter]
    for (i = 0; i < n+1; i++) {
        activeRod = Rod(1,1+i - 1,i) // left rod
        rodGroup.addChild(activeRod);
        if (activeRod) { activeRod.levitate(false) }
        activeRod = Rod(i + 1,1+i - 1,n-i) // right rod
        rodGroup.addChild(activeRod);
        if (activeRod) { activeRod.levitate(false) }
    }
}

// stairs
function stairs() {
    if (activeRod) { activeRod.levitate(false) }
    var rod = new Rod(1,9,1)
    rodGroup.addChild(activeRod);
    rod.flip()
    rod.levitate(false)
    for (i = 2; i < 11; i++) {
        var rod = new Rod(i,10,i)
        rod.flip()
        rod.levitate(false)
    }
}

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* MOUSE */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

//onMouseDown
function onMouseDown(event) {
    resetKeySequence()
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) { 
        if (activeRod) { activeRod.levitate(false) }
        if (legend.visible) { switchLegend() }
        return; 
    } else {
        if (hitResult.type == 'fill') {
            thisItem = hitResult.item;
            if (thisItem.isSelectable) {
                if (activeRod) { activeRod.levitate(false) };
                activeRod = thisItem;
                activeRod.levitate(true)
            };
        };
    };
};

// onMouseDrag
function onMouseDrag(event) {
    resetKeySequence()
	if (activeRod) {
        activeRod.show(false)
	    activeRod.position += event.delta;
	};
};

// onMouseUp
function onMouseUp(event) {
    resetKeySequence()
    if (activeRod) {
        // moving detect
        if (event.delta.x != 0 || event.delta.y != 0) {
            var x = activeRod.position.x;
            var y = activeRod.position.y;
            // shiftSpaceForMenu
            var shiftSpaceForMenu = Math.floor(activeRod.rodLength/2)+3;
            if (activeRod.isUP) {
                activeRod.position.x = (Math.floor(x/gridScale) + 0.5)*gridScale;
                activeRod.position.y = (Math.max((Math.floor(y/gridScale)), shiftSpaceForMenu) + activeRod.parity*.5)*gridScale;
            } else {
                activeRod.position.x = (Math.floor(x/gridScale) + activeRod.parity*0.5)*gridScale;
                activeRod.position.y = (Math.max((Math.floor(y/gridScale)), 3) + 0.5)*gridScale;
            };
        };
        activeRod.show(allRodsRevelead)
    };
};

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* KEYBOARD */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// onKeyDown
function onKeyDown(event) {
    if(event.key == 'l' || (sequenceFlag && event.key == 'enter') || sequenceFlag) {
        turnOFFLegend()
        if (activeRod) { activeRod.levitate(false) }
        sequenceFlag = true
        if(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) { keySequence += event.key }
        longRodInput.content = 'l = ' + keySequence
        longRodInput.visible = true && menuGroup.visible
        if(event.key == 'enter') {
            var l = parseInt(keySequence)
            if(!isNaN(l) && l<26) { activeRod = createRod(keySequence) }
            resetKeySequence()
        }
    } else {
        console.log('key: ' + event.key);
        if (legend.visible && event.key != 'h') { switchLegend() }
        if (event.key == 'up') {
            if (activeRod) {
                activeRod.show(false)
                activeRod.position.y -= gridScale;
                activeRod.show(allRodsRevelead)
            };
        };
        if (event.key == 'down') {
            if (activeRod) {
                activeRod.show(false)
                activeRod.position.y += gridScale;
                activeRod.show(allRodsRevelead)
            };
        };
        if (event.key == 'left') {
            if (activeRod) {
                activeRod.show(false)
                activeRod.position.x -= gridScale;
                activeRod.show(allRodsRevelead)
            };
        };
        if (event.key == 'right') {
            if (activeRod) {
                activeRod.show(false)
                activeRod.position.x += gridScale;
                activeRod.show(allRodsRevelead)
            };
        };
        // enter : unactive rod
        if (event.key == 'enter' && activeRod) { activeRod.levitate(false) };
        // Flip a rod
        if (event.key == 'space') { rotateCallback() };
        // Delete a rod
        if (event.key == 'backspace') { deleteCallback() };
        // Reset the scene
        if (event.key == 'c') { trashCallback() };
        // Grid : on/off
        if (event.key == 'g') { gridCallback() };
        // h : legend
        if (event.key == 'h') { helpCallback() };
        // m : menu
        if (event.key == 'm') { menuCallback() };
        // create stair
        if (event.key == 's') { stairs(); };
        // swtich colors/numbers (magix)
        if (event.key == 'x') {  magicCallback(); };
        // create rod by key
        if(['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) { activeRod = createRod(parseInt(event.key)); }
        if (event.key == '0') { activeRod = createRod(10); };
        // create carpet by bey
        if(['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].includes(event.key)) { carpet(event.key); }
    };
}

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* CALLBACKS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

var menuCallback = function() {
    console.log('menuCallback');
    longRodInput.visible = !menuGroup.visible
    menuGroup.visible = !menuGroup.visible;
}

var gridCallback = function() {
    console.log('gridCallback');
    if (isGridVisible) {
        isGridVisible = false;
        gridGroup.removeChildren();
    } else {
        isGridVisible = true;
        gridSetup(gridScale, gridFillColor);
    };
}

var magicCallback = function() {
    console.log('magicCallback');
    isMagic = !isMagic
    iconMagic.visible = !isMagic
    iconMagicColor.visible = isMagic
    if (activeRod) { activeRod.levitate(false) };
    allRodsRevelead = !allRodsRevelead
    for(var index in rodGroup.children) { rodGroup.children[index].show(allRodsRevelead) }
}

var rotateCallback = function() {
    console.log('rotateCallback');
    if (activeRod) { activeRod.flip(); };
}

var deleteCallback = function() {
    console.log('deleteCallback');
    if (activeRod) { 
        activeRod.delete();
        activeRod = null;
    };
}

var trashCallback = function() {
    console.log('trashCallback');
    var tempRodValueGroup = new Group()
    for(var index in rodGroup.children) { tempRodValueGroup.addChild(rodGroup.children[index].rodValue) }
    tempRodValueGroup.remove()
    rodGroup.removeChildren()
}

var helpCallback = function() {
    console.log('helpCallback');
    switchLegend()
}

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* MAKE THE SCENE */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

disableScroll();
setupRodMenu(xTopLegend, yTopLegend, gridScale);

/* Icon menu */

var iconMenuData = {
    menu: [13, 'menu', .06, menuCallback],
    grid: [14, 'grid', .08, gridCallback],
    rotate: [16, 'rotate', .08, rotateCallback],
    delete: [17, 'delete', .08, deleteCallback],
    trash: [18, 'trash', .08, trashCallback],
    help: [19, 'help', .08, helpCallback],
}

for (var menu in iconMenuData) { new IconMenu(new Point(iconMenuData[menu][0], 1.5)*gridScale, iconMenuData[menu][1], iconMenuData[menu][2], iconMenuData[menu][3]) }
var iconMagic = new IconMenu(new Point(15.1, 1.5)*gridScale, 'magic', .1, magicCallback)
var iconMagicColor = new IconMenu(new Point(15.1, 1.5)*gridScale, 'magicolor', .1, magicCallback)
iconMagicColor.visible = false

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* OTHERS TOOLS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

function disableScroll() { 
    // Get the current page scroll position 
    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
    // if any scroll is attempted, set this to the previous value 
    window.onscroll = function() {  window.scrollTo(scrollLeft, scrollTop); }; 
}