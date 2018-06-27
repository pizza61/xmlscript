# xmlscript

xml-based programming language and only interpreter for it.

## How to use
* make sure you have node installed
* git clone
* npm install
* write your script
* ```node main.js yourscript.xml```
* ...
* profit

## Example code
```xml
<function name="main">
    <math type="+" id="result">
        <let>2</let>
        <let>6</let>
    </math>
    <call name="printResult" />
</function>

<function name="printResult">
    <print>#result</print>
</function>
```
Output:
```
8
```

## Documentation

### Variables
```xml
<let id="name">value</let>
```

### Math

```xml
<math type="+" id="nameOfVariableWithResult">
    <let>2</let>
    <let>2</let>
</math>
```

types:
* `+` addition
* `-` subtraction
* `*` multiplication
* `/` division

### Print

```xml
<print>You can print #variables</print>
```

### Functions, call
```xml
<function name="main">
    <call name="notmain">
</function>

<function name="notmain">
    <call name="main">
</function>
```

## TODO
everything, but the most important:
* if
* loops (for, while)
* arrays
* classes
* a way to make a request and parse json

Have fun!