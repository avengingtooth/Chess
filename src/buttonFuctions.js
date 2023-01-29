let list = document.querySelector('.settings > ul')

let values = [
    ["create", create],
    ["normal", normal],
    ["gabe's styles", gaby]
]

let choices = [
    ['name', 'name'],
    ['color', 'color 1'],
    ['color', 'color 2'],
    ['color', 'pion color 1'],
    ['color', 'pion color 2'],
    ['color', 'border'],
    ['number', 'borderWidth']
]

function setUp(){
    values.forEach(info => {
        let txt = info[0]
        let func = info[1]

        let li = document.createElement('li')
        list.append(li)
        let button = document.createElement('button')
        li.append(button)
        button.addEventListener('click', func)
        button.classList.add('preMade')
        button.textContent = txt
    })
    values = []
}

function createInput(){
    let li = document.querySelector('.settings > ul > li:nth-child(1)')
    list.append(li)
    let form = document.createElement('form')
    form.classList.add('colorPickers')
    li.append(form)

    choices.forEach(vals => {
        let inputType = vals[0]
        let txt = vals[1]

        let input = document.createElement('input')

        input.textContent = txt
        input.placeholder = txt
        

        input.type = inputType
        form.append(input)
    })
}

function create(){
    let inputVals = []
    document.querySelectorAll('.colorPickers input').forEach(e => {
        inputVals.push(e.value)
    })

    if (inputVals[0] != ''){
        values.push([inputVals.shift(0), function(){
            colorSwaps(...inputVals)
        }])
    }

    setUp()
}

function gaby(){
    colorSwaps('#ffff00', '#f600c4', '#f600c4', '#ffff00', 'red', 2)
    document.querySelector('.boardBoarder').classList.add('gradient')
}

function normal(){
    colorSwaps('seagreen', 'beige', '#4b6b43', '#C6DEA6', 'black', 1)
    document.querySelector('.boardBoarder').classList.remove('gradient')
}

function colorSwaps(black, white, blackPiece, whitePiece, borderColor, borderWidth){
    let root = document.querySelector(':root').style
    root.setProperty('--blackColor', black)
    root.setProperty('--whiteColor', white)
    root.setProperty('--borderWidth', borderWidth + 'px')
    root.setProperty('--borderColor', borderColor)
    root.setProperty('--blackPiece', blackPiece)
    root.setProperty('--whitePiece', whitePiece)
}

setUp()
createInput()
normal()