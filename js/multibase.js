/* block sides creator */

var createFrontSide = function(x, y, scale) {
    return new Path.Rectangle(new Rectangle(new Point(x*scale, y*scale), new Size(scale, scale)));
}

var createRightSide = function(x, y, scale) {

    var firstPoint = new Point((x + 1)*scale, (y + 1)*scale);
    var secondPoint = firstPoint + new Point(0.25*scale*Math.sqrt(3), -0.25*scale)
    var thirdPoint = secondPoint + new Point(0, -scale);
    var fourthPoint = firstPoint + new Point(0, -scale);
    rightSide = new Path(firstPoint, secondPoint, thirdPoint, fourthPoint);
    rightSide.closed = true;
    rightSide.strokeJoin = 'round';

    return rightSide;
}

var createUpSide = function(x, y, scale) {

    var firstPoint = new Point(x*scale, y*scale);
    var secondPoint = firstPoint + new Point(scale, 0);
    var thirdPoint = secondPoint + new Point(0.25*scale*Math.sqrt(3), -0.25*scale)
    var fourthPoint = firstPoint + new Point(0.25*scale*Math.sqrt(3), -0.25*scale)
    upSide = new Path(firstPoint, secondPoint, thirdPoint, fourthPoint);
    upSide.closed = true;
    upSide.strokeJoin = 'round';

    return upSide;
}

/* block tools */

var addToSelectedBlocks = function(blockGroup) {

    blockGroup.border.shadowColor = 'black';
    blockGroup.border.shadowBlur = 12;
    blockGroup.border.shadowOffset = new Point(5, 5);
    blockGroup.bringToFront();

    selectedBlocks.addChild(blockGroup);
    selectedBlocks.bringToFront();

    var numberOfBlocks = selectedBlocks.children.length, nbOfUnitBlocks = 0;
    for(var n = 0; n < numberOfBlocks; n++) { if(selectedBlocks.children[n].blockType == "UnitBlock") { nbOfUnitBlocks++; }; }
    nbOfTenBlocks = numberOfBlocks - nbOfUnitBlocks;
    if ((nbOfUnitBlocks > 9 && nbOfTenBlocks == 0) || (nbOfTenBlocks > 9 && nbOfUnitBlocks == 0)) { groupBlocks(selectedBlocks); }
}

var removeFromSelectedBlocks = function(blockGroup) {
    
    blockGroup.remove();
    blockGroup.border.shadowColor = null;
    paper.project.activeLayer.addChild(blockGroup);
    blockGroup.sendToBack();

    var numberOfBlocks = selectedBlocks.children.length;
    var nbOfUnitBlocks = 0;
    var nbOfTenBlocks = 0;
    for(var n = 0; n < numberOfBlocks; n++) { if(selectedBlocks.children[n].blockType == "UnitBlock") { nbOfUnitBlocks++; }; }
    nbOfTenBlocks = numberOfBlocks - nbOfUnitBlocks;
    if ((nbOfUnitBlocks > 9 && nbOfTenBlocks == 0) || (nbOfTenBlocks > 9 && nbOfUnitBlocks == 0)) { groupBlocks(selectedBlocks); }
}

var moveBlocks = function(event) { selectedBlocks.position += event.delta; }
var moveOneBlock = function(event, block) { block.position += event.delta; } 

var blockGenerator = function(type) {

    legend.visible = false;
    legendBackground.visible = false;
    alert.visible = false;

    var number = getNumber();

    if (type == 'UnitBlock') { 
        if(number < 999) {
            new UnitBlock(xu, yu, radioButtonSet.getIndexSelected(), scale, false); 
            xu += 2; if(xu > 50) { xu = 15; yu +=2};
            digitMatrix[0] += 1;
            displayResult();
        } else { displayAlert(); }
    }
    if (type == 'TenBlock') {
        if(number < 990) {
            new TenBlock(xt, yt, radioButtonSet.getIndexSelected(), scale, false); 
            xt++; yt += 2;  if (xt > 22) { xt = 16; yt = 5};
            digitMatrix[1] += 1;
            displayResult();
        } else { displayAlert(); }
    }
    if (type == 'HundredBlock') { 
        if(number < 900) {
        new HundredBlock(xh, yh, radioButtonSet.getIndexSelected(), scale, false); 
        xh += 1.6; yh += 0.8; 
        if (xh > 30) { xh = 15; yh = 15}
        digitMatrix[2] += 1;
        displayResult();
        } else { displayAlert(); }
    } 

    selectedBlocks.shadowColor = null;
    selectedBlocks = new Group();
}

