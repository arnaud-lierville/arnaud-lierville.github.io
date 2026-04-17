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
var rodStrokeColor = '#a8a8a8';
var rodStrokeColorLight = '#F6F6F6'
var secretColor = '#7E7E7E';
var colorRod = ['#f2e1c9', '#e71f43', '#9fc94d', '#f487ab', '#fff035', '#118550', '#100f17', '#9d3b37','#1a7cba', '#f17331'];
var longRodColor = '#A3A3A3'

var palette1 = ['#f2e1c9','#e71f43','#9fc94d','#f487ab','#fff035','#118550','#100f17','#9d3b37','#1a7cba','#f17331'];
var palette2 = ['#f2e1c9','#e71f43','#9fc94d','#7B2FBE','#fff035','#118550','#100f17','#9d3b37','#1a7cba','#f17331'];
var palette_gray = ['#cecece','#bababa','#a6a6a6','#929292','#7e7e7e','#6a6a6a','#565656','#424242','#2e2e2e','#1a1a1a'];
var paletteCustom = palette_gray.slice();
var currentPaletteIndex = 0;

var unity = 0 // 0 for UN

var rodGroup = new Group();
var gridGroup = new Group();
var menuGroup = new Group();
var menuGroupSecret = new Group();
var iconMenuGroup = new Group();
var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };

var activeRod = null;
var isGridVisible = false;
var keySequence = ''
var sequenceFlag = false
var allRodsRevelead = false
var isMagic = false
var isIncognito = false
var isSymplify = false
var clickDownTime = undefined
var clickUpTime = undefined

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
function setupRodMenu() { 
    for(var l = 1; l<11; l++) {
        menuGroupSecret.addChild(new MenuRodSecret(l));
        menuGroupSecret.visible = false
        menuGroup.addChild(new MenuRod(l));
    }
};

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* SCENE ELEMENTS */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

// longRodInput
var longRodInput = new PointText({ point: [12.5*gridScale, 3.3*gridScale], fillColor: '#666666', fontSize: 50, visible: false });

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
    'Click long : retourne la réglette\n' +
    'Supprimer : supprime la réglette\n' +
    '1, 2, 3, ... : crée la réglette 1, 2, 3, ...\n' +
    'a, z, e, r, t, y, ... : crée le tapis 1, 2, 3, ...\n' +
    'l + x + touche entrée : crée une barre de x jusqu\' 25\n' +
    'x : magix ! => montre/cache les valeurs des réglettes\n'  +
    'w : secret ! => pour créer des réglettes mystères\n'  +
    'n : unité => change de barre pour l\'unité\n'  +
    'f : simplifie => change de mode fractions simplifiées ou non\n'  +
    's : crée l\'escalier\n'  +
    'k : choix de palette\n'  +
    'c : efface tout',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 20,
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

