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

## [Example code](https://github.com/pizza61/xmlscript/blob/master/demo.xml)

## Documentation

### Variables
**Tag**: `<let>`

**Attributes**:
* id - variable name

**Example**:
```xml
<let id="name">value</let>
```

### Math
**Tag**: `<math>`

**Attributes**:
* id - name of variable with result

**Example**:
```xml
<math id="result">Math.sqrt(16)</math>
```

### js
**Tag**: `<js>`

Eval js code

**Example**:
```xml
<js>console.log("hello world")</js>
```

### if
**Tag**: `<if>`

**Attributes**:
* c - condition

**Example**:
```xml
<if c="2 > 1">
    <print>2 > 1!!!</print>
    <else>
        <print>what</print>
    </else>
</if>
```

### sleep
**Tag**: `<sleep>`

**Attributes**:
* ms - time in ms

**Example**:
```xml
<sleep ms="2500">
    <print>Oh, hi!</print>
</sleep>
```

### for
**Tag**: `<for>`

**Attributes**:
* c - count
* id - name of variable with counter

**Example**:
```xml
<for id="count" c="3">
    <print>#count</print>
</for>
```
### Print
**Tag**: `<print>`

**Attributes**: none

**Example**:
```xml
<print>You can print #variables</print>
```

### Functions, call
```xml
<function name="main">
    <notmain></notmain>
</function>

<function name="notmain">
    <main></main>
</function>
```

## TODO
everything, but the most important:
* arrays
* classes
* a way to make a request and parse json

Have fun!
