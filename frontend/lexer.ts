export type TokenType =
	| "Number"
	| "String"
	| "Identifier"
	| "Equals"
	| "Comma"
	| "Colon"
	| "OpenBrace" // {
	| "CloseBrace" // }
	| "OpenParen"
	| "CloseParen"
	| "BinaryOparator"
	| "DoubleQuote"
	| "Let"
	| "Const"
	| "EOF"; // End of File

const Reserved: Partial<Record<Lowercase<TokenType>, TokenType>> = {
	let: "Let",
	const: "Const",
};

export type Token = { value: string; type: TokenType };

const isAlpha = (str: string): boolean =>
	str.toUpperCase() !== str.toLowerCase();

const isInt = (str: string): boolean => {
	const c = str.charCodeAt(0);
	return c >= 48 && c <= 57;
};

const isSkippable = (str: string): boolean => {
	return [" ", "\t", "\n", "\r"].includes(str);
};

const isBinaryOperator = (str: string): boolean => {
	return ["+", "-", "*", "/", "%"].includes(str);
};

export const tokenize = (sourceCode: string): Token[] => {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	const at = (): string => src[0]; // Return current
	const eat = (): string | undefined => src.shift(); // Return current and advance

	const pushToken = (value: Token["value"] = "", type: Token["type"]): void => {
		if (!value) return;
		tokens.push({ value, type });
	};

	while (src.length > 0) {
		if (at() === '"') {
			pushToken(eat(), "DoubleQuote");
			let content = "";
			while (src.length > 0 && at() !== '"') content += eat();
			pushToken(content, "String");
		} else if (at() === "#") {
			while (src.length > 0 && at() !== "\n") eat();
		} else if (at() === "(") pushToken(eat(), "OpenParen");
		else if (at() === ")") pushToken(eat(), "CloseParen");
		else if (at() === "{") pushToken(eat(), "OpenBrace");
		else if (at() === "}") pushToken(eat(), "CloseBrace");
		else if (at() === ",") pushToken(eat(), "Comma");
		else if (at() === ":") pushToken(eat(), "Colon");
		else if (isBinaryOperator(at())) pushToken(eat(), "BinaryOparator");
		else if (at() === "=") pushToken(eat(), "Equals");
		else if (isInt(at())) {
			let num = "";
			while (src.length > 0 && isInt(at())) num += eat();
			pushToken(num, "Number");
		} else if (isAlpha(at())) {
			let ident = "";
			while (src.length > 0 && isAlpha(at())) ident += eat();
			const reserved = Reserved[ident as Lowercase<TokenType>];
			if (typeof reserved === "string") pushToken(ident, reserved);
			else pushToken(ident, "Identifier");
		} else if (isSkippable(at())) eat();
		else {
			console.error(`Unrecognized character found in source: ${at()}`);
			Deno.exit(1);
		}
	}

	pushToken("EndofFile", "EOF");

	return tokens;
};
