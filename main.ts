import Parser from "./src/parser.ts";

const parser = new Parser();

console.log("Language v0.1");

while (true) {
	const input = prompt("> ");

	// Check for no user input or exit keyword.
	if (!input || input.includes("exit")) Deno.exit();

	const program = parser.produceAST(input);

	console.log(program);
}