var displayResult = function() {

    displayDigit.remove();

    displayDigit = new PointText({
        point: [2*scale, 23*scale],
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 5*scale,
        fillColor: 'grey'
    })
    var digit0 = digitMatrix[0], digit1 = digitMatrix[1], digit2 = digitMatrix[2];

    if(digitMatrix[0] > 9) { digit0 = '?'; }
    if(digitMatrix[1] > 9) { digit1 = '?'; }
    if(digitMatrix[2] > 9) { digit2 = '?'; }
    if(digitMatrix[1] == 0 && digitMatrix[2] == 0) { digit1 = ' '; digit2 = ' '; }
    if(digitMatrix[2] == 0) { digit2 = ' ';}

    displayDigit.content = digit2.toString() + digit1.toString() + digit0.toString();
    displayDigit.bringToFront();

    displayDigit.visible = toggleButtonDisplayNumber.isON;
}

var getNumber = function() { return digitMatrix[0] + 10*digitMatrix[1] + 100*digitMatrix[2]; }

var displayAlert = function() {
    legend.visible = false;
    legendBackground.visible = false;
    alert.visible = true;
    alert.bringToFront();
}

// groupBlocks
var groupBlocks = function(blockGroup) {

    // split blockGroup in two types
    var numberOfBlocks = blockGroup.children.length;
    unitBlocksToMove = [];
    tenBlocksToMove = [];

    for(var n = 0; n < numberOfBlocks; n++) {
        if(blockGroup.children[n].blockType == "UnitBlock") { unitBlocksToMove.push(blockGroup.children[n]); }
        if(blockGroup.children[n].blockType == "TenBlock") { tenBlocksToMove.push(blockGroup.children[n]); }
    }

    nbOfUnitBlocks = unitBlocksToMove.length;
    nbOfTenBlocks = tenBlocksToMove.length;

    var enoughBloksToFireAnimation = false;
    if (nbOfUnitBlocks > 9) { 
        unitBlocksToMove = unitBlocksToMove.slice(0, 10);
        bringToFrontBlocksToMove(unitBlocksToMove, false);
        enoughBloksToFireAnimation = true;
    } 
    if (nbOfTenBlocks > 9) { 
        tenBlocksToMove = tenBlocksToMove.slice(0, 10);
        bringToFrontBlocksToMove(tenBlocksToMove, true);
        enoughBloksToFireAnimation = true;
    }

    if (enoughBloksToFireAnimation && !animationFired) {
        if (nbOfUnitBlocks >= nbOfTenBlocks) {
            view.on('frame', groupUnitBlocksAnimation);
        } else {
            view.on('frame', groupTenBlocksAnimation);
        }
    } else {
        unitBlocksToMove = [];
        tenBlocksToMove = [];
    }
}

var bringToFrontBlocksToMove = function(BlocksToMove, inverse) {
    for(var n = 0; n < BlocksToMove.length; n++) {
        if (!inverse) {
            BlocksToMove[n].bringToFront();
        } else {
            BlocksToMove[BlocksToMove.length - n - 1].bringToFront();
        }
    }
}

// groupUnitBlocksAnimation
var groupUnitBlocksAnimation = function onFrame(event) {
    animationFired = true;
    var unitVectors = [];
    var unitBlockTarget = unitBlocksToMove[0];
    for (var n = 1; n < 10; n++) {
        unitVectors[n] = unitBlockTarget.position + new Point(n*scale, 0) - unitBlocksToMove[n].position;
        unitBlocksToMove[n].position += unitVectors[n] / 10;
    }
    var unitVectorsLengthList = [];
    for (var n = 1; n < 10; n++) {
        unitVectorsLengthList.push(unitVectors[n].length);
    }
    if (Math.max.apply(Math, unitVectorsLengthList)<1.5) {

        animationFired = false;
        var x = unitBlockTarget.firstChild.bounds.left/scale;
        var y = unitBlockTarget.firstChild.bounds.top/scale;
        for (var n = 0; n < 10; n++) { unitBlocksToMove[n].remove(); }
        unitBlocksToMove = [];
        tenBlocksToMove = [];
        new TenBlock(x, y, radioButtonSet.getIndexSelected(), scale, false);
        selectedBlocks.shadowColor = null;
        selectedBlocks = new Group();
        digitMatrix[0] -= 10;
        digitMatrix[1]++;
        displayResult();

        paper.view.detach('frame', this.onFrame);
    }
};

