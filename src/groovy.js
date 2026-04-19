#! /usr/bin/env node

import * as fs from "node:fs/promises";
import stringify from "graph-stringify";
import { processMidi } from "./preprocessor.js";
import compile from "./compiler.js";

const help = `Groovy Compiler

Usage: node src/groovy.js <filename> <outputType>

The <filename> can be a .mid, .midi, or .groovy file.

The <outputType> must be one of:
  parsed     Confirms the musical syntax is valid
  analyzed   Shows the validated Abstract Syntax Tree (AST)
  optimized  Shows the AST after algebraic folding and logic cleanup
  js         Spits out the executable JavaScript translation
`;

async function compileFromFile(filename, outputType) {
  try {
    let sourceCode = "";
    let sourceMap = [];

    // 1. Route based on file extension
    if (filename.endsWith(".mid") || filename.endsWith(".midi")) {
      // Audio Route: Preprocess MIDI to get text and audio timestamps
      const result = processMidi(filename);
      sourceCode = result.sourceCode;
      sourceMap = result.sourceMap;
    } else {
      // Text Route: Read the .groovy file directly
      const buffer = await fs.readFile(filename);
      sourceCode = buffer.toString();
      // sourceMap stays empty [] for text files
    }

    // 2. Run the compiler pipeline
    const compiled = compile(sourceCode, outputType, sourceMap);

    // 3. Format the output
    // If the output is an AST object, stringify the graph.
    // If it's a string (like JS code or "Syntax is ok"), print it raw.
    console.log(
      typeof compiled === "object" ? stringify(compiled, "kind") : compiled,
    );
  } catch (e) {
    // Standard terminal error formatting (Red text)
    console.error(`\x1b[31m${e.message}\x1b[0m`);
    process.exitCode = 1;
  }
}

// Ensure the user provided exactly two arguments: <file> and <outputType>
if (process.argv.length === 4) {
  await compileFromFile(process.argv[2], process.argv[3]);
} else {
  console.log(help);
  process.exitCode = 2;
}
