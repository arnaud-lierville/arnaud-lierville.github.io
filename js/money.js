/* Money Class */

var Money = Base.extend({

    initialize: function(point, value, side, type, scale, isGenerator) {

        this.point = point;
        this.scale = scale;
        this.side = side;
        this.type = type;

        this.picture = new Raster(value.toString().replace('.', '') + this.side);
        this.picture.position = this.point;
        this.picture.scale(this.scale)
        this.picture.bringToFront();
        this.picture.isGenerator = isGenerator;
        this.picture.value = value;
        this.picture.isSelected = false;

        if (!this.picture.isGenerator) { sum += value*100; displaySum(); }

        this.currentlyDragging = false;
        addMouseToolsToPicture(this);

        return this;
    },
    switch: function() {

        if (this.type == 'note') {

            if(this.side == 'R') { this.side = 'V'; } else { this.side = 'R'; }
            var currentPosition = this.picture.position;
            var currentIsGeneratorFlag = this.picture.isGenerator;
            var currentValue = this.picture.value;
            this.picture.remove();
            this.picture = new Raster(currentValue.toString() + this.side);
            this.picture.position = currentPosition;
            this.picture.isGenerator = currentIsGeneratorFlag;
            this.picture.value = currentValue;
            this.picture.isSelected = true;
            if(!currentIsGeneratorFlag) { moneySelected.addRaster(this.picture); }
            this.picture.scale(this.scale)
            this.picture.bringToFront();
    
            this.currentlyDragging = false;
            addMouseToolsToPicture(this);
        }
        return;
    },
    turnOShadow: function() {
        this.picture.bringToFront();
        this.picture.shadowColor = 'grey';
        this.picture.shadowBlur = 12;
        this.picture.shadowOffset = new Point(40, 40);
    }
});

var addMouseToolsToPicture = function(moneyObject) { // pass parameter this

    var that = moneyObject;

    moneyObject.picture.onMouseDown = function() { 
        if(that.picture.isGenerator) { 
            moneySelected.unselectAllRaster();
        } else {
            if(!that.picture.isSelected) { moneySelected.addRaster(that.picture); }
        }
    }
    moneyObject.picture.onMouseDrag = function(event) {
        if(that.picture.isGenerator) { that.picture.position += event.delta; } else { 
            moneySelected.rasterGroup.position += event.delta;
        }
        that.turnOShadow();
        that.currentlyDragging = true; 
    }
    moneyObject.picture.onMouseUp = function() {
        if(!that.currentlyDragging) { 
            if(!that.picture.isGenerator) { that.switch(); } else {
                var aleaX = 10 + Math.floor(Math.random()*8);
                var aleaY = 4 + Math.floor(Math.random()*5);
                var newMoney = new Money(new Point(aleaX, aleaY)*globalScale,
                that.picture.value, that.side, that.type, that.scale, false);
            } 
        } else {
            if(that.picture.isGenerator) {
                if(that.picture.position.x > 5*globalScale) {
                    var newMoney = new Money(that.picture.position, that.picture.value, that.side, that.type, that.scale, false);
                    newMoney.picture.position.x = Math.max(newMoney.picture.position.x, 7*globalScale);
                } 
                that.picture.position = that.point;
                that.picture.shadowColor = null;
            } else {
                if(that.picture.position.x < 5*globalScale) { that.picture.remove(); }
                that.picture.shadowColor = null;
            }
        }
        that.currentlyDragging = false; 
    }
}

var MoneySelected = Base.extend({

    initialize: function() {

        this.value = 0;
        this.rasterList = [];
        this.rasterGroup = new Group();

        return this;
    },
    addRaster: function(raster) {

        this.value += raster.value*100;
        this.rasterList.push(raster);
        this.rasterGroup.addChild(raster);

        raster.shadowColor = 'grey';
        raster.shadowBlur = 12;
        raster.shadowOffset = new Point(40, 40);
        raster.isSelected = true;

        return;
    },
    unselectRaster: function(raster) {

        var rasterIndex = this.rasterList.indexOf(raster);

        if (rasterIndex !== -1) { 
            this.rasterList.splice(rasterIndex, 1); 
            this.value -= raster.value*100;
            this.rasterGroup = new Group();
            for(var item in this.rasterList) { this.rasterGroup.addChild(this.rasterList[item]); }
            raster.shadowColor = null;
            raster.isSelected = false;
        }

        return;
    },
    unselectAllRaster: function() {

        for(var item in this.rasterList) { this.rasterList[item].isSelected = false; }
        this.rasterGroup.shadowColor = null;
        this.value = 0;
        this.rasterList = [];
        this.rasterGroup = new Group();

        return;
    },
    removeAllRaster: function() {

        for(var item in this.rasterList) { this.rasterList[item].isSelected = false; }
        var valueToRemove = this.value;
        this.value = 0;
        this.rasterList = [];
        this.rasterGroup.removeChildren();

        return valueToRemove;
    },
    getRasterList: function() {
        var len = this.rasterGroup.children.length;
        var rasterList = [];
        for(var n = 0; n < len; n++) { rasterList.push(this.rasterGroup.children[n]); }

        return rasterList;
    }
})

