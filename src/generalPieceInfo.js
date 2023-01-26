class Pieces{
    place(x, y, text){
        let sqr = this.selectSqr(x, y, 'p')
        sqr.textContent = text
        if(y <= 2){
            sqr.setAttribute('color', 'white')
        }
        else{
            sqr.setAttribute('color', 'black')
        }
        return sqr
    }

    move(x, y, elementCalledBy, obj){
        if(0 < x && x <= 8 && 0 < y && y <= 8){
            let sqr = this.selectSqr(x, y, ' ')
            let pieceColor = this.selectSqr(x, y, 'p')
            if(pieceColor == null || pieceColor == obj.color){
                if ((1 <= x && x <= 8) && (1 <= y && y <= 8)){
                    sqr.addEventListener('click', this.moveClickable(x, y, elementCalledBy, obj, sqr))
                }
                return true
            }
            else{
                return false
            }
        }
    }

    moveClickable(x, y, elementCalledBy, obj, sqr){
        sqr.classList.add('possibleMove') 
        return () => {
            sqr.append(elementCalledBy)
            obj.x = x
            obj.y = y
            this.reset()
        }     
    }

    reset(){
        document.querySelectorAll('.possibleMove').forEach(e => {
            e.classList.remove('possibleMove')
            e.removeEventListener('click', this.moveClickable)
        })
    }

    selectSqr(x, y, extraPrecision){
        let txt = document.querySelector(`#row${x} .column${y} ${extraPrecision}`)
        return txt
    }

    checkColor(y){
        if(y <= 2){
            return 'black'
        }
        else{
            return 'white'
        }
    }

    load(func){
        this.element.addEventListener('click', () => {
            super.reset()
            func()
        })
    }

    diagonal(x, y, times, elementCalledBy, obj){
        //diagonal
        let curAdd = 0
        let cont = [true, true, true, true]
        for(let i = 0; i < times; i++){
            curAdd++
            if(cont[0]){
                cont[0] = this.move(x + curAdd, y + curAdd, elementCalledBy, obj)
            }
            if(cont[1]){
                cont[1] = this.move(x + curAdd, y - curAdd, elementCalledBy, obj)
            }
            if(cont[2]){
                cont[2] = this.move(x - curAdd, y - curAdd, elementCalledBy, obj)
            }
            if(cont[3]){
                cont[3] = this.move(x - curAdd, y + curAdd, elementCalledBy, obj)
            }
        }
    }

    horizontal(x, y, times, elementCalledBy, obj){
        //horizontal
        let curAdd = 0
        let cont = [true, true, true, true]
        for(let i = 0; i < times; i++){
            curAdd++
            if(cont[0]){
                cont[0] = this.move(x, y + curAdd, elementCalledBy, obj)
            }
            if(cont[1]){
                cont[1] = this.move(x, y - curAdd, elementCalledBy, obj)
            }
            if(cont[2]){
                cont[2] = this.move(x + curAdd, y, elementCalledBy, obj)
            }
            if(cont[3]){
                cont[3] = this.move(x - curAdd, y, elementCalledBy, obj)
            }
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
        if (this.y == 2){
            this.direction = 1
        }
        else{
            this.direction = -1
        }
    } 
    
    load(){
        this.element.addEventListener('click', () => {
            super.reset()
            super.move(this.x, this.y + (2 * this.direction), this.element, this)
            if(this.y == 2 || this.y == 7){
                super.move(this.x, this.y + this.direction, this.element, this)
            }
        })
    }
}

class Tower extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.element = this.place(this.x, this.y, 'tower')
    }
    load(){
        this.element.addEventListener('click', () => {
            super.reset()
            super.horizontal(this.x, this.y, 8, this.element, this)
        })
    }
}

class Knight extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'knight')
    }

    load(){
        this.element.addEventListener('click', () => {
            super.reset()
            super.diagonal(this.x, this.y, 8, this.element, this)
        })
    }
}

class Bishop extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'bishop')
    }

    load(){
        this.element.addEventListener('click', () => {
            super.reset()
            super.move(this.x + 2, this.y + 1, this.element, this)
            super.move(this.x + 2, this.y - 1, this.element, this)
            super.move(this.x - 2, this.y + 1, this.element, this)
            super.move(this.x - 2, this.y - 1, this.element, this)

            super.move(this.x + 1, this.y + 2, this.element, this)
            super.move(this.x + 1, this.y - 2, this.element, this)
            super.move(this.x - 1, this.y + 2, this.element, this)
            super.move(this.x - 1, this.y - 2, this.element, this)
        })
    }

}

class Queen extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'queen')
    }

    load(){
        this.element.addEventListener('click', () => {
            super.reset()
            super.diagonal(this.x, this.y, 8, this.element, this)
            super.horizontal(this.x, this.y, 8, this.element, this)
        })
    }
}

class King extends Pieces{
    constructor(x, y){
        super()
        this.x = x
        this.y = y
        this.color = super.checkColor(this.y)
        this.element = this.place(this.x, this.y, 'king')
        super.load(() => {
            //diagonales
            this.diagonal(this.x, this.y, 1, this.element, this)

            //horizontal
            this.horizontal(this.x, this.y, 1, this.element, this)
        })
    }
}
