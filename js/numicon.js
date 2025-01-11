paper.view.onResize = function() {
    project.clear()
    drawApp(paper.view.bounds.width/30);
  };

function drawApp(gridScale) {

    var unit = gridScale/3;
    var tileWidth = 3.4 * unit;
    var planWidth = Math.floor(paper.view.bounds.width / tileWidth) + 1;
    var planHeight = Math.floor(paper.view.bounds.height / tileWidth) + 2;
    var gridGroup = new Group();
    var numiconColors = ['#3560D5', '#E05927', '#88A1CE', '#EAC547', '#8ED284', '#D7443F', '#58B9B3', '#E56D72', '#3B8125', '#602E72'];
    gridFillColor = "#74abb5";

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
            var numiconMenu = new Tile((number + 2) * tileWidth, 1 * tileWidth, color);
            numiconMenu.onMouseDown = function (event) {
                new Numicon(number%10);
            }
            return numiconMenu;
        }
    });


    var Numicon = Base.extend({
        initialize: function (keynumber) {

            var pos_x = Math.floor(Math.random() * 15 + 1) * tileWidth;
            var pos_y = Math.floor(Math.random() * 3 + 3) * tileWidth;
            this.number = keynumber;
            this.color = numiconColors[this.number];
            if (this.number == 0) {
                this.number = 10;
            }

            var numicon = new Group();
            var val = 0;
            var j = 0;
            while (val < this.number) {
                for (var i = 0; i < 2; i++) {
                    if (val < this.number) {
                        var tile = new Tile(pos_x + i * tileWidth, pos_y + j * tileWidth, this.color);
                        numicon.addChild(tile);
                    }
                    val++;
                }
                j++;
            }

            numicon.number = this.number;

            numicon.levitate = function (bool) {
                if (bool) {
                    numicon.shadowColor = new Color(0, 0, 0);
                    numicon.shadowBlur = 12;
                    numicon.shadowOffset = new Point(5, 5);
                    numicon.bringToFront();
                } else {
                    numicon.shadowColor = null;
                    activenumicon = null;
                }
            }
            numicon.levitate(false)

            numicon.onMouseDrag = function (event) {
                numicon.levitate(true)
                numicon.position += event.delta;
            }
            numicon.onMouseUp = function (event) {
                numicon.levitate(false)
                var detla_x = numicon.number > 1 ? tileWidth/2 : 0; // si ça fait plus de 1 de large !ROTATION
                var detla_y = numicon.number == 3 || numicon.number == 4 || numicon.number == 7 || numicon.number == 8 ? tileWidth/2 : 0; //!ROTATION
                numicon.position.x = numicon.position.x - numicon.position.x % tileWidth + detla_x;
                numicon.position.y = numicon.position.y - numicon.position.y % tileWidth + detla_y;
            }
            return numicon;
        }
    });

    // var IconMenu = Base.extend({
    //     initialize: function(point, name, scale, callback) {
    //         var picture = new Raster(name);
    //         picture.position = point;
    //         /* CONVERT TAG */
    //         picture.scale(scale*gridScale/28)
    //         picture.onMouseDown = function() {
    //             callback();
    //         }
    //         return picture;
    //     }
    // })

    // var magicCallback = function() {
    //     console.log('magicCallback');
   
    // }
    // var iconMagic = new IconMenu(new Point(16.1, 1.5)*gridScale, 'magic', .1, magicCallback)

    for (var i = 1; i < 11; i++) {
        new NumiconMenu(i);
    }

    paper.view.onKeyDown = function (event) {
        console.log(event.key)
        if(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key)) { 
            new Numicon(parseInt(event.key)); 
        }
    
    }

}