/* Toggle buttons */

var ToggleButton = Base.extend({

    initialize: function (x, y, size, colorON, colorOFF, scale, refreshCallback, initState) {

        this.x = x;
        this.y = y;
        this.size = size;
        this.colorON = colorON;
        this.colorOFF = colorOFF;
        this.scale = scale;
        this.isON = initState;

        var buttonScale = this.size*this.scale;
        var rectangle = new Rectangle(new Point(this.x*this.scale, this.y*this.scale), new Size(1.75*buttonScale, 1*buttonScale));
        var cornerSize = new Size(buttonScale/2, 2*buttonScale/3);
        this.shape = new Shape.Rectangle(rectangle, cornerSize);
        this.shape.fillColor = this.colorON;
        this.shape.strokeWidth = 0;

        this.circle = new Shape.Circle(new Point(this.x*this.scale +0.5*buttonScale, this.y*this.scale +0.5*buttonScale), .45*buttonScale);
        this.circle.fillColor = "#ffffff";
        this.circle.strokeWidth = 0;
        
        this.toggleButtonGroup = new Group();
        this.toggleButtonGroup.addChild(this.shape);
        this.toggleButtonGroup.addChild(this.circle);

        this.toggleButtonGroup.onMouseDown = function() { if(!animationFired) { refreshCallback(); } }

        return this;
    },
    switch: function() {

        if (this.isON) {
            this.shape.fillColor = this.colorOFF;
            this.circle.position += new Point(.75*this.size*this.scale, 0);
        } else {
            this.shape.fillColor = this.colorON;
            this.circle.position -= new Point(.75*this.size*this.scale, 0);
        }
        this.isON = !this.isON;        
    }
});

/* Button class */

var Button = Base.extend({
    initialize: function(x, y, color, strokeColor, fontSizeScale, textColor, caption, scale, refreshCallback) {

        this.buttonText = new PointText();
        this.buttonText.point = new Point(x*scale,y*scale);
        this.buttonText.fillColor = textColor;
        this.buttonText.fontFamily = 'sans-serif';
        this.buttonText.fontWeight = 'normal';
        this.buttonText.fontSize = fontSizeScale*scale;
        this.buttonText.content = caption;
        this.wasJustClicked = false;

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
        var that = this;
        this.buttonGroup.onMouseDown = function() { 
            if(!animationFired) {
                that.wasJustClicked = true; 
                refreshCallback();
            }
        }
    }
});

var displayNumberSwitch = function() {
    sumPointText.visible = !sumPointText.visible;
    toggleButtonDisplayNumber.switch();
}

var displayHelp = function() {
    legend.visible = !legend.visible;
    legendBackground.visible = !legendBackground.visible;
    catPic.visible = !catPic.visible;
    legendBackground.bringToFront()
    legend.bringToFront();
    catPic.bringToFront();
}

var displaySum = function() {

    sumPointText.remove();

    sumPointText = new PointText({
        point: new Point(14.5, 2)*globalScale,
        fontFamily: 'system-ui',
        fontWeight: 'bold',
        fontSize: 1.5*globalScale,
        fillColor: 'grey'
    })

    var sumText = sum.toString();
    var len = sumText.length;
    var content = '0';
    if(len > 2) { 
        if(sum - Math.floor(sum/100)*100 != 0) { 
            content = sumText.substring(0, sumText.length - 2) + ',' + sumText.substring(sumText.length - 2);
         } else {
            content = sumText.substring(0, sumText.length - 2);
         }
     }
    if(len == 2) { content = '0,' + sumText; }
    if(len == 1 && sum != 0) {content = '0,0' + sumText; }

    sumPointText.content = content + ' \u20AC';
    sumPointText.bringToFront();
    sumPointText.visible = toggleButtonDisplayNumber.isON;
}

var groupSelectedMoney = function() {

    // compute decomposition
    var sumToGroup = moneySelected.value;

    for(var index in valueList) {
        decomposition['n' + valueList[index].toString()] = Math.floor(sumToGroup/(valueList[index]*100));
        sumToGroup -= valueList[index]*100*decomposition['n' + valueList[index].toString()];
    }

    //animation
    moneyToMove = moneySelected.getRasterList();
    view.on('frame', animation);
}

