import Parser from "./frontend/parser.ts";
import { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

// Getting filename
const file = Deno.args[0];

// Combine frontend and runtime
const parser = new Parser();
const env = createGlobalEnv();

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
