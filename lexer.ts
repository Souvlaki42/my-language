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
	// Maybe add single quotes later.
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

	const char = (): string => src[0];

	const next = (): string | undefined => src.shift();

	const pushToken = (value: Token["value"] = "", type: Token["type"]): void => {
		if (!!value) tokens.push(token(value, type));
	};

	while (src.length > 0) {
		if (char() === '"') {
			pushToken(next(), "DoubleQuote");
			let content = "";
			while (src.length > 0 && char() !== '"') content += next();
			pushToken(content, "String");
		} else if (char() === "#") {
			next();
			let content = "";
			while (src.length > 0 && char() !== "\n") content += next();
			pushToken(content, "Comment");
		} else if (char() === "(") pushToken(next(), "OpenParen");
		else if (char() === ")") pushToken(next(), "CloseParen");
		else if (isBinaryOperator(char())) pushToken(next(), "BinaryOparator");
		else if (char() === "=") pushToken(next(), "Equals");
		else if (isInt(char())) {
			let num = "";
			while (src.length > 0 && isInt(char())) num += next();
			pushToken(num, "Number");
		} else if (isAlpha(char())) {
			let ident = "";
			while (src.length > 0 && isAlpha(char())) ident += next();
			const reserved = Keywords[ident as Lowercase<keyof typeof TokenType>];
			if (reserved) pushToken(ident, reserved);
			else pushToken(ident, "Identifier");
		} else if (isSkippable(char())) next();
		else {
			console.error(`Unrecognized character found in source: ${char()}`);
			process.exit(1);
		}
	}

	return tokens;
};
