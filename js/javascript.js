let buttons = document.getElementsByClassName("button");
let inputText = document.getElementById("input");

let input = "";
let nonNumberButtons = ["add", "minus", "multiply", "divide", "ac", "equals"];
let operations = ["divide", "multiply", "add", "minus"];
let queue = [];
let clear = () => inputText.innerHTML = "0";

let numberButtonCheck = (btn) => {
    let isNotANumber = nonNumberButtons.includes(btn);
    if(isNotANumber) {
        if (input !== "") {
            queue.push(parseFloat(input));
        }

        if (btn === "ac") {
            calculator.ac();
        } else if (btn === "equals" && queue.length > 2) {
            if (typeof queue[queue.length - 1] !== "number") {
                inputText.innerHTML = "Error";
                input = ""
            } else {
                let result = solveQueue();
                input = result;
                calculator.print(result);
            }
        } else if (input !== "") {
            queue.push(String(btn));
            input = "";
        }
        return false;
    }
    return !(input === "" && btn === ".");
}

// TODO: Review
function getAllIndexes(array, value) {
    let indexes = [],
        i = -1;
    while ((i = array.indexOf(value, i + 1)) !== -1) {
        indexes.push(i);
    }
    return indexes;
}

let solveQueue = () => {
    if (queue.length > 1) {
        for (let i = 0; i < operations.length; i++) {
            let currentOperationArray = getAllIndexes(queue, operations[i]);
            while (currentOperationArray.length > 0) {
                let currentValue = calculator[operations[i]](
                    queue[currentOperationArray[0] - 1], 
                    queue[currentOperationArray[0] + 1]
                );
                queue.splice(currentOperationArray[0] - 1, 3, currentValue);
                currentOperationArray = getAllIndexes(queue, operations[i]);
            }
        }
    }
    return queue[0];
}

let calculator = {
    divide: function (x, y) {
        return (x / y);
    },
    multiply: function (x, y) {
        return (x * y);
    },
    add: function (x, y) {
        return (x + y);
    },
    minus: function (x, y) {
        return (x - y);
    },
    ac: function () {
        input = ""
        queue = [];
        inputText.innerHTML = "0";
    },
    print: function (number) {
        queue = [];
        inputText.innerHTML = number;
    }
}

for (let i = 0; i < buttons.length; i++) {
    let btnId = buttons[i].id;
    buttons[i].addEventListener('click', run => {
        if (numberButtonCheck(btnId) && !(btnId === "0" && input === "")) {
            input += buttons[i].id;
            inputText.innerHTML = input;
        }
    });
}

/* Adds Keyboard Support */
document.addEventListener('keydown', (e) => {
    let keymap = {
        '+': 'add',
        '-': 'minus',
        '*': 'multiply',
        '/': 'divide',
        '=': 'equals',
        'Enter': 'equals',
        'Escape': 'ac',
    };
    for(let i = 0; i < 10; i ++) {
        keymap[String(i)] = String(i);
    }
    if(Object.keys(keymap).includes(e.key)) {
        if (numberButtonCheck(keymap[e.key]) && !(e.key === "0" && input === "")) {
            input += keymap[e.key];
            inputText.innerHTML = input;
        }
    }
})