var RodLabel = Base.extend({
    initialize: function(fillColor, l, fontSize, toSimplify) {
        var rodLabel = new Group()

        function gcd(a, b) {
            if (!b) {
                return a;
            }
            return gcd(b, a % b);
        }

        if((l%(unity+1) == 0)) {
            var textLabel = new PointText({ fillColor: fillColor, content: parseInt(l/(unity+1)), fontSize: fontSize, visible: true });
            rodLabel.addChild(textLabel)
        } else {
            var p = parseInt(l)
            var q = unity+1
            if(toSimplify) {
                var gcd = gcd(p,q)
                p = p/gcd
                q = q/gcd
            }

            var bar = new PointText({ fillColor: fillColor, content: "—", fontSize: fontSize*30/40, visible: true });
            var numerator = new PointText({ fillColor: fillColor, content: p, fontSize: fontSize*23/40, visible: true });
            numerator.position.x = bar.position.x
            numerator.position.y = bar.position.y - 9*fontSize/40
            var denominator = new PointText({ fillColor: fillColor, content: q, fontSize: fontSize*23/40, visible: true });
            denominator.position.x = bar.position.x
            denominator.position.y = bar.position.y + 13*fontSize/40
            rodLabel.addChild(numerator)
            rodLabel.addChild(bar)
            rodLabel.addChild(denominator)
        }
        return rodLabel
    }
})

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
            rod.isSymplify = isSymplify
            rod.rodValue = new RodLabel(rod.currentColor, l, 40, rod.isSymplify)
            rod.rodValue.onClick = function() { 
                if (activeRod) { activeRod.levitate(false) };
                activeRod = rod;
                activeRod.levitate(true)
            }
            rod.strokeColor = rodStrokeColor;
            rod.strokeWidth = rodStrokeWidth;
            rod.selected = false;
            rod.isSelectable = true;
            rod.isUP = false;
            rod.isSecret = false;
            rod.rodLength = l;
            rod.parity = l%2;
            rod.updateLabel = function() {
                rod.rodValue.remove()
                var newLabelFontSize = 40
                if(this.rodLength > 9 && this.isUP) { 
                    newLabelFontSize = 33
                 }
                rod.rodValue = new RodLabel(rod.currentColor, l, newLabelFontSize, rod.isSymplify)
                rod.rodValue.onClick = function() { 
                    if (activeRod) { activeRod.levitate(false) };
                    activeRod = rod;
                    activeRod.levitate(true)
                }
                rod.show(allRodsRevelead)
            }
            rod.flip = function() {
                rod.show(false);
                if (rod.rodLength !=1) {
                    if (rod.isUP) {
                        rod.rotate(90, rod.bounds.bottomLeft);
                        rod.isUP = false;
                        rod.rodValue = new RodLabel(rod.currentColor, rod.rodLength, 40, rod.isSymplify)
                        rod.rodValue.onClick = function() { 
                            if (activeRod) { activeRod.levitate(false) };
                            activeRod = rod;
                            activeRod.levitate(true)
                        }
                    } else {
                        rod.rotate(-90, rod.bounds.topLeft);
                        rod.isUP = true;
                        if(rod.rodLength > 9) { 
                            rod.rodValue = new RodLabel(rod.currentColor, rod.rodLength, 33, rod.isSymplify)
                            rod.rodValue.onClick = function() { 
                                if (activeRod) { activeRod.levitate(false) };
                                activeRod = rod;
                                activeRod.levitate(true)
                            }
                         }
                    };
                };
                rod.show(allRodsRevelead)
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
                if(isON) {  // TURN VALUE VISIBLE
                    this.fillColor = '#FFFFFF'
                    rod.rodValue.position.x = this.position.x
                    var epsilon = 0
                    if(!this.isUP || this.rodLength == 1) { epsilon = .05*gridScale }
                    rod.rodValue.position.y = this.position.y + epsilon
                    rod.rodValue.visible = true
                } else {  // TURN COLOR VISIBLE
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

// RodRodSecret Class
var RodSecret = Base.extend({
    initialize: function(x, y, l) {
        rod = null
        if(l>0) {
            var rodRectangle = new Rectangle(new Point((x+1)*gridScale, (y+3)*gridScale), new Size(l*gridScale, gridScale));
            var rod = new Path.Rectangle(rodRectangle);
            rod.currentColor = longRodColor;
            if(l<11) { rod.currentColor = colorRod[l-1]; }
            rod.fillColor = rod.currentColor;
            rod.isSymplify = isSymplify
            rod.rodValue = new RodLabel(rod.currentColor, l, 40, rod.isSymplify)
            rod.rodValue.onClick = function() { 
                if (activeRod) { activeRod.levitate(false) };
                activeRod = rod;
                activeRod.levitate(true)
            }
            rod.secret = new PointText({ fillColor: secretColor, content: '?', fontSize: 40, visible: false });
            rod.secret.onClick = function() { 
                if (activeRod) { activeRod.levitate(false) };
                activeRod = rod;
                activeRod.levitate(true)
            }
            rod.strokeColor = rodStrokeColor;
            rod.strokeWidth = rodStrokeWidth;
            rod.selected = false;
            rod.isSelectable = true;
            rod.isUP = false;
            rod.isSecret = true;
            rod.rodLength = l;
            rod.parity = l%2;
            rod.updateLabel = function() {
                rod.rodValue.remove()
                var newLabelFontSize = 40
                if(this.rodLength > 9 && this.isUP) { 
                    newLabelFontSize = 33
                 }
                rod.rodValue = new RodLabel(rod.currentColor, l, newLabelFontSize, rod.isSymplify)
                rod.rodValue.onClick = function() { 
                    if (activeRod) { activeRod.levitate(false) };
                    activeRod = rod;
                    activeRod.levitate(true)
                }
                rod.show(allRodsRevelead)
            }
            rod.flip = function() {
                rod.show(false);
                if (rod.rodLength !=1) {
                    if (rod.isUP) {
                        rod.rotate(90, rod.bounds.bottomLeft);
                        rod.isUP = false;
                        rod.rodValue = new RodLabel(rod.currentColor, rod.rodLength, 40, rod.isSymplify)
                        rod.rodValue.onClick = function() { 
                            if (activeRod) { activeRod.levitate(false) };
                            activeRod = rod;
                            activeRod.levitate(true)
                        }
                    } else {
                        rod.rotate(-90, rod.bounds.topLeft);
                        rod.isUP = true;
                        if(rod.rodLength > 9) { 
                            rod.rodValue = new RodLabel(rod.currentColor, rod.rodLength, 33, rod.isSymplify)
                            rod.rodValue.onClick = function() { 
                                if (activeRod) { activeRod.levitate(false) };
                                activeRod = rod;
                                activeRod.levitate(true)
                            }
                         }
                    };
                };
                rod.show(allRodsRevelead)
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
                if(isON) {  // TURN VALUE VISIBLE
                    this.fillColor = '#FFFFFF'
                    rod.rodValue.position.x = this.position.x
                    var epsilon = 0
                    if(!this.isUP || this.rodLength == 1) { epsilon = .05*gridScale }
                    rod.rodValue.position.y = this.position.y + epsilon
                    rod.rodValue.visible = true
                    rod.secret.visible = false
                } else {    // TURN SECRET VISIBLE
                    this.fillColor = '#FFFFFF'
                    rod.secret.position.x = this.position.x
                    var epsilon = 0
                    if(!this.isUP || this.rodLength == 1) { epsilon = .05*gridScale }
                    rod.secret.position.y = this.position.y + epsilon
                    rod.secret.visible = true
                    rod.rodValue.visible = false
                }
            }
            rod.show(allRodsRevelead)
            rod.delete = function() {
                this.rodValue.remove()
                this.secret.remove()
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
        menuRod.label = new PointText({ fillColor: "#FFFFFF", content: "1", fontSize: 30, visible: false });
        menuRod.label.position = menuRod.position
        menuRod.fillColor = colorRod[l-1];
        menuRod.strokeColor = rodStrokeColor;
        menuRod.strokeWidth = rodStrokeWidth;
        menuRod.selected = false;
        menuRod.isSelectable = false;
        menuRod.rodLength = l;
        menuRod.onMouseDown = function(event) { activeRod = createRod(l); };
        menuRod.label.onMouseDown = function(event) { activeRod = createRod(l); };
        return menuRod
    }
})

// MenuRodSecret Class
var MenuRodSecret = Base.extend({
    initialize: function(l) {
        var menuRod = new Path.Rectangle(new Rectangle(new Point(xTopLegend + (l-1)*gridScale, yTopLegend), new Size(gridScale, gridScale)));
        menuRod.fillColor = '#FFFFFF';
        menuRod.strokeColor = rodStrokeColorLight;
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
    var rod
    if(isIncognito) {
        rod = new RodSecret(x, y, l)
    } else {
        rod = new Rod(x, y, l)
    }
    return rod;
};

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
        // left rod
        if(isIncognito) {
            activeRod = RodSecret(1,1+i - 1,i) 
        } else {
            activeRod = Rod(1,1+i - 1,i) 
        }
        rodGroup.addChild(activeRod);
        if (activeRod) { activeRod.levitate(false) }
        // right rod
        if(isIncognito) {
            activeRod = RodSecret(i + 1,1+i - 1,n-i)
        } else {
            activeRod = Rod(i + 1,1+i - 1,n-i) 
        }
        rodGroup.addChild(activeRod);
        if (activeRod) { activeRod.levitate(false) }
    }
}

// stairs
function stairs() {
    if (activeRod) { activeRod.levitate(false) }
    if(isIncognito) {
        var rod = new RodSecret(1,9,1)
    } else {
        var rod = new Rod(1,9,1)
    }
    rodGroup.addChild(activeRod);
    rod.flip()
    rod.levitate(false)
    for (i = 2; i < 11; i++) {
        if(isIncognito) {
            var rod = new RodSecret(i,10,i)
        } else {
            var rod = new Rod(i,10,i)
        }
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
                clickDownTime = Date.now()
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
            clickDownTime = undefined
            clickUpTime = undefined
            activeRod.show(allRodsRevelead)
        } else {
            activeRod.show(allRodsRevelead)
            clickUpTime = Date.now()
            if(clickDownTime && clickUpTime && clickUpTime - clickDownTime > 550) { activeRod.show(!allRodsRevelead) }
            clickDownTime = undefined
            clickUpTime = undefined
        }
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
        // Clear the scene
        if (event.key == 'k') { paletteCallback() };
        // Display palette choices
        if (event.key == 'g') { gridCallback() };
        // h : legend
        if (event.key == 'h') { helpCallback() };
        // m : menu
        if (event.key == 'm') { menuCallback() };
        // create stair
        if (event.key == 's') { stairs(); };
        // switch colors/numbers (magix)
        if (event.key == 'x') { magicCallback(); };
        // switch secret
        if (event.key == 'w') { incognitoCallback(); };
        // up unity
        if (event.key == 'n') { changeUnityCallback(); };
        // up unity
        if (event.key == 'f') { simplifyCallback(); };
        // switch rodValue on active rod
        if (event.key == 'b') {  if(activeRod) { activeRod.show(!allRodsRevelead)} };
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
    iconIncognito.visible = !isMagic
    iconMagicColor.visible = isMagic
    if (activeRod) { activeRod.levitate(false) };
    allRodsRevelead = !allRodsRevelead
    for(var index in rodGroup.children) { rodGroup.children[index].show(allRodsRevelead) }
}

var incognitoCallback = function() {
    console.log('incognitoCallback');
    isIncognito = !isIncognito
    iconIncognito.visible = !isIncognito
    iconIncognitoColor.visible = isIncognito
    iconMenuGroup.visible = !isIncognito
    iconUnity.visible = !isIncognito
    menuGroup.visible = !isIncognito
    menuGroupSecret.visible = isIncognito
    if (activeRod) { activeRod.levitate(false) };
}

var changeUnityCallback = function() {
    console.log('changeUnityCallback');
    menuGroup.children[unity].label.visible = false
    unity = (unity + 1)%10
    if(unity != 0) {
        menuGroup.children[unity].label.visible = true
    }
    updateRodGroupValue()
}

var simplifyCallback = function() {
    console.log('simplifyCallback');
    isSymplify = !isSymplify
    iconSimplify.visible = !isSymplify
    iconSimplifyColor.visible = isSymplify
    if (activeRod) { activeRod.levitate(false) };
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
    for(var index in rodGroup.children) { 
        tempRodValueGroup.addChild(rodGroup.children[index].rodValue)
        tempRodValueGroup.addChild(rodGroup.children[index].secret)
     }
    tempRodValueGroup.remove()
    rodGroup.removeChildren()
}

var updateRodGroupValue = function() {
    for(var index in rodGroup.children) { rodGroup.children[index].updateLabel() }
}

var helpCallback = function() {
    console.log('helpCallback');
    switchLegend()
}

function loadPaletteFromStorage() {
    var hash = window.location.hash;
    if (hash.length > 9 && hash.slice(0, 9) === '#palette=') {
        var hexList = hash.slice(9).split(',');
        if (hexList.length === 10) {
            paletteCustom = hexList.map(function(h) { return '#' + h; });
            currentPaletteIndex = 2;
            for (var i = 0; i < 10; i++) { colorRod[i] = paletteCustom[i]; }
            return;
        }
    }
    try {
        var stored = localStorage.getItem('rodPalette');
        if (stored) {
            var data = JSON.parse(stored);
            if (data.custom && data.custom.length === 10) { paletteCustom = data.custom; }
            currentPaletteIndex = data.index || 0;
            var activePal = currentPaletteIndex === 0 ? palette1 : (currentPaletteIndex === 1 ? palette2 : paletteCustom);
            for (var i = 0; i < 10; i++) { colorRod[i] = activePal[i]; }
            if (currentPaletteIndex === 2) {
                var hex = paletteCustom.map(function(c) { return c.replace('#', ''); }).join(',');
                window.location.hash = 'palette=' + hex;
            }
        }
    } catch(e) {}
}

function applyPalette(colors) {
    for (var i = 0; i < 10; i++) { colorRod[i] = colors[i]; }
    for (var i = 0; i < menuGroup.children.length; i++) {
        var item = menuGroup.children[i];
        if (item.rodLength) { item.fillColor = colorRod[item.rodLength - 1]; }
    }
    for (var i = 0; i < rodGroup.children.length; i++) {
        var item = rodGroup.children[i];
        if (item.rodLength && item.rodLength < 11) {
            item.currentColor = colorRod[item.rodLength - 1];
            item.updateLabel();
        }
    }
    try {
        localStorage.setItem('rodPalette', JSON.stringify({
            index: currentPaletteIndex,
            custom: paletteCustom
        }));
    } catch(e) {}
}

function updateSwatches() {
    var allPalettes = [palette1, palette2, paletteCustom];
    for (var pi = 0; pi < 3; pi++) {
        var container = document.getElementById('swatches' + pi);
        if (!container) continue;
        container.innerHTML = '';
        for (var ci = 0; ci < 10; ci++) {
            var s = document.createElement('div');
            s.style.cssText = 'width:22px; height:22px; background:' + allPalettes[pi][ci] + '; border:1px solid #aaa; border-radius:2px;';
            container.appendChild(s);
        }
    }
}

function updateActiveRow() {
    for (var i = 0; i < 3; i++) {
        var row = document.getElementById('palRow' + i);
        if (row) {
            row.style.borderColor = (i === currentPaletteIndex) ? '#555' : 'transparent';
            row.style.background = (i === currentPaletteIndex) ? '#f0f0f0' : 'white';
        }
    }
}

var paletteCallback = function() {
    console.log('paletteCallback');
    var panel = document.getElementById('palettePanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        for (var i = 0; i < 10; i++) {
            var inp = document.getElementById('palColorInput' + i);
            var wrp = document.getElementById('palColorWrapper' + i);
            if (inp) { inp.value = paletteCustom[i]; }
            if (wrp) { wrp.style.background = paletteCustom[i]; }
        }
        updateSwatches();
        updateActiveRow();
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

function initPalettePanel() {
    var panel = document.getElementById('palettePanel');
    panel.style.cssText = [
        'position:fixed',
        'top:120px',
        'left:50%',
        'transform:translateX(-50%)',
        'background:white',
        'border:1px solid #bbb',
        'border-radius:8px',
        'padding:16px',
        'z-index:1000',
        'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
        'font-family:sans-serif',
        'font-size:13px',
        'color:#333',
        'display:none',
        'min-width:780px'
    ].join(';');

    var title = document.createElement('h3');
    title.textContent = 'Palette de couleurs';
    title.style.cssText = 'margin:0 0 12px 0; font-size:14px; font-weight:bold; color:#333;';
    panel.appendChild(title);

    var paletteNames = ['Palette 1 (défaut)', 'Palette 2 (violette)', 'Palette personnalisée'];

    for (var pi = 0; pi < 3; pi++) {
        (function(paletteIndex) {
            var row = document.createElement('div');
            row.id = 'palRow' + paletteIndex;
            row.style.cssText = 'display:flex; align-items:center; margin-bottom:6px; padding:6px 8px; border-radius:5px; border:2px solid transparent; cursor:pointer;';

            var lbl = document.createElement('span');
            lbl.textContent = paletteNames[paletteIndex];
            lbl.style.cssText = 'display:inline-block; width:155px; flex-shrink:0;';
            row.appendChild(lbl);

            var swatches = document.createElement('div');
            swatches.id = 'swatches' + paletteIndex;
            swatches.style.cssText = 'display:flex; gap:2px;';
            row.appendChild(swatches);

            row.addEventListener('click', function() {
                currentPaletteIndex = paletteIndex;
                var pal = paletteIndex === 0 ? palette1 : (paletteIndex === 1 ? palette2 : paletteCustom);
                applyPalette(pal);
                if (paletteIndex < 2) {
                    window.location.hash = '';
                } else {
                    var hex = paletteCustom.map(function(c) { return c.replace('#', ''); }).join(',');
                    window.location.hash = 'palette=' + hex;
                }
                updateSwatches();
                updateActiveRow();
            });

            panel.appendChild(row);

            if (paletteIndex === 2) {
                var inputRow = document.createElement('div');
                inputRow.style.cssText = 'display:flex; align-items:center; padding:4px 8px 8px; border:2px solid transparent;';
                var emptyLabel = document.createElement('span');
                emptyLabel.textContent = 'Modifier ici les couleurs :';
                emptyLabel.style.cssText = 'display:inline-block; width:155px; flex-shrink:0; font-size:12px; font-style:italic; color:#888;';
                inputRow.appendChild(emptyLabel);

                var pickerContainer = document.createElement('div');
                pickerContainer.style.cssText = 'display:flex; gap:2px;';

                for (var ci = 0; ci < 10; ci++) {
                    (function(colorIndex) {
                        var wrapper = document.createElement('div');
                        wrapper.id = 'palColorWrapper' + colorIndex;
                        wrapper.style.cssText = 'width:22px; height:22px; border-radius:2px; border:1px solid #aaa; flex-shrink:0; position:relative; cursor:pointer;';
                        wrapper.style.background = paletteCustom[colorIndex];
                        var inp = document.createElement('input');
                        inp.type = 'color';
                        inp.id = 'palColorInput' + colorIndex;
                        inp.value = paletteCustom[colorIndex];
                        inp.title = 'Réglette ' + (colorIndex + 1);
                        inp.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer;';
                        inp.addEventListener('input', function() {
                            wrapper.style.background = this.value;
                        });
                        wrapper.appendChild(inp);
                        pickerContainer.appendChild(wrapper);
                    })(ci);
                }
                inputRow.appendChild(pickerContainer);

                var grayBtn = document.createElement('button');
                grayBtn.textContent = 'Niveaux de gris';
                grayBtn.style.cssText = 'margin-left:8px; padding:3px 10px; cursor:pointer; border:1px solid #aaa; border-radius:4px; font-size:12px; flex-shrink:0;';
                grayBtn.addEventListener('click', function() {
                    for (var i = 0; i < 10; i++) {
                        var inp = document.getElementById('palColorInput' + i);
                        var wrp = document.getElementById('palColorWrapper' + i);
                        if (inp) { inp.value = palette_gray[i]; }
                        if (wrp) { wrp.style.background = palette_gray[i]; }
                    }
                });
                inputRow.appendChild(grayBtn);

                var applyBtn = document.createElement('button');
                applyBtn.textContent = 'Appliquer';
                applyBtn.style.cssText = 'margin-left:8px; padding:3px 10px; cursor:pointer; border:1px solid #aaa; border-radius:4px; font-size:12px; flex-shrink:0;';
                applyBtn.addEventListener('click', function() {
                    for (var i = 0; i < 10; i++) {
                        var inp = document.getElementById('palColorInput' + i);
                        if (inp) { paletteCustom[i] = inp.value; }
                    }
                    currentPaletteIndex = 2;
                    applyPalette(paletteCustom);
                    var hex = paletteCustom.map(function(c) { return c.replace('#', ''); }).join(',');
                    window.location.hash = 'palette=' + hex;
                    updateSwatches();
                    updateActiveRow();
                });
                inputRow.appendChild(applyBtn);

                var copyBtn = document.createElement('button');
                copyBtn.id = 'palCopyBtn';
                copyBtn.textContent = 'Copier le lien';
                copyBtn.style.cssText = 'margin-left:4px; padding:3px 10px; cursor:pointer; border:1px solid #aaa; border-radius:4px; font-size:12px; min-width:110px; flex-shrink:0;';
                copyBtn.addEventListener('click', function() {
                    var btn = document.getElementById('palCopyBtn');
                    try {
                        navigator.clipboard.writeText(window.location.href).then(function() {
                            btn.textContent = '✓ Copié !';
                            setTimeout(function() { btn.textContent = 'Copier le lien'; }, 2000);
                        });
                    } catch(e) {
                        btn.textContent = '✓ Copié !';
                        setTimeout(function() { btn.textContent = 'Copier le lien'; }, 2000);
                    }
                });
                inputRow.appendChild(copyBtn);
                panel.appendChild(inputRow);
            }
        })(pi);
    }

    var footer = document.createElement('div');
    footer.style.cssText = 'text-align:right; margin-top:10px; padding-top:8px; border-top:1px solid #eee;';
    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fermer';
    closeBtn.style.cssText = 'padding:4px 14px; cursor:pointer; border:1px solid #aaa; border-radius:4px; font-size:12px;';
    closeBtn.addEventListener('click', function() { panel.style.display = 'none'; });
    footer.appendChild(closeBtn);
    panel.appendChild(footer);

    updateSwatches();
    updateActiveRow();
}

/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/* MAKE THE SCENE */
/* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

loadPaletteFromStorage();
disableScroll();
setupRodMenu(xTopLegend, yTopLegend, gridScale);

/* Icon menu */

var iconMenuData = {
    menu: [14, 'menu', .06, menuCallback],
    grid: [15, 'grid', .08, gridCallback],
    rotate: [19.1, 'rotate', .08, rotateCallback],
    delete: [21.1, 'delete', .08, deleteCallback],
    trash: [22.1, 'trash', .08, trashCallback],
    help: [23.1, 'help', .08, helpCallback],
}

for (var menu in iconMenuData) { 
    var icon = new IconMenu(new Point(iconMenuData[menu][0], 1.5)*gridScale, iconMenuData[menu][1], iconMenuData[menu][2], iconMenuData[menu][3])
    if(menu != 'delete' && menu != 'trash') { iconMenuGroup.addChild(icon); }
}
var iconMagic = new IconMenu(new Point(16.1, 1.5)*gridScale, 'magic', .1, magicCallback)
var iconMagicColor = new IconMenu(new Point(16.1, 1.5)*gridScale, 'magicolor', .1, magicCallback)
var iconIncognito = new IconMenu(new Point(13, 1.5)*gridScale, 'incognito', .08, incognitoCallback)
var iconIncognitoColor = new IconMenu(new Point(13, 1.5)*gridScale, 'incognitocolor', .08, incognitoCallback)
var iconUnity = new IconMenu(new Point(17.1, 1.5)*gridScale, 'unity', .07, changeUnityCallback)
var iconSimplifyColor = new IconMenu(new Point(18.1, 1.5)*gridScale, 'simplifycolor', .07, simplifyCallback)
var iconSimplify = new IconMenu(new Point(18.1, 1.5)*gridScale, 'simplify', .07, simplifyCallback)
iconMenuGroup.addChild(iconMagic)
iconMenuGroup.addChild(iconMagicColor)
iconMagicColor.visible = false
iconIncognitoColor.visible = false

var iconPalette = new IconMenu(new Point(20.1, 1.5)*gridScale, 'color-palette', .035, paletteCallback)
iconMenuGroup.addChild(iconPalette)

initPalettePanel();

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