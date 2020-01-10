console.clear();

var planWidth = 25;
var planHeight = 16;
var gridScale = 50;
var gridFillColor = 'grey';
var xTopLegend = gridScale;
var yTopLegend = gridScale;
var rodStrokeWidth = gridScale/15;
var rodStrokeColor = '#D3D3D3';
var colorRod = ['#f2e1c9', '#e71f43', '#9fc94d', '#f487ab', 
                '#fff035', '#118550', '#100f17', '#9d3b37',
                '#1a7cba', '#f17331'];

var rodGroup = new Group();
var gridGroup = new Group();
var menuGroup = new Group();
var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };


var activeRod = null;
var isGridVisible = true;
var isHelpVisible = true;
var isMenuVisible = true;
gridSetup(gridScale, gridFillColor);
setupRodMenu(xTopLegend, yTopLegend, gridScale);

// functions //
function gridSetup(gridScale, gridFillColor) {
    for (var y = 1; y < planHeight; y++) {
    	for(var x = 1; x < planWidth; x++) {
            var circle = new Path.Circle({
                center: new Point(x, y)*gridScale,
                radius: 2,
                fillColor: gridFillColor
            });
            gridGroup.addChild(circle);
    	};
    };
    gridGroup.sendToBack();
};


function setupRodMenu(xTopLegend, yTopLegend, gridScale) {
    
    activeRod = null;
    
    // whiteRod
    var whiteRod = new Rectangle(new Point(xTopLegend + 0*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var white = new Path.Rectangle(whiteRod);
    white.fillColor = colorRod[0];
    white.strokeColor = rodStrokeColor;
    white.strokeWidth = rodStrokeWidth;
    white.selected = false;
    white.onMouseDown = function(event) { activeRod = createRod(1); };
    menuGroup.addChild(white);
    
    // redRod
    var redRod = new Rectangle(new Point(xTopLegend + 1*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var red = new Path.Rectangle(redRod);
    red.fillColor = colorRod[1];
    red.strokeColor = rodStrokeColor;
    red.strokeWidth = rodStrokeWidth;
    red.selected = false;
    red.onMouseDown = function(event) { activeRod = createRod(2); };
    menuGroup.addChild(red);

    // liteGreenRod
    var liteGreenRod = new Rectangle(new Point(xTopLegend + 2*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var liteGreen = new Path.Rectangle(liteGreenRod);
    liteGreen.fillColor = colorRod[2];
    liteGreen.strokeColor = rodStrokeColor;
    liteGreen.strokeWidth = rodStrokeWidth;
    liteGreen.selected = false;
    liteGreen.onMouseDown = function(event) { activeRod = createRod(3); };
    menuGroup.addChild(liteGreen);

    // pinkRod
    var pinkRod = new Rectangle(new Point(xTopLegend + 3*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var pink = new Path.Rectangle(pinkRod);
    pink.fillColor = colorRod[3];
    pink.strokeColor = rodStrokeColor;
    pink.strokeWidth = rodStrokeWidth;
    pink.selected = false;
    pink.onMouseDown = function(event) { activeRod = createRod(4); };
    menuGroup.addChild(pink);

    // yellowRod
    var yellowRod = new Rectangle(new Point(xTopLegend + 4*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var yellow = new Path.Rectangle(yellowRod);
    yellow.fillColor = colorRod[4];
    yellow.strokeColor = rodStrokeColor;
    yellow.strokeWidth = rodStrokeWidth;
    yellow.selected = false;
    yellow.onMouseDown = function(event) { activeRod = createRod(5); };
    menuGroup.addChild(yellow);

    // darkGreenRod
    var darkGreenRod = new Rectangle(new Point(xTopLegend + 5*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var darkGreen = new Path.Rectangle(darkGreenRod);
    darkGreen.fillColor = colorRod[5];
    darkGreen.strokeColor = rodStrokeColor;
    darkGreen.strokeWidth = rodStrokeWidth;
    darkGreen.selected = false;
    darkGreen.onMouseDown = function(event) { activeRod = createRod(6); };
    menuGroup.addChild(darkGreen);

    // darkRod
    var darkRod = new Rectangle(new Point(xTopLegend + 6*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var dark = new Path.Rectangle(darkRod);
    dark.fillColor = colorRod[6];
    dark.strokeColor = rodStrokeColor;
    dark.strokeWidth = rodStrokeWidth;
    dark.selected = false;
    dark.onMouseDown = function(event) { activeRod = createRod(7); };
    menuGroup.addChild(dark);

    // brownRod
    var brownRod = new Rectangle(new Point(xTopLegend + 7*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var brown = new Path.Rectangle(brownRod);
    brown.fillColor = colorRod[7];
    brown.strokeColor = rodStrokeColor;
    brown.strokeWidth = rodStrokeWidth;
    brown.selected = false;
    brown.onMouseDown = function(event) { activeRod = createRod(8); };
    menuGroup.addChild(brown);

    // blueRod
    var blueRod = new Rectangle(new Point(xTopLegend + 8*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var blue = new Path.Rectangle(blueRod);
    blue.fillColor = colorRod[8];
    blue.strokeColor = rodStrokeColor;
    blue.strokeWidth = rodStrokeWidth;
    blue.selected = false;
    blue.onMouseDown = function(event) { activeRod = createRod(9); };
    menuGroup.addChild(blue);

    // orangeRod
    var orangeRod = new Rectangle(new Point(xTopLegend + 9*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var orange = new Path.Rectangle(orangeRod);
    orange.fillColor = colorRod[9];
    orange.strokeColor = rodStrokeColor;
    orange.strokeWidth = rodStrokeWidth;
    orange.selected = false;
    orange.onMouseDown = function(event) { activeRod = createRod(10); };
    menuGroup.addChild(orange);

};


function createRod(l) {
    if (activeRod) { activeRod.shadowColor = null; };
    var x = Math.floor(Math.random() * 10);
    var y = Math.floor(Math.random() * 6);
    var rodRectangle = new Rectangle(new Point((x+1)*gridScale, (y+3)*gridScale), new Size(gridScale, l*gridScale));
    var rod = new Path.Rectangle(rodRectangle);
    rod.fillColor = colorRod[l-1];
    rod.strokeColor = rodStrokeColor;
    rod.strokeWidth = rodStrokeWidth;
    rod.shadowColor = new Color(0, 0, 0);
    rod.shadowBlur = 12;
    rod.shadowOffset = new Point(5, 5);
    rod.selected = false;
    rodGroup.addChild(rod);
    return rod;
};

function onMouseDown(event) {
    
	var hitResult = project.hitTest(event.point, hitOptions);
	if (!hitResult) { return; }
		
	if (hitResult.type == 'fill') {
        thisRod = hitResult.item;
        var y = thisRod.position.y;
        if (y != yTopLegend*1.5 && !thisRod.content) {
            if (activeRod) { activeRod.shadowColor = null; };
            activeRod = thisRod;
            activeRod.bringToFront();
            activeRod.shadowColor = new Color(0, 0, 0);
            activeRod.shadowBlur = 12;
            activeRod.shadowOffset = new Point(5, 5);
        };
	};
};

function onMouseDrag(event) {
	if (activeRod) {
	    activeRod.position += event.delta;
	};
};

function onMouseUp(event) {
    if (activeRod) {
        // no move detect
        if (event.delta.x == 0 && event.delta.y == 0) {
            // flip rod
            // not in MenuRod
            if (event.point.y > 2*gridScale && activeRod.position.y>3) {
                flipRod(activeRod);
            }  
        // move detect
        } else {
            // move rod
            var x = activeRod.position.x;
            var y = activeRod.position.y;
            // alt = 1 => barre impaire, alt = 0 => barre paire
            var alt = Math.floor(activeRod.area*1.05/(gridScale*gridScale))%2;
            var isRodUP = Math.abs(activeRod.bounds.width - gridScale) < 0.01;
            // Espace de sécurité pour ne pas recouvrir la barre des rods
            var spaceMenu = Math.floor(activeRod.bounds.height/(2*gridScale))+3;
            if (isRodUP) {
                activeRod.position.x = (Math.floor(x/gridScale) + 0.5)*gridScale;
                activeRod.position.y = (Math.max((Math.floor(y/gridScale)),spaceMenu) + alt*.5)*gridScale;
            } else {
                activeRod.position.x = (Math.floor(x/gridScale) + alt*0.5)*gridScale;
                activeRod.position.y = (Math.max((Math.floor(y/gridScale)),spaceMenu) + 0.5)*gridScale;
            };
        };


    };
};

function flipRod(rod) {
    // test1 = true => barre blanche
    var isWhiteRod = Math.abs(rod.bounds.width - rod.bounds.height) < 0.01;
    if (!isWhiteRod) {
        // test2 : pour déterminer le sens de rotation
        var isRodUP = Math.abs(rod.bounds.width - gridScale) < 0.01;
        if (isRodUP) {
            var point = rod.bounds.bottomLeft;
            rod.rotate(90, point);
        } else {
            var point = rod.bounds.topLeft;
            rod.rotate(-90, point);
        };
    };
    return;
};

function onKeyDown(event) {
    console.log(event.key);
    // Flip a rod
    if (event.key == 'space') {
        if (activeRod) { flipRod(activeRod); };
    };
    
    // Remove a rod
    if (event.key == 'backspace') {
        if (activeRod) { 
            activeRod.remove(); 
            activeRod = null;
        };
    };
    
    // Reset the scene
    if (event.key == 'r') {
        rodGroup.removeChildren();
    };
    
    // Grid : on/off
    if (event.key == 'g') {
        if (isGridVisible) {
            isGridVisible = false;
            gridGroup.removeChildren();
        } else {
            isGridVisible = true;
            gridSetup(gridScale, gridFillColor);
        };
    };

    if (event.key == 'up') {
        if (activeRod) {
            activeRod.position.y -= gridScale;
        };
    };

    if (event.key == 'down') {
        if (activeRod) {
            activeRod.position.y += gridScale;
        };
    };

    if (event.key == 'left') {
        if (activeRod) {
            activeRod.position.x -= gridScale;
        };
    };

    if (event.key == 'right') {
        if (activeRod) {
            activeRod.position.x += gridScale;
        };
    };

    // Unactive rod
    if (event.key == 'enter') {
        if (activeRod) { 
            activeRod.shadowColor = null;
            activeRod = null;
        };
    };

    // h : legend
    if (event.key == 'h') {
        if (isHelpVisible) { 
            isHelpVisible = false;
            legend.visible = false;
        } else {
            isHelpVisible = true;
            legend.visible = true;  
        };
    };

    // m : menu
    if (event.key == 'm') {
        if (isMenuVisible) { 
            isMenuVisible = false;
            menuGroup.visible = false;
        } else {
            isMenuVisible = true;
            menuGroup.visible = true;  
        };
    };
};

//Legend

var legend = new PointText({
    point: [3.5*gridScale, 3.5*gridScale],
    content: 
    'Raccourcis claviers :\n'  +
    '\n'  +
    'Flèches : déplace la réglette\n'  +
    'Espace : pivote la réglette\n' +
    'Entrer : désactive la réglette\n'  +
    'Supprimer : supprime la réglette\n'  +
    'g : active/désactive la grille\n'  +
    'r : efface tout\n'  +
    'm : affiche le menu' +
    'h : affiche l\'aide\n',
    fillColor: 'black',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25,
    shadowColor: new Color(0, 0, 0),
    shadowBlur: 12,
    shadowOffset: new Point(5, 5)
});