import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL, MK_NUMBER } from "./runtime/values.ts";

const parser = new Parser();
const env = new Environment();

// Create default global variables
env.declareVar("x", MK_NUMBER(100));
env.declareVar("true", MK_BOOL(true));
env.declareVar("false", MK_BOOL(false));
env.declareVar("null", MK_NULL());

console.log("Language v0.1");

while (true) {
	const input = prompt("> ");

	// Check for no user input or exit keyword.
	if (!input || input.includes("exit")) Deno.exit();

	const program = parser.produceAST(input);

	const result = evaluate(program, env);

	console.log(result);
}
