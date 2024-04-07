import { type UnionToObject, type ObjectToUnion } from "./utils";

export const TokenType: UnionToObject<
	| "Number"
	| "String"
	| "Identifier"
	| "Equals"
	| "Comment"
	| "OpenParen"
	| "CloseParen"
	| "BinaryOparator"
	| "DoubleQuote"
	| "SingleQuote"
	| "Let"
> = {
	Number: "Number",
	Identifier: "Identifier",
	Equals: "Equals",
	Comment: "Comment",
	OpenParen: "OpenParen",
	CloseParen: "CloseParen",
	BinaryOparator: "BinaryOparator",
	DoubleQuote: "DoubleQuote",
	SingleQuote: "SingleQuote",
	Let: "Let",
	String: "String",
} as const;

const Keywords: Partial<
	Record<Lowercase<keyof typeof TokenType>, ObjectToUnion<typeof TokenType>>
> = {
	let: TokenType.Let,
};

export type Token = {
	value: string;
	type: ObjectToUnion<typeof TokenType>;
};

const token = (value: Token["value"] = "", type: Token["type"]): Token => {
	return { value, type };
};

const isAlpha = (str: string): boolean =>
	str.toUpperCase() !== str.toLowerCase();

const isInt = (str: string): boolean => {
	const c = str.charCodeAt(0);
	return c >= 48 && c <= 57;
};

const isSkippable = (str: string): boolean => {
	return [" ", "\n", "\t"].includes(str);
};

const isBinaryOperator = (str: string): boolean => {
	return ["+", "-", "*", "/", "//", "%"].includes(str);
};

export const tokenize = (sourceCode: string): Token[] => {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	// Set opening values
	let openDoubleQuotes = false;
	let insideComment = false;
	let stringContents = "";
	let commentContents = "";
	let numberContents = "";
	let identifierContents = "";

	// Build each token until end of file
	src.forEach((char, _index) => {
		if (char === '"') {
			tokens.push(token(char, "DoubleQuote"));
			openDoubleQuotes = !openDoubleQuotes;
		} else if (openDoubleQuotes) stringContents += char;
		else if (insideComment && char !== "\n") commentContents += char;
		else if (char === "#") insideComment = true;
		else if (insideComment) {
			insideComment = false;
			if (!!commentContents) tokens.push(token(commentContents, "Comment"));
			commentContents = "";
		} else if (!!stringContents) {
			tokens.push(token(stringContents, "String"));
			stringContents = "";
		} else if (char === "(") tokens.push(token(char, "OpenParen"));
		else if (char === ")") tokens.push(token(char, "CloseParen"));
		else if (char === "=") tokens.push(token(char, "Equals"));
		else if (isBinaryOperator(char)) tokens.push(token(char, "BinaryOparator"));
		else if (isInt(char)) numberContents += char;
		else if (isAlpha(char)) identifierContents += char;
		else if (!!numberContents) {
			tokens.push(token(numberContents, "Number"));
			numberContents = "";
		} else if (!!identifierContents) {
			const reserved = Keywords[identifierContents as keyof typeof Keywords];
			if (!!reserved) tokens.push(token(identifierContents, reserved));
			else tokens.push(token(identifierContents, "Identifier"));
			identifierContents = "";
		} else if (isSkippable(char)) return;
		else {
			console.error(`Unrecognized character found in source: ${char}`);
			process.exit(1);
		}
	});

	return tokens;
};
