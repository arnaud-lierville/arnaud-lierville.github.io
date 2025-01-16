paper.view.onResize = function() {
    project.clear()
    drawApp(paper.view.bounds.width/30);
  };

function drawApp(gridScale) {

    disableScroll();

    var unit = gridScale/3;
    var tileWidth = 3.4 * unit;
    var planWidth = Math.floor(paper.view.bounds.width / tileWidth) + 1;
    var planHeight = Math.floor(paper.view.bounds.height / tileWidth) + 2;
    var gridGroup = new Group();
    var isGridVisible = false;
    var isMonochrome = false;
    gridGroup.visible = isGridVisible;
    var numiconColors = ['#3560D5', '#E98A67', '#88A1CE', '#EAC547', '#8ED284', '#D7443F', '#58B9B3', '#E56D72', '#3B8125', '#602E72'];
    // var numiconGrayColors = ['#4B4B4B', '#7A7A7A', '#9E9E9E', '#B3B3B3', '#8C8C8C', '#666666', '#AAAAAA', '#8F8F8F', '#5C5C5C', '#3F3F3F'];
    var numiconUniqueGrayColors = '#B3B3B3'
    var numiconStokeColors = ['#002080', '#A04000', '#004080', '#A08000', '#008040', '#800000', '#006060', '#800040', '#004000', '#400040'];
    var gridFillColor = "#74abb5";
    var hitOptions = { segments: true, stroke: true, fill: true, tolerance: 5 };
    var activeNumicon = null;
    // TODO: appui long => symmetry
    // var clickDownTime = undefined
    // var clickUpTime = undefined
    var numiconGroup = new Group();

    function gridSetup(color) {
        for (var y = 2; y < planHeight; y++) {
            for(var x = 1; x < planWidth; x++) {
                var circle = new Path.Circle({ center: new Point(x, y)*tileWidth, radius: 2, fillColor: color });
                gridGroup.addChild(circle);
            };
        };
        gridGroup.sendToBack();
    };

    gridSetup(gridFillColor);

    var Tile = Base.extend({
        initialize: function (x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.circle = new Path.Circle({
                center: [this.x, this.y],
                radius: unit,
            });
            this.rectangle = new Path.Rectangle(new Point(this.x - tileWidth/2, this.y - tileWidth/2), new Size(tileWidth, tileWidth));
            var tile = this.rectangle.subtract(this.circle);
            tile.fillColor = this.color;
            return tile;
        }
    });

    //TODO: refactor to use Tile => plain tile with a number
    var NumiconMenu = Base.extend({
        initialize: function (number) {
            var color = numiconColors[number%10];
            var strokeColor = numiconStokeColors[number%10];
            var numiconMenu = new Tile((number*1.1) * tileWidth, 1 * tileWidth, color);
            numiconMenu.strokeColor = strokeColor;
            numiconMenu.strokeWidth = 2;
            numiconMenu.onMouseDown = function (event) {
                if(activeNumicon) { 
                    activeNumicon.levitate(false);
                    activeNumicon = null;
                 }
                activeNumicon = new Numicon(number%10);
                activeNumicon.levitate(true);
            }
            numiconMenu.isSelectable = false;
            return numiconMenu;
        }
    });

    var Numicon = Base.extend({
        initialize: function (keynumber) {

            var pos_x = Math.floor(Math.random() * 15 + 1) * tileWidth;
            var pos_y = Math.floor(Math.random() * 3 + 3) * tileWidth;
            this.number = keynumber;
            this.color = numiconColors[this.number];
            this.grayColor = numiconUniqueGrayColors;// numiconGrayColors[this.number]
            this.strokeColor = numiconStokeColors[this.number];
            if (this.number == 0) {
                this.number = 10;
            }

            var numicon = new Tile(pos_x, pos_y, this.color);
            var lastNumicon = numicon;
            var tileToRemove = [], numiconToRemove = [numicon]
            var val = 0, j = 0;
            while (val < this.number) {
                for (var i = 0; i < 2; i++) {
                    if (val < this.number) {
                        var tile = new Tile(pos_x + i * tileWidth, pos_y + j * tileWidth, this.color);
                        numicon = numicon.unite(tile);
                        tileToRemove.push(tile)
                        numiconToRemove.push(numicon)
                        lastNumicon = numicon;
                    }
                    val++;
                }
                j++;
            }

            for (var i = 0; i < numiconToRemove.length - 1; i++) { 
                tileToRemove[i].remove()
                numiconToRemove[i].remove()
            }
            tileToRemove[tileToRemove.length - 1].remove()
            numicon = lastNumicon;

            numicon.defaultColor = this.color;
            numicon.defaultStrokeColor = this.strokeColor;
            numicon.defaultGrayColor = this.grayColor;
            numicon.strokeWidth = 2;

            numicon.number = this.number;
            numicon.nbLines = Math.floor((numicon.number + 1) / 2)
            numicon.nbColomns = numicon.number === 1 ? 1 : 2
            numicon.isSelectable = true;

            numicon.levitate = function (bool) {
                if (bool) {
                    numicon.shadowColor = new Color(0, 0, 0);
                    numicon.shadowBlur = 12;
                    numicon.shadowOffset = new Point(5, 5);
                    numicon.bringToFront();
                } else {
                    numicon.shadowColor = null;
                }
            }
            
            numicon.levitate(false)

            numicon.swithColor = function(isMonochrome) {
                if(activeNumicon) { 
                    activeNumicon.levitate(false);
                    activeNumicon = null;
                 }
                if(isMonochrome) {
                    numicon.fillColor = numicon.defaultGrayColor;
                    numicon.strokeColor = '#000000'
                } else {
                    numicon.fillColor = numicon.defaultColor;
                    numicon.strokeColor = numicon.defaultStrokeColor;
                }
            }

            numicon.swithColor(isMonochrome)

            numicon.delete = function() {
                this.remove()
            }

            numicon.onMouseDrag = function (event) {
                if(activeNumicon) { 
                    activeNumicon.levitate(false);
                    activeNumicon = null;
                 }
                numicon.levitate(true)
                activeNumicon = numicon
                numicon.position += event.delta;
            }

            numicon.onMouseUp = function (event) {
                // var delta_x = numicon.number > 1 ? tileWidth/2 : 0; // si ça fait plus de 1 de large !ROTATION
                // var delta_y = numicon.number == 3 || numicon.number == 4 || numicon.number == 7 || numicon.number == 8 ? tileWidth/2 : 0; //!ROTATION
                var delta_x = computeDelta(numicon.nbLines, numicon.nbColomns, tileWidth)[0];
                var delta_y = computeDelta(numicon.nbLines, numicon.nbColomns, tileWidth)[1];
                numicon.position.x = numicon.position.x - numicon.position.x % tileWidth + delta_x;
                numicon.position.y = numicon.position.y - numicon.position.y % tileWidth+ delta_y;
            }

            numicon.isRotated = 0
            numicon.doRotate = function () {

                numicon.rotate(-90)
                numicon.isRotated = (numicon.isRotated + 1)%4

                var temp = numicon.nbLines
                numicon.nbLines = numicon.nbColomns
                numicon.nbColomns = temp

                var delta_x = computeDelta(numicon.nbLines, numicon.nbColomns, tileWidth)[0];
                var delta_y = computeDelta(numicon.nbLines, numicon.nbColomns, tileWidth)[1];
                numicon.position.x = numicon.position.x - numicon.position.x % tileWidth + delta_x;
                numicon.position.y = numicon.position.y - numicon.position.y % tileWidth + delta_y
            }

            numiconGroup.addChild(numicon)
            return numicon;
        }
    });

    var computeDelta = function(a,b, tileWidth) {
        if (a==1 && b== 1) {
            return [0,0]
        }
        if (a==2 && b==2) {
            return [1*tileWidth/2,1*tileWidth/2]
        }
        if (b==2) {
            return [1*tileWidth/2,((a+1)%2)*tileWidth/2]
        }
        if (a==2) {
            return [((b+1)%2)*tileWidth/2,1*tileWidth/2]
        }
    }

    /* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
    /* MOUSE */
    /* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

    //onMouseDown
    //TODO: traiter le cas où on clique sur grid (Path)
    view.onMouseDown = function(event) {
        //resetKeySequence()
        var hitResult = project.hitTest(event.point, hitOptions);
        if (!hitResult) { 
            if (activeNumicon) { 
                activeNumicon.levitate(false);
                activeNumicon = null;
            }
            //if (legend.visible) { switchLegend() }
            return; 
        } else {
            if (hitResult.type == 'fill') {
                thisItem = hitResult.item;
                if (thisItem.isSelectable) {
                    if(thisItem == activeNumicon) { 
                        activeNumicon.levitate(false);
                        activeNumicon = null;
                    } else {
                        if (activeNumicon) { 
                            activeNumicon.levitate(false);
                            activeNumicon = thisItem;
                         };
                        activeNumicon = thisItem;
                        activeNumicon.levitate(true)
                        //clickDownTime = Date.now()
                    }
                };
            };
        };
    };

    /* Icon menu */

    // IconMenu Class
    var IconMenu = Base.extend({
        initialize: function (point, name, scale, callback) {
            var picture = new Raster(name);
            picture.position = point;
            picture.scale(scale)
            picture.onMouseDown = function () {
                //turnOFFLegend();
                callback();
            }
            picture.isSelectable = false;
            return picture;
        }
    })

    // callback functions
    var rotateCallback = function () {
        console.log('rotateCallback');
        if(activeNumicon) { 
            activeNumicon.doRotate();
        }
    }

    var symmetryCallback = function () {
        console.log('symmetryCallback');
        if(activeNumicon) { 
            activeNumicon.scale(-1, 1);
        }
    }

    var deleteCallback = function () {
        console.log('deleteCallback');
        if (activeNumicon) { 
            activeNumicon.delete();
            activeNumicon = null;
        };
    }

    var trashCallback = function () {
        console.log('trashCallback');
        numiconGroup.removeChildren();
    }

    var helpCallback = function () {
        console.log('helpCallback');
    }

    var gridCallback = function () {
        console.log('gridCallback');
        isGridVisible = !isGridVisible;
        gridGroup.visible = isGridVisible;
    }

    var toogleCallback = function () {
        console.log('toogleCallback');
        isMonochrome = !isMonochrome;
        iconMonochromeOFF.visible = !isMonochrome
        iconMonochromeON.visible = isMonochrome
        for(var index in numiconGroup.children) { 
            numiconGroup.children[index].swithColor(isMonochrome)
         }   
    }

    new IconMenu(new Point(14.4, 1.1) * gridScale, 'rotate', .08*gridScale/36, rotateCallback)
    new IconMenu(new Point(15.55, 1.15) * gridScale, 'symmetry', .065*gridScale/36, symmetryCallback)
    new IconMenu(new Point(16.8, 1.15) * gridScale, 'delete', .075*gridScale/36, deleteCallback)

    new IconMenu(new Point(19, 1.15) * gridScale, 'grid', .08*gridScale/36, gridCallback)
    var iconMonochromeOFF = new IconMenu(new Point(20.2, 1.15) * gridScale, 'toggle-on', .07*gridScale/36, toogleCallback)
    iconMonochromeOFF.visible = true
    var iconMonochromeON = new IconMenu(new Point(20.2, 1.15) * gridScale, 'toggle-off', .07*gridScale/36, toogleCallback)
    iconMonochromeON.visible = false
    new IconMenu(new Point(21.3, 1.1) * gridScale, 'trash', .08*gridScale/36, trashCallback)
    new IconMenu(new Point(22.5, 1.1) * gridScale, 'help', .08*gridScale/36, helpCallback)

    // Numicon Menu
    for (var i = 1; i < 11; i++) {
        new NumiconMenu(i);
    }

    // Keyboard events
    paper.view.onKeyDown = function (event) {
        if(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key)) { 
            if(activeNumicon) { 
                activeNumicon.levitate(false);
                activeNumicon = null;
             }
            activeNumicon = new Numicon(parseInt(event.key)); 
            activeNumicon.levitate(true);
        }
        if (event.key == 'up') {
            if (activeNumicon) {
                activeNumicon.position.y -= tileWidth;
            };
        };
        if (event.key == 'down') {
            if (activeNumicon) {
                activeNumicon.position.y += tileWidth;
            };
        };
        if (event.key == 'left') {
            if (activeNumicon) {
                activeNumicon.position.x -= tileWidth;
            };
        };
        if (event.key == 'right') {
            if (activeNumicon) {
                activeNumicon.position.x += tileWidth;
            };
        };
        // enter : unactive rod
        if (event.key == 'enter' && activeNumicon) { 
            activeNumicon.levitate(false);
            activeNumicon = null;
         };
        // Rotate a numicon
        if (event.key == 'space') { rotateCallback() };
        // Sym a numicon
        if (event.key == 's') { symmetryCallback() };
        // Delete a numicon
        if (event.key == 'backspace') { deleteCallback() };
        // Reset the scene
        if (event.key == 'c') { trashCallback() };
        // Grid : on/off
        if (event.key == 'g') { gridCallback() };
        // h : legend
        if (event.key == 'h') { helpCallback() };
        // m : toogle colors
        if (event.key == 'm') { toogleCallback() };
    }
}

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

/* TODO */

// help
// appui long => sym
// push