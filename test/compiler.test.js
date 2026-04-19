import { describe, it } from "node:test";
import assert from "node:assert/strict";
import compile from "../src/compiler.js";

// A simple, valid Groovy program to run through the full pipeline
const sampleProgram = "play 0";

describe("The compiler", () => {
  it("throws when the output type is missing", () => {
    assert.throws(() => compile(sampleProgram), /Unknown output type/);
  });

  it("throws when the output type is unknown", () => {
    assert.throws(() => compile(sampleProgram, "noise"), /Unknown output type/);
  });

  it("accepts the parsed option", () => {
    const compiled = compile(sampleProgram, "parsed");
    assert.equal(compiled, "Syntax is ok");
  });

  it("accepts the analyzed option", () => {
    const compiled = compile(sampleProgram, "analyzed");
    assert.equal(compiled.kind, "Program");
    assert.ok(Array.isArray(compiled.body));
  });

  it("accepts the optimized option", () => {
    const compiled = compile(sampleProgram, "optimized");
    assert.equal(compiled.kind, "Program");
    assert.ok(Array.isArray(compiled.body));
  });

  it("generates js code when given the js option", () => {
    const compiled = compile(sampleProgram, "js");
    // Groovy's 'play 0' should translate to JS 'console.log(0);'
    assert.equal(compiled, "console.log(0);");
  });

  it("properly passes the source map to the parser for error handling", () => {
    const badProgram = "play 0)";
    const mockMap = [
      { index: 6, char: ")", time: "0.50", channel: 1, pitch: 60 },
    ];

    assert.throws(
      () => compile(badProgram, "parsed", mockMap),
      /AUDIO TRACEBACK/,
    );
  });
});