// groupTenBlocksAnimation
var groupTenBlocksAnimation = function onFrame(event) {
    animationFired = true;
    var tenVectors = [];
    var tenBlockTarget = tenBlocksToMove[0];
    for (var n = 1; n < 10; n++) {
        tenVectors[n] = tenBlockTarget.position + new Point(0, n*scale) - tenBlocksToMove[n].position;
        tenBlocksToMove[n].position += tenVectors[n] / 5;
    }
    var tenVectorsLengthList = [];
    for (var n = 1; n < 10; n++) {
        tenVectorsLengthList.push(tenVectors[n].length);
    }
    if (Math.max.apply(Math, tenVectorsLengthList)<1.5) {

        animationFired = false;
        var x = tenBlockTarget.firstChild.bounds.left/scale;
        var y = tenBlockTarget.firstChild.bounds.top/scale;
        for (var n = 0; n < 10; n++) { tenBlocksToMove[n].remove(); }
        unitBlocksToMove = [];
        tenBlocksToMove = [];
        new HundredBlock(x, y, radioButtonSet.getIndexSelected(), scale, false);
        selectedBlocks.shadowColor = null;
        selectedBlocks = new Group();
        digitMatrix[1] -= 10;
        digitMatrix[2]++;
        displayResult();

        paper.view.detach('frame', this.onFrame);
    }
};

/* Blocks Class */

var UnitBlock = Base.extend({
    
    initialize: function(x, y, indexColor, scale, isGenerator) {

        this.unitGroup = new Group();

        // border
        var border = new Path(new Point(x, y + 1)*scale, 
        new Point(x + 1, y + 1)*scale, new Point(x + 1, y + 1)*scale + new Point(0.25*scale*Math.sqrt(3), -0.25*scale), 
        new Point(x + 1, y + 1)*scale + new Point(0.25*scale*Math.sqrt(3), -0.25*scale) + new Point(0, -1)*scale);
        border.strokeWidth = scale/10;
        border.strokeColor = strokeColors[indexColor];
        this.unitGroup.border = border;
        this.unitGroup.addChild(border);

        // block
        var frontSide = createFrontSide(x, y, scale);
        var rightSide = createRightSide(x, y, scale);
        var upSide = createUpSide(x, y, scale);
        this.unitGroup.addChild(frontSide);
        this.unitGroup.addChild(rightSide);
        this.unitGroup.addChild(upSide);

        // block color
        this.unitGroup.fillColor = colors[indexColor];
        this.unitGroup.strokeWidth = scale/10;
        this.unitGroup.strokeColor = strokeColors[indexColor];

        if (isGenerator) {

            this.unitGroup.blockType = 'UnitGenerator';
            this.unitGroup.onMouseDown = function() { blockGenerator('UnitBlock'); }

        } else {

            // blockType
            this.unitGroup.blockType = 'UnitBlock';

            // mouse
            var that = this;
            var wasJustRemoved = false;
            var wasJustSelected = false;
            this.unitGroup.onMouseDown = function() { 
                legend.visible = false;
                legendBackground.visible = false;
                alert.visible = false;
                if (!selectedBlocks.isChild(that.unitGroup)) {
                    addToSelectedBlocks(that.unitGroup);
                    wasJustSelected = true;
                } else {
                    removeFromSelectedBlocks(that.unitGroup);
                    wasJustRemoved = true;
                }
            }
            this.unitGroup.onMouseDrag = function(event) { 
                if (wasJustRemoved) {
                    wasJustRemoved = false;
                    addToSelectedBlocks(that.unitGroup);
                }
                if (wasJustSelected) {
                    isCurrentlyDraggingBlocks = true; 
                    moveOneBlock(event, that.unitGroup);
                }
                if (!wasJustSelected) {
                    isCurrentlyDraggingBlocks = true; 
                    moveBlocks(event);
                }
            }
            this.unitGroup.onMouseUp = function() { 
                if(selectedBlocks.children.length == 1 && isCurrentlyDraggingBlocks) {
                    removeFromSelectedBlocks(that.unitGroup);
                }
                isCurrentlyDraggingBlocks = false; 
                justStopDraging = true;
                wasJustSelected = false;
            }
        }
        this.unitGroup.bringToFront();

        return this.unitGroup;
    }
})

