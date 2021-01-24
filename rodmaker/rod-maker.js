/* Setting */
const scale = 30                            // in pixel
const modelWitdh = 30                       // in unity = scale pixels
const lineModelHeight = scale/10            // in unity = scale pixels
const modelPosition = { x:1.5, y:1.5 }      // in unity = scale pixels

/* tools */
const sumReducer = (accumulator, currentValue) => accumulator + currentValue;

let inputField = document.getElementById('calculus')
let inputFieldHidden = document.getElementById('calculus-hidden')

inputField.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        drawModel()
    }
})

inputField.addEventListener('focus', (event) => {
    inputField.value = inputFieldHidden.value
})

inputField.addEventListener('input', (e) => {
    if(e.currentTarget.value === '') {
        clearCanvas()
    }
})

/* Functions */

let clearCanvas = function() {
    let c = document.getElementById("rodCanvas")
    let ctx = c.getContext("2d")
    ctx.clearRect(0, 0, c.width, c.height)
}

let multToAdd = function(operation) {
    let multList = operation.match(/\d*\*[^+=]*/g)
    let newOperation = operation
    for (let index in multList) {
        let mult = multList[index]
        let newMult = mult
        let extract = mult.split('*')
        let a = parseInt(extract[0], 10) // SI
        let b = extract[1]    
        if (!isNaN(a)) {
            newMult = ''
            for (let i = 0; i<a; i++) {
                newMult += b + '+'
            }
            newMult = newMult.slice(0, newMult.length - 1)
        }
        newOperation = newOperation.replace(mult, newMult)
    }
    return newOperation
}

function drawModel() {

    clearCanvas()

    let inputText = multToAdd(inputField.value)
    let expressionList = inputText.split('=').reverse()

    for (let line in expressionList) {
        let termList = expressionList[line].split('+')
        let termNumber = termList.length
        if (termNumber == 1) {
            fullBarContent = termList[0]
            new Rod(modelPosition.x, 
                modelPosition.y + parseInt(line, 10)*lineModelHeight, 
                modelWitdh, 
                lineModelHeight, 
                termList[0], 
                scale)
        } else {
            let sum = termList.map(function(item) {return parseInt(item, 10)}).reduce(sumReducer)
            if(!isNaN(sum)) {   // si la ligne ne contient que des nombre, repartion proportionnelle
                let currentX = modelPosition.x
                for (let termIndex in termList) {
                    new Rod(currentX, 
                    modelPosition.y + parseInt(line, 10)*lineModelHeight, 
                    modelWitdh*parseInt(termList[termIndex], 10)/sum ,
                    lineModelHeight ,
                    termList[termIndex], 
                    scale)
                    currentX += modelWitdh*parseInt(termList[termIndex], 10)/sum
                }
            } else {    // si la ligne ne contient pas que des nombre, répartition uniforme
                for (let termIndex in termList) {
                    new Rod(modelPosition.x + parseInt(termIndex, 10)*modelWitdh/termNumber, 
                    modelPosition.y + parseInt(line, 10)*lineModelHeight, 
                    modelWitdh/termNumber ,
                    lineModelHeight ,
                    termList[termIndex], 
                    scale)
                }
            }
        }
    }

    inputFieldHidden.value = inputField.value
    inputField.value = ''
    inputField.blur()
}

/* Classes */

class Rod {
    constructor(x, y, width, height, label, scale) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.scale = scale;

        this.build()
    }

    build() {
        // getting canvas
        let c = document.getElementById("rodCanvas");
        let ctx = c.getContext("2d");

        // rod style
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#999999';
        ctx.font = this.scale + "px Arial";

        // box
        ctx.beginPath();
        ctx.rect(this.x*this.scale, this.y*this.scale, this.width*this.scale, this.height*this.scale);
        ctx.stroke();

        // label
        if (this.label != '0') {
            let xText = (this.x + 0.5*this.width)*this.scale - ctx.measureText(this.label).width/2;
            let yText = (this.y + 0.5*this.height)*this.scale + ctx.measureText(this.label).actualBoundingBoxAscent/2;
            ctx.fillText(this.label, xText, yText);
        }
    }
}