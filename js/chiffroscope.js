/* Paper scene */
// Global variables
var nbcolumn = 3
var columnHeight = paper.view.bounds.height/6  // (fixed in css : 1000px/6)
var marginNavbar = 80
var fontSize = 40
var isNumberHidden = false
var isResultHidden = true

var gridColor = '#91A8D0'
var pinkColorCard = '#F0DEE4'
var pinkStrokeColor = '#D8A9B9'
var greenColorCard = '#DCECD3'
var greenStrokeColor = '#88BE69'
var strokeWidth = 3

var cardStack  = {}

var unities = {
    '-3': 'Millièmes',
    '-2': 'Centièmes',
    '-1': 'Dixièmes',
    '0': 'Unités',
    '1': 'Dizaines',
    '2': 'Centaines',
    '3': 'Milliers',
    '4': 'Dizaines de milliers',
    '5': 'Centaines de milliers',
    '6': 'Millions'
}

var shortCut = {
    'm*': unities['-3'],
    'c*': unities['-2'],
    'd*': unities['-1'],
    'u': unities['0'],
    'd': unities['1'],
    'c': unities['2'],
    'm': unities['3'],
    'dm': unities['4'],
    'cm': unities['5'],
    'M': unities['6'],
}

var shortCutToOrder = {
    'm*': '-3',
    'c*': '-2',
    'd*': '-1',
    'u': '0',
    'd': '1',
    'c': '2',
    'm': '3',
    'dm': '4',
    'cm': '5',
    'M': '6',
}

/* Utils */

getRandomPosition = function() {
        //random position
        var parperSize = paper.view.bounds
        var x = parperSize.width/2 + (Math.floor(Math.random()*7) - 3)*parperSize.width/(3*(nbcolumn + 1))
        var y = parperSize.height/3 + (Math.floor(Math.random()*7) - 3)*3*parperSize.height/(columnHeight)
        return { 'x': x, 'y':y }
}

function generateCard(isUnity) {
    var parperSize = paper.view.bounds
    var randomPosition = getRandomPosition()
    var columnWitdh = parperSize.width/(nbcolumn +1)
    if(isUnity) {
        var order = Math.floor(Math.random()*(7) - 3 ) // unityLevel.value = 3
        if(unityLevel.value == 2) { order = Math.floor(Math.random() * 7) }
        if(unityLevel.value == 1) { order = Math.floor(Math.random() * 4) }
        new Card(randomPosition.x, randomPosition.y, unities[order.toString()], columnWitdh, isUnity, order, isNumberHidden, true)
    } else {
        new Card(randomPosition.x, randomPosition.y, Math.floor(Math.random()*(Math.pow(10, level.value))), columnWitdh, isUnity, null, isNumberHidden, true)
    }
    displayResult(isResultHidden)
}

function redrawFromStack(delta) {
    for(var cardID in cardStack ) {
        var data = cardStack[cardID]
        var scale = 1
        if(delta == 1) { scale = nbcolumn/(nbcolumn + 1) }
        if(delta == -1) { scale = (nbcolumn + 2)/(nbcolumn + 1) }
        if(cardStack[cardID]['pos'] <= nbcolumn + 1 ) {
            new Card(data.x*scale, data.y, data.value, paper.view.bounds.width/(nbcolumn + 1), data.isUnity, data.order, data.cardSide, true)
        } else {
            new Card(data.x*scale, data.y, data.value, paper.view.bounds.width/(nbcolumn + 1), data.isUnity, data.order, data.cardSide, false)
        }
        delete(cardStack[cardID])
        displayResult(isResultHidden)
    }
}

function computeNumber() {
    var computedNumber
    var sumList = []
    for(var cardID in cardStack ) {
        var card = cardStack[cardID]
        if(card.isUnity && card.isOnBoard) {
            var checksum = card.pos + parseInt(card.order)
            if(!(sumList.includes(checksum))) { sumList.push(checksum) }
        }
    }
    var correctUnities = sumList.length == 1
    if(correctUnities) {
        computedNumber = 0
        for(var cardID in cardStack) {
            var card = cardStack[cardID]
            if(!card.isUnity && card.isOnBoard) {
                computedNumber += card.value*Math.pow(10, sumList[0] - card.pos)
            }
        }
    }
    return computedNumber
}