var TenBlock = Base.extend({

    initialize: function(x, y, indexColor, scale, isGenerator) {

        this.tenGroup = new Group();
        this.tenGroup.indexColor = indexColor;

        // border
        var border = new Path(new Point(x, y + 1)*scale, 
        new Point(x + 10, y + 1)*scale, new Point(x + 10, y + 1)*scale + new Point(0.25*scale*Math.sqrt(3), -0.25*scale), 
        new Point(x + 10, y + 1)*scale + new Point(0.25*scale*Math.sqrt(3), -0.25*scale) + new Point(0, -1)*scale);
        border.strokeWidth = scale/10;
        border.strokeColor = strokeColors[indexColor];
        this.tenGroup.border = border;
        this.tenGroup.addChild(border);

        // blocks
        for (var n = 0; n < 10; n++) {
            var frontSide = createFrontSide(x + n, y, scale);
            var rightSide = createRightSide(x + n, y, scale);
            var upSide = createUpSide(x + n, y, scale);
            this.tenGroup.addChild(frontSide);
            this.tenGroup.addChild(rightSide);
            this.tenGroup.addChild(upSide);
        }

        // block colors
        this.tenGroup.indexColor = indexColor;
        this.tenGroup.fillColor = colors[indexColor];
        this.tenGroup.strokeWidth = scale/10;
        this.tenGroup.strokeColor = strokeColors[indexColor];

        if (isGenerator) {

            this.tenGroup.blockType = 'TenGenerator';
            this.tenGroup.onMouseDown = function() { blockGenerator('TenBlock'); }

        } else {

            // blockType
            this.tenGroup.blockType = 'TenBlock';

            // mouse
            var that = this;
            var wasJustRemoved = false;
            var wasJustSelected = false;
            this.tenGroup.onMouseDown = function() { 
                legend.visible = false;
                legendBackground.visible = false;
                alert.visible = false;
                if (!selectedBlocks.isChild(that.tenGroup)) {
                    addToSelectedBlocks(that.tenGroup);
                    wasJustSelected = true;
                } else {
                    removeFromSelectedBlocks(that.tenGroup);
                    wasJustRemoved = true;
                }
            }
            this.tenGroup.onMouseDrag = function(event) { 
                if (wasJustRemoved) {
                    wasJustRemoved = false;
                    addToSelectedBlocks(that.tenGroup);
                }
                if (wasJustSelected) {
                    isCurrentlyDraggingBlocks = true; 
                    moveOneBlock(event, that.tenGroup);
                }
                if (!wasJustSelected) {
                    isCurrentlyDraggingBlocks = true; 
                    moveBlocks(event);
                }
            }
            this.tenGroup.onMouseUp = function() {                 
                if(selectedBlocks.children.length == 1 && isCurrentlyDraggingBlocks) {
                        removeFromSelectedBlocks(that.tenGroup);
                }
                isCurrentlyDraggingBlocks = false; 
                justStopDraging = true;
                wasJustSelected = false;
            }
        }
        this.tenGroup.bringToFront();

        return this.tenGroup;
    }
})

