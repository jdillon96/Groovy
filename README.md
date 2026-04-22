<div align="center">
  <img src="docs/Groovy-logo.png" height="256" alt="Groovy Logo">

# Groovy

_Music in. Software out._

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](#)
[![Compiles to](https://img.shields.io/badge/compiles%20to-JavaScript-yellow)](#)

</div>

---

## The Story

Groovy is a statically-typed, music-themed programming language that compiles to JavaScript. Every construct speaks the language of music: variables are **notes**, functions are **compositions**, loops are **measures** and **vamps**, and conditionals are **cues**. The result is a language that feels like writing a score — structured, expressive, and rhythmically satisfying. Groovy was built as a semester-long compiler project for CMSI-3802 at LMU, covering lexing, parsing, semantic analysis, optimization, and code generation end-to-end.

---

## Features

- **Music-themed syntax** — keywords drawn entirely from musical vocabulary
- **Strong static typing** — five primitive types: `level`, `lyric`, `gate`, `silence`, `noise`
- **Optional types** — first-class `ghost` types with `??` unwrap-else semantics
- **Structs** — custom data types via `chord` declarations
- **Arrays** — typed, subscriptable collections
- **First-class functions** — typed parameters and return annotations via `compose`
- **Rich control flow** — `cue`/`alt`/`drop`, `vamp` (while), `measure` (for-range & for-in), `encore` (repeat N times), `cut` (break)
- **Immutability** — `key` declares constants; function parameters are immutable by default
- **Compiles to JavaScript** — clean ES6+ output with safe name mangling

---

## Quick Reference

| Groovy                 | Meaning                 |
| ---------------------- | ----------------------- |
| `note`                 | mutable variable        |
| `key`                  | immutable constant      |
| `chord`                | struct / record type    |
| `compose`              | function declaration    |
| `fin`                  | return                  |
| `play`                 | print to stdout         |
| `cue` / `alt` / `drop` | if / else-if / else     |
| `vamp`                 | while loop              |
| `measure … from … to`  | numeric range loop      |
| `measure … in`         | collection loop         |
| `encore N`             | repeat N times          |
| `cut`                  | break                   |
| `cadence`              | end-of-block terminator |
| `open` / `closed`      | true / false            |
| `ghost`                | optional type wrapper   |
| `sharp` / `flat`       | `++` / `--`             |
| `^`                    | exponentiation          |
| `??`                   | unwrap-else (optional)  |
| `level`                | number                  |
| `lyric`                | string                  |
| `gate`                 | boolean                 |
| `silence`              | void (no return)        |

---

## Static Checks

The Groovy analyzer catches the following errors at compile time:

**Scope & Declarations**

- Using an undeclared identifier
- Re-declaring a variable in the same scope
- Assigning to an immutable `key` variable (including function parameters)

**Type Checking**

- Non-numeric operands in arithmetic (`+`, `-`, `*`, `/`, `%`, `^`)
- Non-boolean operands in logical expressions (`&&`, `||`, `!`)
- Non-boolean condition in `cue`, `alt`, or `vamp`
- Non-numeric count in `encore`
- Mismatched types in assignment or comparison
- Mixed-type elements in an array literal

**Functions**

- Calling a non-function
- Wrong number of arguments
- Argument type mismatch against declared parameter types

**Structs**

- Member access on a non-`chord` type
- Accessing a field that doesn't exist on a `chord`
- Optional chaining (`?.`) on a non-`chord` type

**Optionals & Arrays**

- Using `??` on a non-`ghost` (non-optional) value
- Mismatched types in an unwrap-else expression
- Using `in` iteration on a non-array
- Subscripting a non-array

---

## Examples

### Variables & Constants

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note score = 100
key maxScore = 999
note name = "Alice"
note active = open
```

</td>
<td>

```javascript
let score_1 = 100;
let maxScore_2 = 999;
let name_3 = "Alice";
let active_4 = true;
```

</td>
</tr>
</table>

---

### Arithmetic & Operators

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note x = 4
note y = x ^ 3
x sharp
x flat
play x + y
```

</td>
<td>

```javascript
let x_1 = 4;
let y_2 = x_1 ** 3;
x_1++;
x_1--;
console.log(x_1 + y_2);
```

</td>
</tr>
</table>

---

### Conditionals

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note x = 5

cue x < 0 :
  play "negative"
alt x == 0 :
  play "zero"
drop :
  play "positive"
cadence
```

</td>
<td>

```javascript
let x_1 = 5;

if (x_1 < 0) {
  console.log("negative");
} else if (x_1 === 0) {
  console.log("zero");
} else {
  console.log("positive");
}
```

</td>
</tr>
</table>

---

### While Loop (`vamp`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note i = 0
vamp i < 5 :
  play i
  i = i + 1
cadence
```

</td>
<td>

```javascript
let i_1 = 0;
while (i_1 < 5) {
  console.log(i_1);
  i_1 = i_1 + 1;
}
```

</td>
</tr>
</table>

---

### Range Loop (`measure … from … to`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
measure i from 1 to 10 :
  play i
cadence
```

</td>
<td>

```javascript
for (let i_1 = 1; i_1 <= 10; i_1++) {
  console.log(i_1);
}
```

</td>
</tr>
</table>

---

### Collection Loop (`measure … in`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note beats = [1, 2, 3, 4]
measure beat in beats :
  play beat
cadence
```

</td>
<td>

```javascript
let beats_1 = [1, 2, 3, 4];
for (let beat_2 of beats_1) {
  console.log(beat_2);
}
```

</td>
</tr>
</table>

---

### Repeat Loop (`encore`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
encore 4 :
  play "drop the beat"
cadence
```

</td>
<td>

```javascript
for (let i_1 = 0; i_1 < 4; i_1++) {
  console.log("drop the beat");
}
```

</td>
</tr>
</table>

---

### Functions (`compose`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
compose add(x : level, y : level) -> level :
  fin x + y
cadence

compose greet(name : lyric) :
  play name
cadence

play add(3, 7)
greet("Groovy")
```

</td>
<td>

```javascript
function add_1(x_2, y_3) {
  return x_2 + y_3;
}
function greet_4(name_5) {
  console.log(name_5);
}
console.log(add_1(3, 7));
greet_4("Groovy");
```

</td>
</tr>
</table>

---

### Structs (`chord`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
chord Point :
  x : level
  y : level
cadence

compose makePoint(a : level, b : level) -> Point :
  fin Point(a, b)
cadence

note p = makePoint(3, 4)
play p.x
```

</td>
<td>

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
function makePoint_1(a_2, b_3) {
  return new Point(a_2, b_3);
}
let p_4 = makePoint_1(3, 4);
console.log(p_4.x);
```

</td>
</tr>
</table>

---

### Optional Types (`ghost`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note maybeScore = ghost 42
note result = maybeScore ?? 0
play result
```

</td>
<td>

```javascript
let maybeScore_1 = 42;
let result_2 = maybeScore_1 ?? 0;
console.log(result_2);
```

</td>
</tr>
</table>

---

### Arrays & Subscripting

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note notes = [60, 62, 64, 65, 67]
play notes[0]
measure n in notes :
  play n
cadence
```

</td>
<td>

```javascript
let notes_1 = [60, 62, 64, 65, 67];
console.log(notes_1[0]);
for (let n_2 of notes_1) {
  console.log(n_2);
}
```

</td>
</tr>
</table>

---

### Break (`cut`)

<table>
<tr><th>Groovy</th><th>JavaScript</th></tr>
<tr>
<td>

```groovy
note i = 0
vamp i < 100 :
  cue i == 5 :
    cut
  cadence
  i = i + 1
cadence
```

</td>
<td>

```javascript
let i_1 = 0;
while (i_1 < 100) {
  if (i_1 === 5) {
    break;
  }
  i_1 = i_1 + 1;
}
```

</td>
</tr>
</table>

---

## GitHub Pages

Visit the Groovy project site:

---

## Team

| Name           | GitHub                                     |
| -------------- | ------------------------------------------ |
| Diego Cuadros  | —                                          |
| Jay Dillon     | [@jdillon96](https://github.com/jdillon96) |
| Westley Holmes | [@WesHolmes](https://github.com/WesHolmes) |
| Jesus Lopez    | —                                          |

---

<div align="center">
  <sub>Built with ♩ for CMSI-3802 at Loyola Marymount University</sub>
</div>
