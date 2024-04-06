import {
	type UnionToObject,
	type ObjectToUnion,
	countOccurencies,
} from "./utils";

export const TokenType: UnionToObject<
	| "Number"
	| "String"
	| "Identifier"
	| "Equals"
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
	return str === " " || str === "#" || str === "\n" || str === "\t";
};

export const tokenize = (sourceCode: string): Token[] => {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	// Set quotes open for string
	let openDoubleQuotes = false;
	let openSingleQuotes = false;

	// Build each token until end of file
	while (src.length > 0) {
		if (src[0] === "(") tokens.push(token(src.shift(), "OpenParen"));
		else if (src[0] === '"') {
			tokens.push(token(src.shift(), "DoubleQuote"));
			openDoubleQuotes = !openDoubleQuotes;
		} else if (src[0] === "'") {
			tokens.push(token(src.shift(), "SingleQuote"));
			openSingleQuotes = !openSingleQuotes;
		} else if (src[0] === ")") tokens.push(token(src.shift(), "CloseParen"));
		else if (
			src[0] === "+" ||
			src[0] === "-" ||
			src[0] === "*" ||
			src[0] === "/"
		)
			tokens.push(token(src.shift(), "BinaryOparator"));
		else if (src[0] === "=") tokens.push(token(src.shift(), "Equals"));
		// Handle multicharacter tokens
		// Build number token
		else if (isInt(src[0])) {
			let num = "";
			while (src.length > 0 && isInt(src[0])) {
				num += src.shift();
			}
			tokens.push(token(num, "Number"));
		} else if (src[0] === "#") {
			// Handle comments
		} else if (isAlpha(src[0])) {
			// Build alpha token
			let ident = "";
			while (src.length > 0 && isAlpha(src[0])) {
				ident += src.shift();
			}

			const reserved = Keywords[ident as Lowercase<keyof typeof TokenType>];
			if (openDoubleQuotes) {
				tokens.push(token(ident, "String"));
				openDoubleQuotes = false;
			} else if (openSingleQuotes) {
				tokens.push(token(ident, "String"));
				openDoubleQuotes = false;
			} else if (!reserved) tokens.push(token(ident, "Identifier"));
			else if (reserved) tokens.push(token(ident, reserved));
			// Build skippable token
		} else if (isSkippable(src[0])) src.shift(); // Skip current token
		else {
			console.error(`Unrecognized character found in source: ${src[0]}`);
			process.exit(1);
		}
	}

	return tokens;
};
