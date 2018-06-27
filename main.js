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
            let c = findVariable(last);
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

function itr($, ela) { 
    switch (ela.tagName.toLowerCase()) {
        case "let": 
            let zmienna = new Variable($(ela).attr('id'), $(ela).text())
            arrZmiennych.push(zmienna); // register the variable
            break;
        case "print": // printing
            let a = parseStringForVariables($(ela).text());
            if (typeof a != 'undefined') {
                console.log(a);
            }
            //console.log($(ela).text());
            break;
        case "math":
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
                let zmienna = new Variable($(ela).attr('id'), wynik);
                arrZmiennych.push(zmienna);
            }
            break;
        case "call":
            let functionName = $(ela).attr("name");
            $('function').each((index, el) => {
                if ($(el).attr('name') == functionName) {
                    $(el).children().each((indexa, ela) => {
                        itr($, ela)
                    })
                }
            })
    }
}

// i know i could do it better but i will do it later