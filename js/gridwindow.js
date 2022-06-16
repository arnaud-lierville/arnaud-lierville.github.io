/* Paper scene */
// Global variables
var marginNavbar = 120
var gridColor = '#91A8D0'
var pinkStrokeColor = '#D8A9B9'
var greenStrokeColor = '#88BE69'
var simpleMultipeColor = '#F64C72'
var doubleMultipleColor = '#7A80AB'
var digitColor ='#505050'
var strokeWidth = 3
var nbcolumn = 30
var people = new Group()
var grid = new Group()
var isPopulated = false
var isMultipleColor = false
var isResultHidden = true

// Math Global variables
var gridSize = 20
var n = 10
var a = Math.floor(Math.random() * 8) + 3
var b = Math.floor(Math.random() * 8) + 3
if (a == b) { if(a < 7) { b = a + 3 } else { b = 3 } }

var firstValue = Math.floor(Math.random() * 200) + 1

// when view is resized...
paper.view.onResize = function() { drawApp(isPopulated, isMultipleColor) }

/* utils */
var logging = function() {
    console.log('----------------------------------------------------------------------------')
    console.log('La taille de la grille complète est : ' + gridSize)
    console.log('Valeur de a recherchée : ' + a)
    console.log('Valeur de b recherchée : ' + b)
    console.log('La fenêtre se remplit à partir de : ' + firstValue)
    var artascii = 
    '     ________       __     ___  __      __ __             ___             \n' +
    '    /  _____/______|__| __| _/ /  \\    /  \\__| ____    __| _/______  _  __\n' +
    '   /   \\  __\\_  __ \\  |/ __ |  \\   \\/\\/   /  |/    \\  / __ |/  _ \\ \\/ \\/ /\n' +
    '   \\    \\_\\  \\  | \\/  / /_/ |   \\        /|  |   |  \\/ /_/ (  <_> )     / \n' +
    '    \\______  /__|  |__\\____ |    \\__/\\  / |__|___|  /\\____ |\\____/ \\/\\_/  \n' +
    '           \\/              \\/         \\/          \\/      \\/              \n'
    console.log()
    console.log(artascii)
}

var displayResult = function() {
    if(isResultHidden) { 
        resultDisplay.innerHTML = '?'
    } else {
        if((numberInput.value == a && numberInput2.value == b) || (numberInput.value == b && numberInput2.value == a)) { 
            resultDisplay.innerHTML = 'Gagné !'
        } else {
            resultDisplay.innerHTML = 'Perdu !'
        }
    }
}

/* Html scene */
var html =  '<nav class="navbar fixed-bottom navbar-light bg-light">' +
                '<div class="container-fluid justify-content-center">' +

                    '<span class="navbar-text"><h1 id="resultDisplay">?</h1></span>' +
                    
                '</div>' +
            '</nav>' +
            '<nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">' +
			'<div class="container-fluid">' +
			  '<a class="navbar-brand" href="http://conifere.be/Jeux2019/Jeux.html" target="_blank">Grid window</a>' +
			  '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">' +
				'<span class="navbar-toggler-icon"></span>' +
			  '</button>' +
			  '<div class="collapse navbar-collapse" id="navbarNav">' +
				'<ul class="navbar-nav">' +


					'<li class="nav-item">' +
						'<div class="form-check form-switch custom-switch" data-toggle="tooltip" data-placement="bottom" title="Colorie les multiples des deux entiers">' +
							'<input id="showColorSwitch" class="form-check-input" type="checkbox" role="switch" style="transform: scale(1.8);">' +
							'<label class="form-check-label" style="padding-left: 13px;">Couleur</label>' +
						'</div>' +
					'</li>' +

                    '<li class="nav-item">' +
                    '<div class="form-check form-switch custom-switch" data-toggle="tooltip" data-placement="bottom" title="Peupler la grille">' +
                        '<input id="populateSwitch" class="form-check-input" type="checkbox" role="switch" style="transform: scale(1.8);">' +
                        '<label class="form-check-label" style="padding-left: 13px;">Peupler</label>' +
                    '</div>' +
                '</li>' +

					'<li class="nav-item">' +
						'<select class="form-select" id="level">' +
							'<option value="1" selected>Grille 20x20</option>' +
							'<option value="2">Grille aléatoire</option>' +
						'</select>' +
					'</li>' +

					'<li class="nav-item">' +
						    '<input id="numberInput" class="form-control me-2" type="number" data-toggle="tooltip" data-placement="left" title="Entrez un entier" >' +
                    '</li>' +


					'<li class="nav-item">' +
                    '<input id="numberInput2" class="form-control me-2" type="number" data-toggle="tooltip" data-placement="left" title="Entrez un entier" >' +
                '</li>' +

					'<li class="nav-item">' +
						'<div class="btn-group">' +
							'<button class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="Nouvelle partie" id="redoButton">' +
								'<i class="fa-solid fa-rotate-right"></i>' +
							'</button>' +
							'<button class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Aide" id="helpButton">' +
								'<i class="fa-solid fa-question"></i>' +
							'</button>' +
						'</div>' +
					'</li>' +

					'<li class="nav-item">' +
						'<div class="form-check form-switch custom-switch" data-placement="bottom" title="Vérifier le résultat">' +
							'<input id="showResultSwitch" class="form-check-input" type="checkbox" role="switch" style="transform: scale(1.8);">' +
							'<label class="form-check-label" style="padding-left: 20px;">Vérifier le résultat</label>' +
						'</div>' +
					'</li>' +

				'</ul>' +
			'</div>' +
		  '</nav>'