var animation = function onFrame(event) {
    animationFired = true;
    var vectors = [];
    
    for (var n = 0; n < moneyToMove.length; n++) {
        var index = Math.max(valueList.indexOf(moneyToMove[n].value) -1, 0) ;
        vectors[n] = new Point(7 + index/1.5, 10)*globalScale - moneyToMove[n].position;
        moneyToMove[n].position += vectors[n] / 30;
    }
    var vectorsLengthList = [];
    for (var n = 0; n < moneyToMove.length; n++) { vectorsLengthList.push(vectors[n].length); }
    if (Math.max.apply(Math, vectorsLengthList)<1.5) {
        animationFired = false;
        var valueToRemove =  moneySelected.removeAllRaster();
        sum -= valueToRemove;
        for(var index in valueList) {
            var moneyNumber = decomposition['n' + valueList[index].toString()];
            if(moneyNumber != 0) {
                for(var n = 0; n < moneyNumber; n++) {
                    var value = valueList[index];
                    var type = 'note';
                    if(value < 5) { type = 'coin'; }
                    var newPoint = new Point(7 + index/1.5 , 10 + n/5)*globalScale;
                    new Money(newPoint, value, 'R', type, monneySizeList[index], false);
                }
            }
        }
        displaySum();

        paper.view.detach('frame', this.onFrame);
    }
};

/* Keys functions */

function onKeyDown(event) {

    console.log(event.key);

    if(!animationFired) {

        if(event.key != 'a') {
            legend.visible = false;
            legendBackground.visible = false;
            catPic.visible = false;
        }
        // help
        if(event.key == 'a') { displayHelp(); }
        // moving
        if(event.key == 'left') { moneySelected.rasterGroup.position.x -= 1*globalScale; }
        if(event.key == 'right') { moneySelected.rasterGroup.position.x += 1*globalScale; }
        if(event.key == 'up') { moneySelected.rasterGroup.position.y -= 1*globalScale; }
        if(event.key == 'down') { moneySelected.rasterGroup.position.y += 1*globalScale; }
    
        // clear all
        if(event.key == 'e') {
            var cleanArea = new Rectangle(new Point(0, 0)*globalScale, new Point(50, 50)*globalScale);
            var moneyToRemove = project.getItems({ inside: cleanArea, class: Raster, isGenerator: false });
            for(var id in moneyToRemove) {
                sum -= moneyToRemove[id].value*100;
                moneyToRemove[id].remove();
            }
            displaySum();
        }
        // delete selected moeny
        if(event.key == 's') {
            var valueToRemove =  moneySelected.removeAllRaster();
            sum -= valueToRemove;
            displaySum();
        }
        // unselect selected money
        if(event.key == 'space') { moneySelected.unselectAllRaster(); }
        // group money
        if(event.key == 'g') { groupSelectedMoney(); }
        // displayNumberSwitch
        if(event.key == 'r') { displayNumberSwitch(); }
    }
}

/* Mouse functions */

tool.onMouseDown = function(event) {

    if(!animationFired) {
        if(!helpButton.wasJustClicked) {
            legend.visible = false;
            legendBackground.visible = false;
            catPic.visible = false;
        }
        hitResult = project.hitTest(event.point, hitOptions);
    
        if (!hitResult) {
            justStopDraging = false;
            selectArea.point = event.point;
        }
    }
}

tool.onMouseDrag = function(event) {

    if(!animationFired) {
        if (!hitResult) {
            if (dragZone) { dragZone.remove(); }
            dragZone = new Path.Rectangle(new Rectangle(event.downPoint, event.lastPoint))
            dragZone.strokeColor = 'grey';
            dragZone.strokeWidth = 2;
            dragZone.strokeCap = 'round';
            dragZone.dashArray = [10, 12];
        }
    }
}

tool.onMouseUp = function(event) {

    if(!animationFired) {
        if (!hitResult) {

            if (dragZone) { dragZone.remove(); }
            selectArea.size = event.delta;
            var moneyList = project.getItems({ inside: selectArea,  class: Raster, isGenerator: false });
            moneySelected.unselectAllRaster();
            for(var money in moneyList) { moneySelected.addRaster(moneyList[money]);}
    
        } else { 
            if (moneySelected.rasterGroup.position.x < 5*globalScale && !helpButton.wasJustClicked) { 
                var valueToRemove = moneySelected.removeAllRaster();
                sum -= valueToRemove;
                displaySum();
            }
            hitResult = null; 
            if (!groupButton.wasJustClicked) { moneySelected.unselectAllRaster(); } else { groupButton.wasJustClicked = false; }
            helpButton.wasJustClicked = false;
        }
    }
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

/* Scene */

// global variables
var globalScale = 50;
var sumPointText = new PointText();
var sum = new Number(0);
var moneyToMove = [];
var hitResult;
var monneySizeList = [.16, .34, .35, .245, .24, .24, .2, .13, .13, .13, .13, .13, .13, .12, .1];
var valueList = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01];
var decomposition = {};
var legendTopLeft = {x:7.5 , y:2};
var legend = new PointText();
var legendBackground = new Path.Rectangle();
var animationFired = false;

