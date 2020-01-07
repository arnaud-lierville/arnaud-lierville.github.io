console.clear();

var gridSize = 50;
var gridFillColor = '#e9e9ff';
var xTopLegend = gridSize;
var yTopLegend = gridSize;
var rodStrokeWidth = gridSize/15;
var rodStrokeColor = '#D3D3D3';
var colorRod = ['#f2e1c9', '#e71f43', '#9fc94d', '#f487ab', 
                '#fff035', '#118550', '#100f17', '#9d3b37',
                '#1a7cba', '#f17331'];

var groupRod = new Group();
var gridGroup = new Group();
var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };


var activeRod = null;
var isGridVisible = true;
gridSetup(gridSize, gridFillColor);
setupRodMenu(xTopLegend, yTopLegend, gridSize);

// functions //

function gridSetup(gridSize, gridFillColor) {
    for (var y = 0; y < 50; y++) {
    	for(var x = 0; x < 50; x++) {
            var circle = new Path.Circle({
                center: new Point(x, y)*gridSize,
                radius: 2,
                fillColor: gridFillColor
            });
            gridGroup.addChild(circle);
    	};
    };
    gridGroup.sendToBack();
};


function setupRodMenu(xTopLegend, yTopLegend, gridSize) {
    
    activeRod = null;
    
    // whiteRod
    var whiteRod = new Rectangle(new Point(xTopLegend + 0*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var white = new Path.Rectangle(whiteRod);
    white.fillColor = colorRod[0];
    white.strokeColor = rodStrokeColor;
    white.strokeWidth = rodStrokeWidth;
    white.selected = false;
    white.onMouseDown = function(event) { activeRod = createRod(1); };
    
    // redRod
    var redRod = new Rectangle(new Point(xTopLegend + 1*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var red = new Path.Rectangle(redRod);
    red.fillColor = colorRod[1];
    red.strokeColor = rodStrokeColor;
    red.strokeWidth = rodStrokeWidth;
    red.selected = false;
    red.onMouseDown = function(event) { activeRod = createRod(2); };
    
    // liteGreenRod
    var liteGreenRod = new Rectangle(new Point(xTopLegend + 2*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var liteGreen = new Path.Rectangle(liteGreenRod);
    liteGreen.fillColor = colorRod[2];
    liteGreen.strokeColor = rodStrokeColor;
    liteGreen.strokeWidth = rodStrokeWidth;
    liteGreen.selected = false;
    liteGreen.onMouseDown = function(event) { activeRod = createRod(3); };
    
    // pinkRod
    var pinkRod = new Rectangle(new Point(xTopLegend + 3*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var pink = new Path.Rectangle(pinkRod);
    pink.fillColor = colorRod[3];
    pink.strokeColor = rodStrokeColor;
    pink.strokeWidth = rodStrokeWidth;
    pink.selected = false;
    pink.onMouseDown = function(event) { activeRod = createRod(4); };
    
    // yellowRod
    var yellowRod = new Rectangle(new Point(xTopLegend + 4*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var yellow = new Path.Rectangle(yellowRod);
    yellow.fillColor = colorRod[4];
    yellow.strokeColor = rodStrokeColor;
    yellow.strokeWidth = rodStrokeWidth;
    yellow.selected = false;
    yellow.onMouseDown = function(event) { activeRod = createRod(5); };
    
    // darkGreenRod
    var darkGreenRod = new Rectangle(new Point(xTopLegend + 5*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var darkGreen = new Path.Rectangle(darkGreenRod);
    darkGreen.fillColor = colorRod[5];
    darkGreen.strokeColor = rodStrokeColor;
    darkGreen.strokeWidth = rodStrokeWidth;
    darkGreen.selected = false;
    darkGreen.onMouseDown = function(event) { activeRod = createRod(6); };
    
    // darkRod
    var darkRod = new Rectangle(new Point(xTopLegend + 6*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var dark = new Path.Rectangle(darkRod);
    dark.fillColor = colorRod[6];
    dark.strokeColor = rodStrokeColor;
    dark.strokeWidth = rodStrokeWidth;
    dark.selected = false;
    dark.onMouseDown = function(event) { activeRod = createRod(7); };
    
    // brownRod
    var brownRod = new Rectangle(new Point(xTopLegend + 7*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var brown = new Path.Rectangle(brownRod);
    brown.fillColor = colorRod[7];
    brown.strokeColor = rodStrokeColor;
    brown.strokeWidth = rodStrokeWidth;
    brown.selected = false;
    brown.onMouseDown = function(event) { activeRod = createRod(8); };
    
    // blueRod
    var blueRod = new Rectangle(new Point(xTopLegend + 8*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var blue = new Path.Rectangle(blueRod);
    blue.fillColor = colorRod[8];
    blue.strokeColor = rodStrokeColor;
    blue.strokeWidth = rodStrokeWidth;
    blue.selected = false;
    blue.onMouseDown = function(event) { activeRod = createRod(9); };
    
    // orangeRod
    var orangeRod = new Rectangle(new Point(xTopLegend + 9*gridSize, yTopLegend), new Size(gridSize, gridSize));
    var orange = new Path.Rectangle(orangeRod);
    orange.fillColor = colorRod[9];
    orange.strokeColor = rodStrokeColor;
    orange.strokeWidth = rodStrokeWidth;
    orange.selected = false;
    orange.onMouseDown = function(event) { activeRod = createRod(10); };
};


function createRod(l) {
    if (activeRod) { activeRod.shadowColor = null; };
    var x = Math.floor(Math.random() * 10);
    var y = Math.floor(Math.random() * 6);
    var rodRectangle = new Rectangle(new Point(x*gridSize, (y+3)*gridSize), new Size(gridSize, l*gridSize));
    var rod = new Path.Rectangle(rodRectangle);
    rod.fillColor = colorRod[l-1];
    rod.strokeColor = rodStrokeColor;
    rod.strokeWidth = rodStrokeWidth;
    rod.shadowColor = new Color(0, 0, 0);
    rod.shadowBlur = 12;
    rod.shadowOffset = new Point(5, 5);
    rod.selected = false;
    groupRod.addChild(rod);
    return rod;
};

function onMouseDown(event) {
    
	var hitResult = project.hitTest(event.point, hitOptions);
	if (!hitResult) { return; }
		
	if (hitResult.type == 'fill') {
	    thisRod = hitResult.item;
        var y = thisRod.position.y;
        if (y != yTopLegend*1.5) {
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
        var x = activeRod.position.x;
        var y = activeRod.position.y;
        // alt = 1 => barre impaire, alt = 0 => barre paire
        var alt = Math.floor(activeRod.area*1.05/(gridSize*gridSize))%2;
        var isRodUP = Math.abs(activeRod.bounds.width - gridSize) < 0.01;
        // Espace de sécurité pour ne pas recouvrir la barre des menus
        var spaceMenu = Math.floor(activeRod.bounds.height/(2*gridSize))+3;
        if (isRodUP) {
            activeRod.position.x = (Math.floor(x/gridSize) + 0.5)*gridSize;
            activeRod.position.y = (Math.max((Math.floor(y/gridSize)),spaceMenu) + alt*.5)*gridSize;
        } else {
            activeRod.position.x = (Math.floor(x/gridSize) + alt*0.5)*gridSize;
            activeRod.position.y = (Math.max((Math.floor(y/gridSize)),spaceMenu) + 0.5)*gridSize;
        };
    };
};

function onKeyDown(event) {
    console.log('onKeyDown');
    console.log(event.key)
    // Flip a rod
    if (event.key == 'space') {
        if (activeRod) {
            // test1 = true => barre blanche
            var isWhiteRod = Math.abs(activeRod.bounds.width - activeRod.bounds.height) < 0.01;
            if (!isWhiteRod) {
                // test2 : pour déterminer le sens de rotation
                var isRodUP = Math.abs(activeRod.bounds.width - gridSize) < 0.01;
                if (isRodUP) {
                    var point = activeRod.bounds.bottomLeft;
                    activeRod.rotate(90, point);
                } else {
                    var point = activeRod.bounds.topLeft;
                    activeRod.rotate(-90, point);
                };
            };
        };
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
        groupRod.removeChildren();
    };
    
    // Grid : on/off
    if (event.key == 'g') {
        if (isGridVisible) {
            isGridVisible = false;
            gridGroup.removeChildren();
        } else {
            isGridVisible = true;
            gridSetup(gridSize, gridFillColor);
        };
    };

    // Moving Rods with keyboard
    if (event.key == 'up') { if (activeRod) { activeRod.position.y -= gridSize; }; };
    if (event.key == 'down') { if (activeRod) { activeRod.position.y += gridSize; }; };
    if (event.key == 'left') { if (activeRod) { activeRod.position.x -= gridSize; }; };
    if (event.key == 'right') { if (activeRod) { activeRod.position.x += gridSize; }; };

    // Unactive rod
    if (event.key = 'u') {
        if (activeRod) { 
            activeRod.shadowColor = null;
            activeRod = null;
        };
    };
};