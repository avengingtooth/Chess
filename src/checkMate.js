function checkForCheck(pieces, king){
    let sqrOgVal = ' '
    let attacks = []
    let check = false
    let piecesCausingCheck = []

    for (let j = 0; j < 8; j++){
        attacks.push([])
        for (let i = 0; i < 8; i++){
            attacks[j].push(sqrOgVal)
        }
    }
    
    pieces.forEach(obj => {
        obj.calcMoves(obj)
        attacks[obj.y][obj.x] = obj.name[0].toUpperCase()
        obj.movements.forEach(move => {
            if (0 <= move[1] && move[1] < 8 && 0 <= move[0] && move[0] < 8){
                attacks[move[1]][move[0]] = 'X'
                if (king.y == move[1] && king.x == move[0]){
                    piecesCausingCheck.push(obj)
                    check = true
                }
            }
        })
    })
    //attacks[king.y][king.x] = 'Y'
    //console.log(attacks)
    return check

}

export {checkForCheck}