function displayResult(isResultHidden) {
    var resultDisplayText = '?'
    if(!isResultHidden) {
        resultDisplayText = '!'
        var computedNumber = Math.round(computeNumber()*100000000)/100000000
        if(computedNumber) { resultDisplayText = computedNumber.toString().replace('.',',') }
    }
    resultDisplay.innerHTML = resultDisplayText
}

function generateCardFromInput() {
    var randomPosition = getRandomPosition()
    var columnWitdh = paper.view.bounds.width/(nbcolumn +1)
    var currentValue = numberInput.value
    var generate = false
    var isUnity = false
    var order = null

    if(currentValue in shortCut) {
        order = shortCutToOrder[currentValue]
        currentValue = shortCut[currentValue]
        isUnity = true
        generate = true
     } else {
         if(!isNaN(currentValue)) {
             generate = true
         }
     }
     if(generate && currentValue != '') {
         new Card(randomPosition.x, randomPosition.y, currentValue, columnWitdh, isUnity, order, isNumberHidden, true)
         displayResult(isResultHidden)
        }
     numberInput.value = ''
}

function ID() { return Math.random().toString(36).substring(2, 9); }

// when view is resized...
paper.view.onResize = function() { drawApp(paper.view.bounds, nbcolumn, 0) }

/* Html scene */
var html =  '<nav class="navbar fixed-bottom navbar-light bg-light">' +
                '<div class="container-fluid justify-content-center">' +

                    '<span class="navbar-text"><h1 id="resultDisplay">?</h1></span>' +
                    
                '</div>' +
            '</nav>' +
            '<nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">' +
			'<div class="container-fluid">' +
			  '<a class="navbar-brand" href="https://chiffroscope.blogs.laclasse.com" target="_blank">Chiffroscope</a>' +
			  '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">' +
				'<span class="navbar-toggler-icon"></span>' +
			  '</button>' +
			  '<div class="collapse navbar-collapse" id="navbarNav">' +
				'<ul class="navbar-nav">' +

					'<li class="nav-item">' +
						'<div class="btn-group">' +
							'<button class="btn btn-outline-info" data-toggle="tooltip" data-placement="bottom" title="Moins de colonnes" id="minusButton">' +
									'<i class="fa-solid fa-minus"></i>' +
							'</button>' +
							'<button class="btn btn-outline-success" data-toggle="tooltip" data-placement="bottom" title="Tirage au hasard d\'une unité de numération" id="unityButton">' +
								'<i class="fa-solid fa-coins"></i>' +
							'</button>' +
							'<button class="btn btn-outline-success" data-toggle="tooltip" data-placement="bottom" title="Tirage au hasard d\'un nombre" id="numberButton">' +
								'<i class="fa-solid fa-hand-sparkles"></i>' +
							'</button>' +
							'<button class="btn btn-outline-danger" data-toggle="tooltip" data-placement="bottom" title="Plus de colonnes" id="plusButton">' +
								'<i class="fa-solid fa-plus"></i>' +
							'</button>' +
						'</div>' +
					'</li>' +

					'<li class="nav-item">' +
						'<div class="form-check form-switch custom-switch" data-toggle="tooltip" data-placement="bottom" title="La carte générée est retournée">' +
							'<input id="showNumberSwitch" class="form-check-input" type="checkbox" role="switch" style="transform: scale(1.8);">' +
							'<label class="form-check-label" style="padding-left: 20px;">Carte retournée</label>' +
						'</div>' +
					'</li>' +

					'<li class="nav-item">' +
						'<select class="form-select" id="unityLevel">' +
							'<option value="1" selected>Jusqu\'au milliers</option>' +
							'<option value="2">Jusqu\'au millions</option>' +
							'<option value="3">Décimaux</option>' +
						'</select>' +
					'</li>' +

					'<li class="nav-item">' +
						'<select class="form-select" id="level">' +
							'<option value="1" selected>Jusqu\'à 9</option>' +
							'<option value="2">Jusqu\'à 99</option>' +
							'<option value="3">Jusqu\'à 999</option>' +
						'</select>' +
					'</li>' +

					'<li class="nav-item">' +
						'<input id="numberInput" class="form-control me-2" type="search" data-toggle="tooltip" data-placement="left" title="Entrez un nombre ou une unité de numération (u, c, *d)" >' +
					'</li>' +

					'<li class="nav-item">' +
						'<div class="btn-group">' +
							'<button class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="Tout effacer" id="trashButton">' +
								'<i class="fa-solid fa-trash"></i>' +
							'</button>' +
							'<button class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Aide" id="helpButton">' +
								'<i class="fa-solid fa-question"></i>' +
							'</button>' +
						'</div>' +
					'</li>' +

					'<li class="nav-item">' +
						'<div class="form-check form-switch custom-switch" data-placement="bottom" title="Afficher le nombre codé">' +
							'<input id="showResultSwitch" class="form-check-input" type="checkbox" role="switch" style="transform: scale(1.8);">' +
							'<label class="form-check-label" style="padding-left: 20px;">Afficher le nombre codé</label>' +
						'</div>' +
					'</li>' +

				'</ul>' +
			'</div>' +
		  '</nav>'