var selectArea = new Rectangle();
var dragZone;
var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };
var justStopDraging = false;
var moneySelected = new MoneySelected();
var hitResult;

disableScroll();

var line = new Path(new Point(5, 0.5)*globalScale, new Point(5, 11.7)*globalScale);
line.strokeColor = 'grey';
line.strokeWidth = globalScale/10;
line.strokeCap = 'round';

var toggleButtonDisplayNumber = new ToggleButton(6, 1, 1, '#133337', '#C0C0C0', globalScale, displayNumberSwitch, true);
var groupButton = new Button(5.8, 3, '#68b147', '#389818', .5, '#ffffff', 'Echanges', globalScale, groupSelectedMoney);
var helpButton = new Button(6.4, 4, '#FFABD5', '#FF8FC8', .5, '#ffffff', 'Aide', globalScale, displayHelp);

// legend
legend = new PointText({
    point: [legendTopLeft.x*globalScale, legendTopLeft.y*globalScale],
    content: 
    'Souris et raccourcis claviers :\n'  +
    '\n'  +
    'a : affiche l\'aide\n' +
    'Flèches : déplacements de la monnaie selctionnée\n' +
    'espace : annule la sélection\n' +
    's : supprime la monnaie sélectionnée\n' +
    'g : fait les échanges de monnaie\n' +
    'r : montre/cache le résultat\n' +
    'e : efface tout\n\n' +
    'Cliquez sur la monnaie pour en créer\n' + 
    'Déplacez de la monnaie depuis la gauche pour en créer\n' + 
    'Créez une zone de selection à la souris\n' + 
    'Déplacer la monnaie à la souris\n' + 
    'Cliquez sur un billet pour le retourner\n' + 
    'Déplacez de la monnaie depuis la droite pour la supprimer',
    fillColor: '#0c6675',
    fontFamily: 'fantasy',
    fontWeight: 'bold',
    fontSize: 25
});

legend.onMouseDown = function(event) { 
    legend.visible = false;
    legendBackground.visible = false;
    catPic.visible = false;
};

legendBackground = new Path.Rectangle(new Rectangle(legend.bounds.topLeft, legend.bounds.size));
var legendBackground = new Path.Rectangle(new Rectangle(new Point((legendTopLeft.x - 2)*globalScale, (legendTopLeft.y-3)*globalScale), new Size(16*globalScale, 20*globalScale)));
legendBackground.fillColor = '#ffffff';
legendBackground.bringToFront();
legend.bringToFront();

// logo
var catPic = new Raster('logo');
catPic.position = legend.bounds.topRight + new Point(-3*globalScale, 0.5*globalScale);
catPic.scale(0.1);
catPic.bringToFront();

/* notes */
var fiveEuros = new Money(new Point(1.5, 1)*globalScale, 5, 'R', 'note', .2, true);
var tenEuros = new Money(new Point(1.5, 2.65)*globalScale, 10, 'R', 'note', .24, true);
var twentyEuros = new Money(new Point(1.5, 4.35)*globalScale, 20, 'R', 'note', .24, true);
var fiftyEuros = new Money(new Point(1.5, 6.1)*globalScale, 50, 'R', 'note', .245, true);
var hundredEuros = new Money(new Point(1.5, 7.8)*globalScale, 100, 'R', 'note', .35, true);
var twoHundredEuros = new Money(new Point(1.5, 9.45)*globalScale, 200, 'R', 'note', .34, true);
var fiveHundredEuros = new Money(new Point(1.5, 11.1)*globalScale, 500, 'R', 'note', .16, true);

/* coins */
var twoEuros = new Money(new Point(4, 1.3)*globalScale, 2, 'R', 'coin', .13, true);
var oneEuro = new Money(new Point(4, 2.9)*globalScale, 1, 'R', 'coin', .13, true);
var fiftyCents = new Money(new Point(4, 4.5)*globalScale, 0.5, 'R', 'coin', .13, true);
var twentyCents = new Money(new Point(4, 6)*globalScale, 0.2, 'R', 'coin', .13, true);
var tenCents = new Money(new Point(4, 7.35)*globalScale, 0.1, 'R', 'coin', .13, true);
var fiveCents = new Money(new Point(4, 8.7)*globalScale, 0.05, 'R', 'coin', .13, true);
var twoCents = new Money(new Point(4, 10)*globalScale, 0.02, 'R', 'coin', .12, true);
var oneCents = new Money(new Point(4, 11)*globalScale, 0.01, 'R', 'coin', .1, true);