var HundredBlock = Base.extend({

    initialize: function(x, y, indexColor, scale, isGenerator) {

        this.hundredGroup = new Group();
        this.hundredGroup.indexColor = indexColor;

        // border
        var border = new Path(new Point(x, y + 10)*scale, 
        new Point(x + 10, y + 10)*scale, new Point(x + 10, y + 10)*scale + new Point(0.25*scale*Math.sqrt(3), -0.25*scale), 
        new Point(x + 10, y + 10)*scale + new Point(0.25*scale*Math.sqrt(3), -0.25*scale) + new Point(0, -10)*scale);
        border.strokeWidth = scale/10;
        border.strokeColor = strokeColors[indexColor];
        this.hundredGroup.border = border;
        this.hundredGroup.addChild(border);

        // blocks
        for(var m = 9; m > -1; m--) {
            for (var n = 0; n < 10; n++) {
                var frontSide = createFrontSide(x + n, y + m, scale);
                var rightSide = createRightSide(x + n, y + m, scale);
                var upSide = createUpSide(x + n, y, scale);
                this.hundredGroup.addChild(frontSide);
                this.hundredGroup.addChild(rightSide);
                this.hundredGroup.addChild(upSide);
            }
        }

        // block colors
        this.hundredGroup.indexColor = indexColor;
        this.hundredGroup.fillColor = colors[indexColor];
        this.hundredGroup.strokeWidth = scale/10;
        this.hundredGroup.strokeColor = strokeColors[indexColor];

        if (isGenerator) {

            this.hundredGroup.blockType = 'HundredGenerator';
            this.hundredGroup.onMouseDown = function() { blockGenerator('HundredBlock'); }

        } else {
            
            // blockType
            this.hundredGroup.blockType = 'HundredBlock';

            // mouse
            var that = this;
            var wasJustRemoved = false;
            var wasJustSelected = false;
            this.hundredGroup.onMouseDown = function() { 
                legend.visible = false;
                legendBackground.visible = false;
                alert.visible = false;
               if (!selectedBlocks.isChild(that.hundredGroup)) {
                    addToSelectedBlocks(that.hundredGroup);
                    wasJustSelected = true;
                } else {
                    removeFromSelectedBlocks(that.hundredGroup);
                    wasJustRemoved = true;
                }
            }
            this.hundredGroup.onMouseDrag = function(event) { 
                if (wasJustRemoved) {
                    wasJustRemoved = false;
                    addToSelectedBlocks(that.hundredGroup);
                }
                if (wasJustSelected) {
                    isCurrentlyDraggingBlocks = true; 
                    moveOneBlock(event, that.hundredGroup);
                }
                if (!wasJustSelected) {
                    isCurrentlyDraggingBlocks = true; 
                    moveBlocks(event);
                }
            }
            this.hundredGroup.onMouseUp = function() {
                if(selectedBlocks.children.length == 1 && isCurrentlyDraggingBlocks) {
                    removeFromSelectedBlocks(that.hundredGroup);
                }
                isCurrentlyDraggingBlocks = false;
                justStopDraging = true;
                wasJustSelected = false;
            }            
        }
        this.hundredGroup.bringToFront();

        return this.hundredGroup;
    }
})

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
        this.caption.point = this.shape.position + new Point(-2*buttonScale, 1.3*buttonScale);
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

var displayNumberSwitch = function() {

    displayDigit.visible = !displayDigit.visible;
    toggleButtonDisplayNumber.switch();
}

/* Radio button class */

var RadioButton = Base.extend({
    initialize: function(x, y, indexColor, buttonScale, scale, index) {

        this.index = index;

        this.shape = new Path.Circle(new Point(x*scale, y*scale), buttonScale*scale);
        this.shape.fillColor = colors[indexColor];
        this.shape.strokeColor = strokeColors[indexColor];
        this.shape.strokeWidth = 6*buttonScale;

        var that = this;
        this.shape.onMouseDown = function() { radioButtonSet.switchRadioButtonsTo(that.index); }

        return this;
    },
    switch: function(bool) {
        if (bool) {
            this.shape.shadowColor = new Color(0, 0, 0);
            this.shape.shadowBlur = 12;
            this.shape.shadowOffset = new Point(5, 5);
        } else {
            this.shape.shadowColor = null;
        }
    }
})