var div = document.createElement('div')
div.innerHTML = html
document.body.insertBefore(div, document.body.firstChild);

/* Interaction html <-> canvas */
var minusButton = document.getElementById('minusButton')
var plusButton = document.getElementById('plusButton')
var unityButton = document.getElementById('unityButton')
var numberButton = document.getElementById('numberButton')
var numberInput = document.getElementById('numberInput')
var level = document.getElementById('level')
var showNumberSwitch = document.getElementById('showNumberSwitch')
var showResultSwitch = document.getElementById('showResultSwitch')
var trashButton = document.getElementById('trashButton')
var helpButton = document.getElementById('helpButton')
var resultDisplay = document.getElementById('resultDisplay')

var helpModal = new bootstrap.Modal(document.getElementById('helpModal'), { keyboard: false })

minusButton.onclick = function() {
    nbcolumn--
    if(nbcolumn > 1) { 
        drawApp(paper.view.bounds, nbcolumn, -1)
    } else {
        nbcolumn = 2
    }
}
plusButton.onclick = function() {
    nbcolumn++
    drawApp(paper.view.bounds, nbcolumn, 1)
}
unityButton.onclick = function() { generateCard(true) }
numberButton.onclick = function() { generateCard(false) }
numberInput.addEventListener('keyup', function(event) { if(event.key == 'Enter') { generateCardFromInput() } })
showResultSwitch.addEventListener('change', function() {
    isResultHidden = !isResultHidden
    displayResult(isResultHidden)
})
showNumberSwitch.addEventListener('change', function() { 
    if(!isNumberHidden) { numberInput.setAttribute("type", "password") } else { numberInput.setAttribute("type", "text") }
    isNumberHidden = !isNumberHidden
 })

 trashButton.onclick = function() {
    nbcolumn = 3
    cardStack  = {}
    drawApp(paper.view.bounds, nbcolumn, 0)
    displayResult(isResultHidden)
}

helpButton.onclick = function() { helpModal.toggle() }

/* key functions */

function onKeyDown(event) { if (event.key == 'enter') { generateCardFromInput() } }

/* main function */

function drawApp(parperSize, nbcolumn, way) {
    project.clear()
    var grid = new Group()
    var columnWitdh = parperSize.width/(nbcolumn + 1)
    for(var j=0; j<nbcolumn +1;j++) {
        var from = new Point(columnWitdh/2 + columnWitdh*j, 0)
        var to = new Point(columnWitdh/2 + columnWitdh*j, parperSize.height*1.5)
        var path = new Path.Line(from, to)
        path.strokeColor = gridColor
        path.strokeWidth = strokeWidth
        grid.addChild(path)
    }
    var from = new Point(0, columnHeight + marginNavbar)
    var to = new Point(parperSize.width, columnHeight + marginNavbar)
    var path = new Path.Line(from, to)
    path.strokeColor = gridColor
    path.strokeWidth = strokeWidth
    grid.addChild(path)
    grid.sendToBack()
    grid.visible = true
    redrawFromStack(way)
}

