import * as ohm from "ohm-js";
import * as fs from "node:fs/promises";

const grammarSource = await fs.readFile("./src/groovy.ohm", "utf-8");
const grammar = ohm.grammar(grammarSource);

export default function parse(sourceCode, sourceMap = []) {
  const match = grammar.match(sourceCode);

  if (match.failed()) {
    const errorIndex = match.rightmostFailurePosition ?? 99999;
    const reversedMap = [...sourceMap].reverse();

    // Clean lookup: no hacky fallbacks.
    const errorData = reversedMap.find((entry) => entry.index <= errorIndex);

    let errorMessage = `\n🚨 GROOVY SYNTAX ERROR 🚨\n${match.message}\n`;

    if (errorData) {
      errorMessage += `\n🎵 AUDIO TRACEBACK:\nTimestamp: ${errorData.time}s\nChannel:   ${errorData.channel}\nPitch:     ${errorData.pitch}\nCharacter: '${errorData.char}'\n`;
    }

    throw new Error(errorMessage);
  }

  return match;
}
