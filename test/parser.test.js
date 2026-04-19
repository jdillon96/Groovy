import { describe, it } from "node:test";
import assert from "node:assert";
import parse from "../src/parser.js";

const syntaxChecks = [
  ["note x = 1", "mutable variable declaration"],
  ["key y = open", "immutable variable declaration"],
  ["x = 2", "assignment statement"],
  ["x sharp", "sharp bump operator"],
  ["y flat", "flat bump operator"],
  ["play 1", "play statements (print)"],
  ["cue open : play 1 cadence", "cue (if) statements"],
  ["cue (x < 2) : play x cadence", "cue statements with condition parens"],
  [
    "cue open : play x alt closed : play y cadence",
    "cue-alt (if-elseif) statements",
  ],
  [
    "cue open : play x alt closed : play y drop : play z cadence",
    "cue-alt-drop statements",
  ],
  ["vamp open : play x cadence", "vamp (while) statements"],
  ["vamp (x < 2) : play x cadence", "vamp statements with condition parens"],
  ["encore 5 : play x cadence", "encore (repeat) statements"],
  ["measure i from 1 to 4 : play i cadence", "measure range loops"],
  ["measure item in arr : play item cadence", "measure collection loops"],
  ["vamp open : cut cadence", "cut (break) statement inside loop"],
  ["note count = 3 * 22 + 1", "complex math expressions"],
  [
    "play 1 + ((2 * 3)) % x ^ 5",
    "parenthesized and exponentiation expressions",
  ],
  ["play -5", "unary minus expressions"],
  ["play !open", "unary not expressions"],
  ["play ghost 5", "unary optional (ghost) instantiation"],
  ["note res = open ? 1 : 2", "ternary conditional expressions"],
  ["note res = opt ?? 5", "unwrap else (??) expressions"],
  ["note arr = [1, 2, 3]", "array literals"],
  ["play arr[0]", "array subscripting"],
  ["chord Point : x : level y : level cadence", "chord (struct) declaration"],
  ["play pt.x", "struct member access"],
  ["play pt?.y", "struct optional chaining"],
  [
    "compose add(a : level, b : level) -> level : fin a + b cadence",
    "function with return type",
  ],
  [
    "compose log(msg : lyric) : play msg fin cadence",
    "function with no return type and short fin",
  ],
  ["play add(5, 7)", "function call"],
  ['note s = "hello"', "string literals"],
  ["note b = open", "open boolean literal"],
  ["note b = closed", "closed boolean literal"],
  [
    "chord Box : val : ghost level cadence",
    "optional type annotation in array/struct",
  ],
  ["", "empty input"],
];

const syntaxErrors = [
  ["play 1)", "missing opening parenthesis"],
  ["play(1", "missing closing parenthesis"],
  ["note x 1", "missing equals sign"],
  ["x = ", "missing expression"],
  ["cue open play x cadence", "missing colon in cue block"],
  ["cue open : play x", "missing cadence terminator"],
  ["cue open : play x alt", "missing alternate block"],
  ["note = 1", "missing variable name"],
  ["note 1 = 2", "invalid variable name"],
  ["note cue = 1", "'cue' is a keyword, not a variable name"],
  ["note x = play 1", "play is a statement, not an expression"],
  ["vamp open : play x", "missing cadence on vamp loop"],
  ["chord Point level x cadence", "missing colon in chord declaration"],
  ["compose add(a, b) : fin a + b cadence", "parameters missing types"],
  ["measure i from 1 : play i cadence", "missing 'to' in measure range"],
  ["measure i 1 to 4 : play i cadence", "missing 'from' in measure range"],
  ["measure i on arr : play i cadence", "wrong keyword, should be 'in'"],
];

describe("The Parser", () => {
  for (const [input, scenario] of syntaxChecks) {
    it(`matches ${scenario}`, () => {
      const match = parse(input, []);
      assert(match.succeeded(), `Expected to parse "${input}" successfully.`);
    });
  }

  for (const [input, scenario] of syntaxErrors) {
    it(`correctly detects the ${scenario} error`, () => {
      assert.throws(
        () => parse(input, []),
        `Expected parsing "${input}" to throw a syntax error.`,
      );
    });
  }

  it("includes audio traceback in error message when source map is provided", () => {
    const source = "play 1)"; // Syntax error at index 6
    const mockSourceMap = [
      { index: 0, char: "p", time: "0.10", channel: 1, pitch: 60 },
      { index: 6, char: ")", time: "0.50", channel: 4, pitch: 65 },
    ];
    try {
      parse(source, mockSourceMap);
      assert.fail("Expected parsing to throw an error");
    } catch (e) {
      assert.match(e.message, /AUDIO TRACEBACK/);
      assert.match(e.message, /Timestamp: 0.50s/);
      assert.match(e.message, /Channel:\s+4/);
    }
  });

  it("uses fallback audio traceback when source map timestamp is out of range", () => {
    const source = "play 1)";
    const mockSourceMap = [
      { index: 99, char: "x", time: "0.10", channel: 1, pitch: 60 },
    ];
    try {
      parse(source, mockSourceMap);
      assert.fail("Expected parsing to throw an error");
    } catch (e) {
      assert.match(e.message, /GROOVY SYNTAX ERROR/);
      // Now it expects the traceback to successfully trigger via the fallback!
      assert.match(e.message, /AUDIO TRACEBACK/);
      assert.match(e.message, /Character: 'x'/);
    }
  });
});
