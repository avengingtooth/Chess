//state machines for king check
// import {start} from './matrix.js'
// import {change} from './matrix.js'
// import { remove } from './matrix.js'
import { checkForCheck } from "./checkMate.js"

let handlers = []
let pieceHandlers = []
let rmPieceHandlers = []
let playerTurn = 'white'
let pieces = {
    'black': [],
    'white': []
}

let oppColor = {
    'black': 'white',
    'white': 'black'
}

let kings = {
    'black': undefined,
    'white': undefined
}

function setUp(){
    // start()
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            let cur = document.querySelector(`#row${x} .column${y}`)
            if (((y * 9) +  x) % 2 == 0){
                cur.classList.add('black') 
            }
            else{
                cur.classList.add('white')
            }
            if (y == 0 || y == 7){

                if (x == 0 || x == 7){
                    new Tower(x, y).loadPiece()
                }

                else if (x == 1 || x == 6){
                    new Knight(x, y).loadPiece()
                }

                else if (x == 2 || x == 5){
                    new Bishop(x, y).loadPiece()
                }

                else if(y == 0){
                    if (x == 4){
                        new Queen(x, y).loadPiece()
                    }
                    else{
                        kings['white'] = new King(x, y).loadPiece()
                    }
                }

                else{
                    if (x == 4){
                        new Queen(x, y).loadPiece()
                    }
                    else{
                        kings['black'] = new King(x, y).loadPiece()
                    }
                }
            }

            //Check for pawn
            if (y == 1 || y == 6){
                new Pawn(x, y).loadPiece()
            }
        }
    }
    pieceHandlers.forEach(e => e())
}

export default class Pieces{

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
        return (0 <= x && x < 8 && 0 <= y && y < 8)
    }

    move(x, y, obj){
        if (this.inRange(x, y)){
            let sqr = this.selectSqr(x, y, ' ')
            let pieceColor = this.selectSqr(x, y, 'div')
            if(this.checkCollision(pieceColor, obj, x)){

                if(pieceColor != null){
                    pieceColor.removeEventListener('click', pieceHandlers[pieceColor.getAttribute('pieceHandlerInd')])
                    rmPieceHandlers.push(pieceColor)
                }
                sqr.classList.add('possibleMove') 
                //UNCOMMENT COLOR STUFF
                //if (obj.color == playerTurn){
                    handlers.unshift([sqr, () => {this.moveClickable(x, y, obj, sqr, pieceColor)}])
                    sqr.addEventListener('click', handlers[0][1])
                //}
            }
            // else{
            //     if (!checkForCheck(pieces[obj.color], kings[obj.color])){
            //         console.log('chekkkk')
            //     }
            // }
        }
    }

    checkCollision(pieceColor, obj, x){
        if(pieceColor == null || pieceColor.getAttribute('color') != obj.element.getAttribute('color')){
            if (this.name == 'pawn'){
                if (pieceColor == null && obj.x != x){
                    return false
                }
                else if (pieceColor != null && obj.x == x){
                    return false
                }
                return true
            }
            return true
        }
    }

    moveClickable(x, y, obj, sqr, pieceColor){ 
        if (playerTurn == 'white'){
            playerTurn = 'black'
        }
        else{
            playerTurn = 'white'
        }
        if (pieceColor != null){
            pieceColor.remove()
        }

        sqr.append(obj.element)
        obj.x = x
        obj.y = y
        if(obj.color == 'black'){
            checkForCheck(pieces['black'], kings['black'])
        }
        else{
            checkForCheck(pieces['white'], kings['white'])
        }

        // if (check){
        //     if (checkMate(pieces, obj.color, king)){
        //         console.log(obj.color + ' wins')
        //     }
        // }
        this.reset()
    }

    reset(){
        handlers.forEach((vals) => {
            let e = vals [0]
            let handler = vals [1]
            e.removeEventListener('click', handler)
        })

        rmPieceHandlers.forEach(pieceColor => {
            pieceColor.addEventListener('click', pieceHandlers[pieceColor.getAttribute('pieceHandlerInd')])
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
        pieces[obj.color].push(obj)
        pieceHandlers.push( () => {
                this.reset()
                obj.calcMoves()
                obj.movements.forEach((moveSqr, ind) => {
                    if ((!Object.keys(obj.movements).includes(ind)) || (obj.movements[ind])){
                        this.move(moveSqr[0], moveSqr[1], obj)
                    }
                })
        })

        let ind = pieceHandlers.length - 1
        obj.element.addEventListener('click', pieceHandlers[ind])
        obj.element.setAttribute('pieceHandlerInd', ind)
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
                if (this.inRange(vals[0], vals[1])){
                    let target = this.selectSqr(vals[0], vals[1], 'div')
                    if (target == null && cont[ind] == true){
                        obj.movements.push(vals)
                        //document.querySelector(`#row${vals[0]} .column${vals[1]}`).style.backgroundColor = 'purple'
                    }
                    else{
                        if (cont[ind]){
                            if(target.getAttribute('color') != obj.element.getAttribute('color')){
                                //document.querySelector(`#row${vals[0]} .column${vals[1]}`).style.backgroundColor = 'red'
                                obj.movements.push(vals)
                            }
                        }
                        cont[ind] = false
                    }
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
        this.name = 'pawn'
        this.element = super.place(this.x, this.y, this.name)
        if (this.y == 1){
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

        if((this.y == 1 && this.color == 'black') || (this.y == 6 && this.color == 'white')){
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
        this.name = 'tower'
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, this.name)
    }

    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(8, 1, 0, this)
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
        this.name = 'bishop'
        this.element = this.place(this.x, this.y, this.name)
    }

    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(8, 1, 1, this)
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
        this.name = 'knight'
        this.element = this.place(this.x, this.y, this.name)
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
        this.name = 'queen'
        this.element = this.place(this.x, this.y, this.name)
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
        this.name = 'king'
        this.element = this.place(this.x, this.y, this.name)
    }
    
    calcMoves(){
        this.movements = []
        super.horizontalOrDiagonal(1, 1, 1, this)
        super.horizontalOrDiagonal(1, 1, 0, this)
    }

    loadPiece() {
        super.moveParams(this)
        return this
    }
}


setUp()