var RadioButtonSet = Base.extend({

    initialize: function(x, y, buttonScale, scale) {

        this.radioButtonIndexSelected = 0;
        var radioButtonSettings = {
            x: x, 
            y: y,
            interval: 2.5, 
            scale: buttonScale
        }
        var radioButtonSet =  [];

        for(var n=0; n < 5; n++) {
            radioButtonSet.push(
                new RadioButton(radioButtonSettings.x + n*radioButtonSettings.interval, 
                    radioButtonSettings.y, n, radioButtonSettings.scale, scale, n))
        }

        this.radioButtonSet = radioButtonSet;
        return this;
    }, 
    switchRadioButtonsTo: function(index) {
        this.radioButtonIndexSelected = index;
        for(var n = 0; n<5; n++) { this.radioButtonSet[n].switch(n == index); }
        updateCreatorBlocksColor();
    },
    getIndexSelected: function() {
        return this.radioButtonIndexSelected;
    }
})

var updateCreatorBlocksColor = function() {

    var indexColor = radioButtonSet.getIndexSelected();

    if(unitBlockCreator && tenBlockCreator && hundredBlockCreator) {

        unitBlockCreator.strokeColor = strokeColors[indexColor];
        unitBlockCreator.fillColor = colors[indexColor];
        unitBlockCreator.border.strokeColor = colors[indexColor];
    
        tenBlockCreator.strokeColor = strokeColors[indexColor];
        tenBlockCreator.fillColor = colors[indexColor];
        tenBlockCreator.border.strokeColor = colors[indexColor];
    
        hundredBlockCreator.strokeColor = strokeColors[indexColor];
        hundredBlockCreator.fillColor = colors[indexColor];
        hundredBlockCreator.border.strokeColor = colors[indexColor];
    }
}

/* Select tools */

var size = new Size();
var selectArea = new Rectangle();
var dragZone;

tool.onMouseDown = function(event) {

    legend.visible = false;
    legendBackground.visible = false;

    var hitResult = project.hitTest(event.point, hitOptions);

    if (!hitResult) {

        justStopDraging = false;
        selectArea.point = event.point;
        var blockList = project.getItems({ class: Group, blockType: /Block/ });
        for(var block in blockList) { blockList[block].border.shadowColor = null; }
        selectedBlocks = new Group();
        alert.visible = false;
    }
}

tool.onMouseDrag = function(event) {

    if (dragZone) { dragZone.remove(); }

    if (!isCurrentlyDraggingBlocks) {
        dragZone = new Path.Rectangle(new Rectangle(event.downPoint, event.lastPoint))
        dragZone.strokeColor = colors[2];
        dragZone.strokeWidth = 2;
        dragZone.strokeCap = 'round';
        dragZone.dashArray = [10, 12];
    }
}

tool.onMouseUp = function(event) {

    if (!justStopDraging) {

        if (dragZone) { dragZone.remove(); }
        selectArea.size = event.delta;
        var blockList = project.getItems({ inside: selectArea, class: Group, blockType: /Block/ });
        for(var block in blockList) { addToSelectedBlocks(blockList[block]);}
        groupBlocks(selectedBlocks);
    }
}

/* scene */

var scale = 20;
var colors = ['#68b147', '#41b1fc', '#E3AAFF', '#fdab78', '#fc5c5e', '#FFABD5']; // green, blue, purple, orange, red, pink
var strokeColors = ['#389818', '#1a9bfc', '#CC66FF', '#fc6922', '#fc0d1b', '#FF8FC8'];

var selectedBlocks = new Group();
var isCurrentlyDraggingBlocks = false;
var justStopDraging = false;
var xu = xt = xh = 15;
var yu = 2, yt = yu + 4, yh = yu + 15;
var unitBlocksToMove = [];
var tenBlocksToMove = [];
var animationFired = false;
var digitMatrix = [0, 0, 0];
var displayDigit = new PointText();
var legendTopLeft = {x:18, y:3};
var alert = new PointText();
var legend = new PointText();
var legendBackground = new Path.Rectangle();

var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };

disableScroll();

// alert
alert = new PointText({
    point: [(legendTopLeft.x+5)*scale, (legendTopLeft.y+10)*scale],
    content: 'Trop de blocs !',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 3*scale, 
    visible: false
});

// legend
legend = new PointText({
    point: [legendTopLeft.x*scale, legendTopLeft.y*scale],
    content: 
    'Souris et raccourcis claviers :\n'  +
    '\n'  +
    'a : affiche l\'aide\n' +
    'Flèches : déplacements\n' +
    'échap : annule la sélection\n' +
    'suppr : efface la sélection\n' +
    'r : montre/cache le résultat\n' +
    'e : efface tout\n\n' +
    'Sélectionnez à la souris les blocs à regrouper\n' + 
    'un par un, ou bien en créant une zone',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25
});

