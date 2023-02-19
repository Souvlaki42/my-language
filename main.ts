import Parser from "./core/parser.ts";
import { createGlobalEnv } from "./logic/environment.ts";
import { evaluate } from "./logic/interpeter.ts";

// repl();
run("./test.sl");

async function run(filename: string) {
	const parser = new Parser();
	const env = createGlobalEnv();

	const input = await Deno.readTextFile(filename);
	const program = parser.produceAST(input);
	evaluate(program, env);
}
