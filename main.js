const fs = require('fs');
let ch = require('cheerio');

class Variable { // variable class
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
let arrZmiennych = []; // array of variables
if (!process.argv[2]) {
    throw new Error("Correct use: node main.js <relative path to file>")
}

fs.readFile(process.argv[2], 'utf8', (err, f) => {
    if (err) throw err;
    let $ = ch.load(f);

    // find the main function
    $('function').each((index, el) => {
        if ($(el).attr('name') == "main") {
            $(el).children().each((indexa, ela) => {
                itr($, ela); // just run the code
            })
        }
    })
})

function parseStringForVariables(string) {
    let str = string.split(' '); // split into array
    str.forEach((lol) => { // for each word
        if (lol.substring(0, 1) == "#") { // if variable found
            let last = lol.substring(1);
            let c;
            arrZmiennych.forEach((vari) => {
                let potym = last.substr(vari.name.length, last.length);
                if(last.includes(vari.name)) c = vari.value+potym; 
            })
            if (typeof c != 'undefined') {
                str[str.indexOf(lol)] = c;
            }
        }
    })
    return str.join(' '); // return complete string
}

function findVariable(name) { // find variable in arrZmiennych (array of variables)
    let value;
    arrZmiennych.forEach((vari) => {
        if (vari.name == name) { // if found
            value = vari.value;
        }
    })
    return value; 
}

function leta($, ela, val) {
    let lk = arrZmiennych.find(o => o.name == $(ela).attr('id'));
    if(typeof lk != 'undefined') {
        arrZmiennych[arrZmiennych.indexOf(lk)].value = val;
    } else {
        let zmienna = new Variable($(ela).attr('id'), val)
        arrZmiennych.push(zmienna); // register the variable
    }
}
function itr($, ela) { 
    switch (ela.tagName.toLowerCase()) {
        case "let":
            leta($, ela, $(ela).text());
            break;
        case "print": // printing
            let a = parseStringForVariables($(ela).text());
            if (typeof a != 'undefined') {
                console.log(a);
            }
            //console.log($(ela).text());
            break;
        case "math":

            if($(ela).attr("type")) {
            let arr = [];
            let type = $(ela).attr("type");
            $(ela).children().each((i1, e1) => { // push each let to array
                if (e1.tagName == "let") {
                    if (isNaN($(e1).text())) {
                        throw new TypeError(`${$(e1).text()} is not a number.`)
                    } else arr.push(Number($(e1).text()));
                }

            })
            let wynik = 0; // result

            switch (type) {
                case "+":
                    arr.forEach((liczba) => {
                        wynik += liczba; 
                    })
                    break;
                case "-":
                    arr.forEach((liczba) => {
                        wynik -= liczba;
                    })
                case "*":
                    wynik = arr[0];
                    arr.forEach((liczba, i) => {
                        if (i != 0) wynik = wynik * liczba;
                    })
                    break;
                case ":":
                case "/":
                    wynik = arr[0];
                    arr.forEach((liczba, i) => {
                        if (i != 0) wynik = wynik / liczba;
                    })
                    break;
            }

            if ($(ela).attr("id").length > 0) { // save to result xml variable
                /*let zmienna = new Variable($(ela).attr('id'), wynik);
                arrZmiennych.push(zmienna);*/
                leta($, ela, wynik);
            }
            } else {
                let evalowany = parseStringForVariables($(ela).text());
                wynik = eval(evalowany);
                /*let zmienna = new Variable($(ela).attr('id'), wynik);
                arrZmiennych.push(zmienna);*/
                leta($, ela, wynik);
            }
            break;
        case "call": // call a function
            let functionName = $(ela).attr("name");
            call($, functionName);
            break;
        case "js": // eval js code
            let elat = parseStringForVariables($(ela).text());
            eval(elat);
            break;
        case "if": // if statement
            let conditionString = parseStringForVariables($(ela).attr("c"));
            let con = conditionString.split(' ');
            if(con.length == 3) { // if condition looks like "#var == 6"
                let a = con[0]; // left side
                let b = con[2]; // right side
                let ab = con[1];
                if(ab == "==") {
                    if(a == b) {
                        ifTrue($, ela);
                    } else {
                        ifFalse($, ela);
                    }
                } else if (ab == "!=") {
                    if(a != b) {
                        ifTrue($, ela);
                    } else {
                       ifFalse($, ela);
                    }
                } else if (ab == ">") {
                    if(Number(a) > Number(b)) ifTrue($, ela);
                    else ifFalse($, ela);
                } else if (ab == "<") {
                    if(Number(a) < Number(b)) {
                        ifTrue($, ela)
                    }
                    else ifFalse($, ela);
                }
            }
            break;
        case "sleep": 
            let czas = $(ela).attr("ms"); // time in ms
            setTimeout(() => {
                $(ela).children().each((i, e) => itr($, e))
            }, Number(czas))
            break;
        case "for": // for loop
            let count = Number($(ela).attr("c"));
            leta($, ela, 0);
            for(let i = 0; i < count; i++) {
                leta($, ela, i);
                $(ela).children().each((i4, e4) => {
                    itr($, e4);
                })
            }
            break;
        default: // other way to call a function
            let fName = ela.tagName;
            call($, fName);
            break;
    }
}

ifTrue = ($, ela) => {
    $(ela).children().each((i2, e2) => {
        itr($, e2);
    })
}
ifFalse = ($, ela) => {
    $(ela).find("else").children().each((i3, e3) => {
        itr($, e3);
    })
}

function call($, fName) {
    $('function').each((index, el) => {
        if ($(el).attr('name').toLowerCase() == fName) {
            $(el).children().each((indexa, ela) => {
                itr($, ela);
                return;
            })
        }
    })
}