legend.onMouseDown = function(event) { 
    legend.visible = false;
    legendBackground.visible = false;
};

legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft, legend.bounds.size));
var legendBackground = new Path.Rectangle(new Rectangle(new Point((legendTopLeft.x - 4)*scale, (legendTopLeft.y-2)*scale), new Size(50*scale, 30*scale)));
legendBackground.fillColor = '#ffffff';
legendBackground.bringToFront();
legend.bringToFront();

var line = new Path(new Point(13, 0.5)*scale, new Point(13, 38.5)*scale);
line.strokeColor = 'black';
line.strokeWidth = scale/5;
line.strokeCap = 'round';

var toggleButtonDisplayNumber = new ToggleButton(4.7, 24, 1.5, '#133337', '#C0C0C0', 'Nombre affiché', 'Nombre caché', scale, displayNumberSwitch, true);
var radioButtonSet = new RadioButtonSet(1.3, 2, .8, scale);
radioButtonSet.switchRadioButtonsTo(2);

var blockCreatorScale = 1;
var unitBlockCreator = new UnitBlock(5.5/blockCreatorScale, (yu + 2)/blockCreatorScale, radioButtonSet.getIndexSelected(), blockCreatorScale*scale, true);
var tenBlockCreator = new TenBlock(1/blockCreatorScale, yt/blockCreatorScale, radioButtonSet.getIndexSelected(), blockCreatorScale*scale, true);
var hundredBlockCreator = new HundredBlock(1/blockCreatorScale, (yh - 9)/blockCreatorScale, radioButtonSet.getIndexSelected(), blockCreatorScale*scale, true);

displayResult();

/* keys control */
function onKeyDown(event) {

    console.log(event.key);

    if (event.key != 'a') {
        legend.visible = false;
        legendBackground.visible = false;
    };
    if(event.key == 'left') {
        selectedBlocks.position -= new Point(scale, 0);
    }
    if(event.key == 'right') {
        selectedBlocks.position += new Point(scale, 0);
    }
    if(event.key == 'up') {
        selectedBlocks.position -= new Point(0, scale);
    }
    if(event.key == 'down') {
        selectedBlocks.position += new Point(0, scale);
    }
    if(event.key == 'escape') {
        selectedBlocks.shadowColor = null;
        selectedBlocks = new Group();
    }
    if(event.key == 'backspace') {

        var numberOfBlocks = selectedBlocks.children.length;
        for(var n = 0; n < numberOfBlocks; n++) { 
            if(selectedBlocks.children[n].blockType == "UnitBlock") { digitMatrix[0]-- ; };
            if(selectedBlocks.children[n].blockType == "TenBlock") { digitMatrix[1]--; };
            if(selectedBlocks.children[n].blockType == "HundredBlock") { digitMatrix[2]--; };
        }
        displayResult();
    
        selectedBlocks.removeChildren();
    }
    if(event.key == 'r') { displayNumberSwitch(); }
    if(event.key == 'e') {
        var cleanArea = new Rectangle(new Point(10, 0)*scale, new Point(300, 200)*scale);
        var blockListToRemove = project.getItems({ inside: cleanArea, class: Group, blockType: /Block/ });
        for(var id in blockListToRemove) { blockListToRemove[id].remove(); }
        selectedBlocks = new Group();
        isCurrentlyDraggingBlocks = false;
        justStopDraging = false;
        unitBlocksToMove = [];
        tenBlocksToMove = [];
        animationFired = false;
        digitMatrix = [0, 0, 0];
        xu = xt = xh = 15;
        yu = 2, yt = yu + 4, yh = yu + 15;
        legend.visible = false;
        legendBackground.visible = false;
        alert.visible = false;
        displayResult();
    }
    // a : legend
    if (event.key == 'a') {
        legend.visible = !legend.visible;
        legendBackground.visible = !legendBackground.visible;
        legendBackground.bringToFront();
        legend.bringToFront();
    };
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