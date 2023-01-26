//import Pieces from "./generalPieceInfo"

//state machines for king check
let handlers = []
let playerTurn = 'white'

function setUp(){
    for (let y = 1; y < 9; y++){
        for (let x = 1; x < 9; x++){
            if (y == 1 || y == 8){
                //Check for corners aka towers
                if (x == 1 || x == 8){
                    new Tower(x, y).loadPiece()
                }

                //Check for bishops
                else if (x == 2 || x == 7){
                    new Bishop(x, y).loadPiece()
                }

                //Check for knights
                else if (x == 3 || x == 6){
                    new Knight(x, y).loadPiece()
                }

                else if(y == 1){
                    if (x == 5){
                        new Queen(x, y).loadPiece()
                    }
                    else{
                        new King(x, y).loadPiece()
                    }
                }

                else{
                    if (x == 5){
                        new King(x, y).loadPiece()
                    }
                    else{
                        new Queen(x, y).loadPiece()
                    }
                }
            }

            //Check for pawn
            if (y == 2 || y == 7){
                new Pawn(x, y).loadPiece()
            }
        }
    }
    new Tower(4, 4).loadPiece()
}

class Pieces{
    place(x, y, text, color){
        let sqr = this.selectSqr(x, y, 'div')
        sqr.textContent = text
        if (color == undefined){
            if(y <= 2){
                sqr.setAttribute('color', 'white')
            }
            else{
                sqr.setAttribute('color', 'black')
            }
        }
        else{
            sqr.setAttribute('color', color)
        }
        return sqr
    }

    inRange(x, y){
        return (0 < x && x <= 8 && 0 < y && y <= 8)
    }

    move(x, y, obj){
        if (this.inRange(x, y)){
            let sqr = this.selectSqr(x, y, ' ')
            let pieceColor = this.selectSqr(x, y, 'div')
            if(pieceColor == null || pieceColor != sqr.color){
                if (this.name == 'pawn'){
                    if (pieceColor == null && obj.x != x){
                        return
                    }
                    else if (pieceColor != null && obj.x == x){
                        return
                    }
                }
                sqr.classList.add('possibleMove') 
                //UNCOMMENT COLOR STUFF
                //if (obj.color == playerTurn){
                handlers.unshift([sqr, () => {this.moveClickable(x, y, obj, sqr, pieceColor)}])
                sqr.addEventListener('click', handlers[0][1])
                //}
            }
        }
    }

    moveClickable(x, y, obj, sqr, pieceColor){ 
        if (playerTurn == 'white'){
            playerTurn = 'black'
        }
        else{
            playerTurn = 'white'
        }
        console.log(playerTurn)
        if (pieceColor != null){
            pieceColor.remove()
        }
        sqr.append(obj.element)
        obj.x = x
        obj.y = y
        this.reset()
    }

    reset(){
        handlers.forEach((vals) => {
            let e = vals [0]
            let handler = vals [1]
            e.removeEventListener('click', handler)
        })

        document.querySelectorAll('.possibleMove').forEach(e =>{
            e.classList.remove('possibleMove')
        })
        handlers = []
    }

    selectSqr(x, y, extraPrecision){
        return document.querySelector(`#row${x} .column${y} ${extraPrecision}`)
    }

    checkColor(y){
        if(y <= 2){
            return 'black'
        }
        else{
            return 'white'
        }
    }

    moveParams(obj){
        obj.element.addEventListener('click', () => {
            this.reset()
            obj.calcMoves()
            obj.movements.forEach((moveSqr, ind) => {
                if ((!Object.keys(obj.movements).includes(ind)) || (obj.movements[ind])){
                    this.move(moveSqr[0], moveSqr[1], obj)
                }
            })
        })
    }

    horizontalOrDiagonal(times, xInc, yInc, obj){
        let x = obj.x
        let y = obj.y
        let curX = 0
        let curY = 0
        let cont = [true, true, true, true, true]

        for(let i = 0; i < times; i++){
            curX += xInc
            curY += yInc
            let toCheck = [
                //left + top left
                [x - curX, y - curY, obj],
                //right + top right
                [x + curX, y - curY, obj],
                //top
                [x + curY, y - curX, obj],
                //down + bottom right
                [x + curY, y + curX, obj],
                //down + bottom left
                [x - curX, y + curY, obj]
            ]
            toCheck.forEach((vals, ind) => {
                let target = this.selectSqr(vals[0], vals[1], 'div')
                if (target == null && cont[ind] == true && this.inRange(vals[0], vals[1])){
                    obj.movements.push(vals)
                    //document.querySelector(`#row${vals[0]} .column${vals[1]}`).style.backgroundColor = 'purple'
                }
                else{
                    cont[ind] = false
                    // try{
                    //     document.querySelector(`#row${vals[0]} .column${vals[1]}`).style.backgroundColor = 'red'
                    // }
                    // catch{

                    // }
                }
            })
        }
    }
}

class Pawn extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = super.place(this.x, this.y, 'pawn')
        this.name = 'pawn'
        if (this.y == 2){
            this.direction = 1
        }
        else{
            this.direction = -1
        }
    }

    calcMoves(){
        this.movements = [
            [this.x, this.y + this.direction, this],
            [this.x + this.direction, this.y + this.direction, this],
            [this.x - this.direction, this.y + this.direction, this]
        ]

        if((this.y == 2 && this.color == 'black') || (this.y == 7 && this.color == 'white')){
            this.movements.push([this.x, this.y + (2 * this.direction), this])
        }
    }

    loadPiece(){
        super.moveParams(this)
    }
}

class Tower extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.element = this.place(this.x, this.y, 'tower')
        this.name = 'tower'
    }

    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(8, 1, 0, this)
        console.log(this.movements)
    }

    loadPiece(){
        super.moveParams(this)
    }
}

class Knight extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'knight')
        this.name = 'knight'
    }

    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(8, 1, 1, this)
    }

    loadPiece(){
        super.moveParams(this)
    }
}

class Bishop extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'bishop')
        this.name = 'bishop'
    }

    calcMoves(){
        this.movements = [
            [this.x + 2, this.y + 1, this],
            [this.x + 2, this.y - 1, this],
            [this.x - 2, this.y + 1, this],
            [this.x - 2, this.y - 1, this],

            [this.x - 1, this.y + 2, this],
            [this.x + 1, this.y + 2, this],
            [this.x - 1, this.y - 2, this],
            [this.x + 1, this.y - 2, this]
        ]
    }

    loadPiece(){
        super.moveParams(this)
    }
}

class Queen extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'queen')
        this.name = 'queen'
    }

    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(8, 1, 1, this)
        super.horizontalOrDiagonal(8, 1, 0, this)
    }

    loadPiece(){
        super.moveParams(this)
    }
}

class King extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'king')
        this.name = 'king'
    }
    
    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(1, 1, 1, this)
        super.horizontalOrDiagonal(1, 1, 0, this)
    }

    loadPiece() {
        super.moveParams(this)
    }
}


setUp()