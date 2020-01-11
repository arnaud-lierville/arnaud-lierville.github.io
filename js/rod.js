console.clear();

var planWidth = 28;
var planHeight = 18;
var gridScale = 45;
var gridFillColor = '#74abb5';
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

gridSetup(gridScale, gridFillColor);
setupRodMenu(xTopLegend, yTopLegend, gridScale);

// gridSetup
function gridSetup(gridScale, gridFillColor) {
    for (var y = 3; y < planHeight; y++) {
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

// setupRodMenu
function setupRodMenu(xTopLegend, yTopLegend, gridScale) {
    
    activeRod = null;
    
    // whiteRod
    var whiteRod = new Rectangle(new Point(xTopLegend + 0*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var white = new Path.Rectangle(whiteRod);
    white.fillColor = colorRod[0];
    white.strokeColor = rodStrokeColor;
    white.strokeWidth = rodStrokeWidth;
    white.selected = false;
    white.isSelectable = false;
    white.onMouseDown = function(event) { activeRod = createRod(1); };
    menuGroup.addChild(white);
    
    // redRod
    var redRod = new Rectangle(new Point(xTopLegend + 1*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var red = new Path.Rectangle(redRod);
    red.fillColor = colorRod[1];
    red.strokeColor = rodStrokeColor;
    red.strokeWidth = rodStrokeWidth;
    red.selected = false;
    red.isSelectable = false;
    red.onMouseDown = function(event) { activeRod = createRod(2); };
    menuGroup.addChild(red);

    // liteGreenRod
    var liteGreenRod = new Rectangle(new Point(xTopLegend + 2*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var liteGreen = new Path.Rectangle(liteGreenRod);
    liteGreen.fillColor = colorRod[2];
    liteGreen.strokeColor = rodStrokeColor;
    liteGreen.strokeWidth = rodStrokeWidth;
    liteGreen.selected = false;
    liteGreen.isSelectable = false;
    liteGreen.onMouseDown = function(event) { activeRod = createRod(3); };
    menuGroup.addChild(liteGreen);

    // pinkRod
    var pinkRod = new Rectangle(new Point(xTopLegend + 3*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var pink = new Path.Rectangle(pinkRod);
    pink.fillColor = colorRod[3];
    pink.strokeColor = rodStrokeColor;
    pink.strokeWidth = rodStrokeWidth;
    pink.selected = false;
    pink.isSelectable = false;
    pink.onMouseDown = function(event) { activeRod = createRod(4); };
    menuGroup.addChild(pink);

    // yellowRod
    var yellowRod = new Rectangle(new Point(xTopLegend + 4*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var yellow = new Path.Rectangle(yellowRod);
    yellow.fillColor = colorRod[4];
    yellow.strokeColor = rodStrokeColor;
    yellow.strokeWidth = rodStrokeWidth;
    yellow.selected = false;
    yellow.isSelectable = false;
    yellow.onMouseDown = function(event) { activeRod = createRod(5); };
    menuGroup.addChild(yellow);

    // darkGreenRod
    var darkGreenRod = new Rectangle(new Point(xTopLegend + 5*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var darkGreen = new Path.Rectangle(darkGreenRod);
    darkGreen.fillColor = colorRod[5];
    darkGreen.strokeColor = rodStrokeColor;
    darkGreen.strokeWidth = rodStrokeWidth;
    darkGreen.selected = false;
    darkGreen.isSelectable = false;
    darkGreen.onMouseDown = function(event) { activeRod = createRod(6); };
    menuGroup.addChild(darkGreen);

    // darkRod
    var darkRod = new Rectangle(new Point(xTopLegend + 6*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var dark = new Path.Rectangle(darkRod);
    dark.fillColor = colorRod[6];
    dark.strokeColor = rodStrokeColor;
    dark.strokeWidth = rodStrokeWidth;
    dark.selected = false;
    dark.isSelectable = false;
    dark.onMouseDown = function(event) { activeRod = createRod(7); };
    menuGroup.addChild(dark);

    // brownRod
    var brownRod = new Rectangle(new Point(xTopLegend + 7*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var brown = new Path.Rectangle(brownRod);
    brown.fillColor = colorRod[7];
    brown.strokeColor = rodStrokeColor;
    brown.strokeWidth = rodStrokeWidth;
    brown.selected = false;
    brown.isSelectable = false;
    brown.onMouseDown = function(event) { activeRod = createRod(8); };
    menuGroup.addChild(brown);

    // blueRod
    var blueRod = new Rectangle(new Point(xTopLegend + 8*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var blue = new Path.Rectangle(blueRod);
    blue.fillColor = colorRod[8];
    blue.strokeColor = rodStrokeColor;
    blue.strokeWidth = rodStrokeWidth;
    blue.selected = false;
    blue.isSelectable = false;
    blue.onMouseDown = function(event) { activeRod = createRod(9); };
    menuGroup.addChild(blue);

    // orangeRod
    var orangeRod = new Rectangle(new Point(xTopLegend + 9*gridScale, yTopLegend), new Size(gridScale, gridScale));
    var orange = new Path.Rectangle(orangeRod);
    orange.fillColor = colorRod[9];
    orange.strokeColor = rodStrokeColor;
    orange.strokeWidth = rodStrokeWidth;
    orange.selected = false;
    orange.isSelectable = false;
    orange.onMouseDown = function(event) { activeRod = createRod(10); };
    menuGroup.addChild(orange);
};

// createRod
function createRod(l) {

    legend.visible = false;
    legendBackground.visible = false;

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
    rod.isSelectable = true;
    rod.isUP = true;
    rod.rodLength = l;
    rod.parity = l%2;
    rodGroup.addChild(rod);
    rod.flip = function() {
        if (this.rodLength !=1) {
            if (this.isUP) {
                this.rotate(90, this.bounds.bottomLeft);
                this.isUP = false;
            } else {
                this.rotate(-90, this.bounds.topLeft);
                this.isUP = true;
            };
        };
    };
    return rod;
};

//onMouseDown
function onMouseDown(event) {
    
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) { 
        activeRod = null;
        return; 
    } else {
        if (hitResult.type == 'fill') {
            thisItem = hitResult.item;
            if (thisItem.isSelectable) {
                if (activeRod) { activeRod.shadowColor = null; };
                activeRod = thisItem;
                activeRod.bringToFront();
                activeRod.shadowColor = new Color(0, 0, 0);
                activeRod.shadowBlur = 12;
                activeRod.shadowOffset = new Point(5, 5);
            };
        };
    };
};

// onMouseDrag
function onMouseDrag(event) {
	if (activeRod) {
	    activeRod.position += event.delta;
	};
};

// onMouseUp
function onMouseUp(event) {
    if (activeRod) {
        // no moving detect
        if (event.delta.x == 0 && event.delta.y == 0) {
            // flip rod
            // onMouseUp not in MenuRod
            if (event.point.y > 2*gridScale) {
                activeRod.flip();
            }  
        // moving detect
        } else {
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


    };
};

// onKeyDown
function onKeyDown(event) {

    console.log('key: ' + event.key);

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

    // Flip a rod
    if (event.key == 'space') {
        if (activeRod) { activeRod.flip(); };
    };
    
    // Delete a rod
    if (event.key == 'backspace') {
        if (activeRod) { 
            activeRod.remove(); 
            activeRod = null;
        };
    };
    
    // Reset the scene
    if (event.key == 'c') {
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

    // enter : unactive rod
    if (event.key == 'enter') {
        if (activeRod) { 
            activeRod.shadowColor = null;
            activeRod = null;
        };
    };

    // h : legend
    if (event.key == 'h') {
        legend.visible = !legend.visible;
        legendBackground.visible = !legendBackground.visible;
    };

    // m : menu
    if (event.key == 'm') {
        menuGroup.visible = !menuGroup.visible;
    };

    // Flip a rod
    if (event.key == 's') {
        stairs();
    };


    if (event.key == '1') { activeRod = createRod(1); };
    if (event.key == '2') { activeRod = createRod(2); };
    if (event.key == '3') { activeRod = createRod(3); };
    if (event.key == '4') { activeRod = createRod(4); };
    if (event.key == '5') { activeRod = createRod(5); };
    if (event.key == '6') { activeRod = createRod(6); };
    if (event.key == '7') { activeRod = createRod(7); };
    if (event.key == '8') { activeRod = createRod(8); };
    if (event.key == '9') { activeRod = createRod(9); };
    if (event.key == '0') { activeRod = createRod(10); };

    if (event.key == 'a') { carpet(1); };
    if (event.key == 'z') { carpet(2); };
    if (event.key == 'e') { carpet(3); };
    if (event.key == 'r') { carpet(4); };
    if (event.key == 't') { carpet(5); };
    if (event.key == 'y') { carpet(6); };
    if (event.key == 'u') { carpet(7); };
    if (event.key == 'i') { carpet(8); };
    if (event.key == 'o') { carpet(9); };
    if (event.key == 'p') { carpet(10); };

};




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
    'Espace : pivote la réglette\n' +
    'Entrer : désactive la réglette\n' +
    'Supprimer : supprime la réglette\n' +
    '1, 2, 3, ... : crée la réglette 1, 2, 3, ...\n' +
    'a, z, e, r, t, y, ... : crée le tapis 1, 2, 3, ...\n' +
    's : crée l\'escalier\n'  +
    'c : efface tout\n',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25,
    //shadowColor: new Color(0, 0, 0),
    //shadowBlur: 12,
    //shadowOffset: new Point(5, 5)
});

legend.onMouseDown = function(event) { 
    if (activeRod) {
        activeRod.shadowColor = null;
        activeRod = null;
    };
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
};

//var legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft, legend.bounds.size));
var legendBackground = new Path.Rectangle(new Rectangle(new Point(2.9*gridScale, 2.6*gridScale), new Point(13.1*gridScale, 12.1*gridScale)));
legendBackground.fillColor = '#ffefd6';
legend.bringToFront();


function carpet(n) {
    for (i = 0; i < n+1; i++)
    {
        // left rod
        if (i !=0 ) {
            var size = new Size(i*gridScale, gridScale);
            var point = new Point(4*gridScale ,(4+i)*gridScale);
            var rod = new Path.Rectangle(new Rectangle(point, size));
            rod.fillColor = colorRod[i-1];
            rod.strokeColor = rodStrokeColor;
            rod.strokeWidth = rodStrokeWidth;
            rod.selected = false;
            rod.isSelectable = true;
            rod.isUP = false;
            rod.rodLength = i;
            rod.parity = i%2;
            rodGroup.addChild(rod);
            rod.flip = function() {
                if (this.rodLength !=1) {
                    if (this.isUP) {
                        this.rotate(90, this.bounds.bottomLeft);
                        this.isUP = false;
                    } else {
                        this.rotate(-90, this.bounds.topLeft);
                        this.isUP = true;
                    };
                };
            };
        };

        // right rod
        if ( (n-i) != 0) {
            var size = new Size((n-i)*gridScale, gridScale);
            var point = new Point((4+i)*gridScale ,(4+i)*gridScale);
            var rod = new Path.Rectangle(new Rectangle(point, size));
            rod.fillColor = colorRod[n-i-1];
            rod.strokeColor = rodStrokeColor;
            rod.strokeWidth = rodStrokeWidth;
            rod.selected = false;
            rod.isSelectable = true;
            rod.isUP = false;
            rod.rodLength = n-i;
            rod.parity = (n-i)%2;
            rodGroup.addChild(rod);
            rod.flip = function() {
                if (this.rodLength !=1) {
                    if (this.isUP) {
                        this.rotate(90, this.bounds.bottomLeft);
                        this.isUP = false;
                    } else {
                        this.rotate(-90, this.bounds.topLeft);
                        this.isUP = true;
                    };
                };
            };
        };
    };
};

function stairs() {
    for (i = 1; i < 11; i++) {
        var size = new Size(i*gridScale, gridScale);
        var point = new Point(4*gridScale ,(3+i)*gridScale);
        var rod = new Path.Rectangle(new Rectangle(point, size));
        rod.fillColor = colorRod[i-1];
        rod.strokeColor = rodStrokeColor;
        rod.strokeWidth = rodStrokeWidth;
        rod.selected = false;
        rod.isSelectable = true;
        rod.isUP = false;
        rod.rodLength = i;
        rod.parity = i%2;
        rodGroup.addChild(rod);
        rod.flip = function() {
            if (this.rodLength !=1) {
                if (this.isUP) {
                    this.rotate(90, this.bounds.bottomLeft);
                    this.isUP = false;
                } else {
                    this.rotate(-90, this.bounds.topLeft);
                    this.isUP = true;
                };
            };
        };
    };
};
