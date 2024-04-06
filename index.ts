import { tokenize } from "./lexer";

const source = await Bun.file("test.txt").text();
for (const token of tokenize(source)) {
	console.log(token);
}