var div = document.createElement('div')
div.innerHTML = html
document.body.insertBefore(div, document.body.firstChild);

/* Interaction html <-> canvas */
var numberInput = document.getElementById('numberInput')
var numberInput2 = document.getElementById('numberInput2')
var level = document.getElementById('level')
var populateSwitch = document.getElementById('populateSwitch')
var showColorSwitch = document.getElementById('showColorSwitch')
var showResultSwitch = document.getElementById('showResultSwitch')
var redoButton = document.getElementById('redoButton')
var helpButton = document.getElementById('helpButton')
var resultDisplay = document.getElementById('resultDisplay')

var helpModal = new bootstrap.Modal(document.getElementById('helpModal'), { keyboard: false })

showResultSwitch.addEventListener('change', function() {
    isResultHidden = !isResultHidden
    displayResult()
})
showColorSwitch.addEventListener('change', function() {
    isMultipleColor = !isMultipleColor
    drawApp(isPopulated, isMultipleColor)
})
populateSwitch.addEventListener('change', function() {
    isPopulated = !isPopulated
    drawApp(isPopulated, isMultipleColor)
})

numberInput.addEventListener('change', function() { displayResult() })
numberInput2.addEventListener('change', function() { displayResult() })

level.addEventListener('change', function() {
    var gridSizeToApply = 20
    if (level.value == 2) { gridSizeToApply = Math.floor(Math.random() * 10) + 11 }
    gridSize = gridSizeToApply
    firstValue = Math.floor(Math.random() * Math.pow(gridSize, 2) - 1) + 1
    drawApp(isPopulated, isMultipleColor)
})

redoButton.onclick = function() { 
    a = Math.floor(Math.random() * 8) + 3
    b = Math.floor(Math.random() * 8) + 3
    if (a == b) { if(a < 7) { b = a + 3 } else { b = 3 } }

    firstValue = Math.floor(Math.random() * 199) + 1
    isPopulated = false
    populateSwitch.checked = false
    isMultipleColor = false
    showColorSwitch.checked = false
    drawApp(isPopulated, isMultipleColor)
}

helpButton.onclick = function() { helpModal.toggle() }

/* main function */

function drawApp(isPopulated, isMultipleColor) {
    project.clear()

    logging()

    var people = new Group()
    var grid = new Group()

    var squareSize = paper.view.bounds.width/nbcolumn
    var xShift = (nbcolumn - n)*.5*squareSize

    // grid drawing
    for(var i = 0; i < n + 1; i++) {
        var from = new Point(xShift + 0, i*squareSize + marginNavbar)
        var to = new Point(xShift + n*squareSize, i*squareSize + marginNavbar)
        var path = new Path.Line(from, to)
        path.strokeColor = gridColor
        path.strokeWidth = strokeWidth
        grid.addChild(path)

        from = new Point(xShift + i*squareSize, 0 + marginNavbar)
        to = new Point(xShift + i*squareSize, n*squareSize + marginNavbar)
        var path = new Path.Line(from, to)
        path.strokeColor = gridColor
        path.strokeWidth = strokeWidth
        grid.addChild(path)
    }

    grid.sendToBack()
    grid.visible = true

    // hide multiples
    var value = firstValue
    for(var i = 0 ; i < n ; i++) {
        for(var j = 0 ; j < n; j++) {
            if(value%a == 0 || value%b == 0) {
                var point = new Point(xShift + squareSize/2 + j*squareSize, marginNavbar + squareSize/2 + i*squareSize)
                var circle = new Path.Circle(point, squareSize/2.3)
                var currentColor = simpleMultipeColor
                if (value%a == 0 && value%b == 0 && isMultipleColor) { currentColor = doubleMultipleColor }
                circle.fillColor = currentColor;
            }
            value += 1
        }
        value += gridSize - 10
    }

    // populate
    var value = firstValue
    for(var i = 0 ; i < n ; i++) {
        for(var j = 0 ; j < n; j++) {
            var point = new Point(xShift + squareSize/2 + j*squareSize, marginNavbar + squareSize/1.5 + i*squareSize)
            var text = new PointText(point)
            text.justification = 'center'
            text.fillColor = digitColor
            text.fontSize = squareSize/2
            text.content = value
            people.addChild(text)
            value += 1
        }
        value += gridSize - 10
    }

    people.visible = isPopulated
    people.bringToFront()
}