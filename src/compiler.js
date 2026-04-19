import parse from "./parser.js";
import analyze from "./analyzer.js";
import optimize from "./optimizer.js";
import generate from "./generator.js";

export default function compile(source, outputType, sourceMap = []) {
  if (!["parsed", "analyzed", "optimized", "js"].includes(outputType)) {
    throw new Error("Unknown output type");
  }

  // 1. Parse the source string, passing the audio map for accurate error tracebacks
  const match = parse(source, sourceMap);
  if (outputType === "parsed") return "Syntax is ok";

  // 2. Semantically analyze the parsed AST
  const analyzed = analyze(match);
  if (outputType === "analyzed") return analyzed;

  // 3. Optimize the AST (constant folding, dead code elimination, etc.)
  const optimized = optimize(analyzed);
  if (outputType === "optimized") return optimized;

  // 4. Generate the final JavaScript executable code
  return generate(optimized);
}