/* Card */
var Card = Base.extend({

    initialize: function(x, y, value, columnWitdh, isUnity, order, cardSide, isOnBoard) {

        var cardWidth = columnWitdh*0.7
        var cardHeight = columnHeight*0.7
        
        this.x = x
        this.y = y
        this.value = value
        this.cardSide = cardSide
        this.isOnBoard = isOnBoard
        this.fillColor = pinkColorCard
        this.strokeColor = pinkStrokeColor
        this.isUnity = isUnity
        this.order = order
        if(isNaN(value)) { 
            this.fillColor = greenColorCard
            this.strokeColor = greenStrokeColor
         }
        
        this.path = new Path.Rectangle({
            topLeft: [x, y],
               bottomRight: [x + cardWidth, y + cardHeight],
               radius: 10,
               strokeWidth: strokeWidth,
               fillColor: this.fillColor,
               strokeColor: this.strokeColor
           })

        this.text = new PointText(new Point(x + cardWidth/2,y + cardHeight/1.6));
        this.text.justification = 'center';
        this.text.fillColor = 'black';
        this.text.fontSize = fontSize
        this.text.content = value
        
        //scaling the text if too long
        var textWidth = this.text.bounds.width
        if(cardSide) { this.text.content = '?' }
        var textNumberOfCharacters = value.toString().length
        this.scale = 1
        if(textNumberOfCharacters > cardWidth/(fontSize*0.69)) { this.scale = cardWidth*0.9/textWidth }
        if(!cardSide) { this.text.scale(this.scale) }
    
        this.cardGroup = new Group();
        this.cardGroup.addChild(this.path)
        this.cardGroup.addChild(this.text)
        this.cardGroup.bringToFront()

        this.cardID = ID()
        cardStack[this.cardID] = {
            'x': x,
            'y': y,
            'value': value,
            'pos': Math.floor((x - cardWidth/5)/columnWitdh) + 1,
            'isUnity': this.isUnity,
            'order': this.order,
            'cardSide': this.cardSide,
            'isOnBoard': this.isOnBoard
        }

        /* methods */

        var that = this
        var wasMoving = false

        this.cardGroup.onMouseDown = function(event) {
            that.cardGroup.bringToFront()
            wasMoving = false
        }

        this.cardGroup.onMouseUp = function(event) {
            if(!wasMoving) {
                if (that.text.content == '?') { 
                    that.text.content = value
                    that.text.scale(that.scale)
                } else { 
                     that.text.content = '?'
                     that.text.scale(1/that.scale)
                     cardStack[that.cardID].cardSide = !that.cardSide
                    }
                that.cardSide = !that.cardSide
                cardStack[that.cardID].cardSide = that.cardSide
             }
             that.cardGroup.shadowColor = null;
             displayResult(isResultHidden)
        }

        this.cardGroup.onMouseDrag = function(event) { 
            that.cardGroup.shadowColor = new Color(0, 0, 0);
            that.cardGroup.shadowBlur = 12;
            that.cardGroup.shadowOffset = new Point(5, 5);
            that.cardGroup.bringToFront()
            
            that.cardGroup.position.x += event.delta.x;
            that.cardGroup.position.y += event.delta.y;
            that.cardGroup.position.y = Math.max(that.cardGroup.position.y, marginNavbar + cardHeight/2)

            cardStack[that.cardID]['x'] = cardStack[that.cardID]['x'] + event.delta.x
            cardStack[that.cardID]['y'] = Math.max(cardStack[that.cardID]['y'] + event.delta.y, marginNavbar)
            cardStack[that.cardID]['pos'] = Math.floor((cardStack[that.cardID]['x'] - cardWidth/5)/columnWitdh) + 1
            wasMoving = true
            displayResult(isResultHidden)
        }

        this.cardGroup.onDoubleClick = function(event) {
            delete(cardStack[that.cardID])
            console.log(cardStack)
            that.cardGroup.remove()
            displayResult(isResultHidden)
        }

        return this.cardGroup
    }})