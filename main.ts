import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL, MK_NUMBER } from "./runtime/values.ts";

// Getting filename
const file = Deno.args[0];

// Combine frontend and runtime
const parser = new Parser();
const env = new Environment();

// Create default global variables
env.declareVar("true", MK_BOOL(true), true);
env.declareVar("false", MK_BOOL(false), true);
env.declareVar("null", MK_NULL(), true);
env.declareVar("pi", MK_NUMBER(3.141592653589793), true);

if (!file) {
	console.log("Repl");
	while (true) {
		const input = prompt("> ");
		// Check for no user input or exit keyword.
		if (!input || input.includes("exit")) Deno.exit(0);
		const program = parser.produceAST(input);
		const result = evaluate(program, env);
		console.log(result);
	}
} else {
	const input = await Deno.readTextFile(file);
	const program = parser.produceAST(input);
	const result = evaluate(program, env);
	console.log(result);
}
