import {
	type Stmt,
	type Program,
	type Expr,
	type BinaryExpr,
	type Identifier,
	type NumericLiteral,
	type StringLiteral,
	type VarDeclaration,
	type AssignmentExpr,
	Property,
	ObjectLiteral,
} from "./ast.ts";
import { tokenize, type Token } from "./lexer.ts";

export default class Parser {
	private tokens: Token[] = [];

	private not_eof(): boolean {
		return this.tokens[0].type != "EOF";
	}

	private at(): Token {
		return this.tokens[0];
	}

	private eat(): Token | undefined {
		return this.tokens.shift();
	}

	private expect(type: Token["type"], err: string): Token {
		const prev = this.tokens.shift();
		if (!prev || prev.type !== type) {
			console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
			Deno.exit(1);
		}

		return prev;
	}

	public produceAST(sourceCode: string): Program {
		this.tokens = tokenize(sourceCode);
		const program: Program = {
			kind: "Program",
			body: [],
		};

		// Parse until end of file
		while (this.not_eof()) {
			program.body.push(this.parse_stmt());
		}

		return program;
	}

	private parse_stmt(): Stmt {
		// skip to parse_expr
		switch (this.at().type) {
			case "Let":
				return this.parse_var_declaration();
			case "Const":
				return this.parse_var_declaration();
			default:
				return this.parse_expr();
		}
	}

	private parse_var_declaration(): Stmt {
		const isConstant = this.eat()?.type === "Const";
		const identifier = this.expect(
			"Identifier",
			"Expected identifier name following let or const keywords."
		).value;

		if (this.eat()?.type === "Equals")
			return {
				kind: "VarDeclaration",
				value: this.parse_expr(),
				identifier,
				constant: isConstant,
			} as VarDeclaration;
		else if (isConstant)
			throw "Must assign value to constant expression. No value provided.";
		else
			return {
				kind: "VarDeclaration",
				identifier,
				constant: false,
			} as VarDeclaration;
	}

	private parse_expr(): Expr {
		return this.parse_assignment_expr();
	}

	private parse_assignment_expr(): Expr {
		const left = this.parse_object_expr();

		if (this.at().type === "Equals") {
			this.eat(); // advance past equals
			const value = this.parse_assignment_expr();
			return {
				kind: "AssignmentExpr",
				assignee: left,
				value,
			} as AssignmentExpr;
		}

		return left;
	}

	private parse_object_expr(): Expr {
		if (this.at().type !== "OpenBrace") return this.parse_additive_expr();

		this.eat(); // advance open brace
		const properties = new Array<Property>();

		while (this.not_eof() && this.at().type !== "CloseBrace") {
			const key = this.expect(
				"Identifier",
				"Object literal key expected"
			).value;

			// Allows shorthand key: pair -> { key, }
			if (this.at().type === "Comma") {
				this.eat(); // advance past comma
				properties.push({ key, kind: "Property" });
				continue;
			} // Allows shorthand key: pair -> { key }
			else if (this.at().type === "CloseBrace") {
				properties.push({ key, kind: "Property" });
				continue;
			}

			// { key: val }
			this.expect("Colon", "Missing colon following identifier in ObjectExpr");
			const value = this.parse_expr();
			properties.push({ kind: "Property", key, value });

			if (this.at().type !== "CloseBrace")
				this.expect(
					"Comma",
					"Expected comma or closing bracket following property."
				);
		}

		this.expect("CloseBrace", "Object literal missing closing brace.");

		return { kind: "ObjectLiteral", properties } as ObjectLiteral;
	}

	private parse_additive_expr(): Expr {
		let left = this.parse_multiplicative_expr();

		while (this.at().value === "+" || this.at().value === "-") {
			const operator = this.eat()?.value;
			const right = this.parse_multiplicative_expr();
			left = {
				kind: "BinaryExpr",
				left,
				right,
				operator: operator ?? "",
			} as BinaryExpr;
		}

		return left;
	}

	// TODO: Exponential expr above multiplicative

	private parse_multiplicative_expr(): Expr {
		let left = this.parse_primary_expr();

		while (
			this.at().value === "*" ||
			this.at().value === "/" ||
			this.at().value === "%"
			// TODO: Integer division //
		) {
			const operator = this.eat()?.value;
			const right = this.parse_primary_expr();
			left = {
				kind: "BinaryExpr",
				left,
				right,
				operator: operator ?? "",
			} as BinaryExpr;
		}

		return left;
	}

	private parse_primary_expr(): Expr {
		switch (this.at().type) {
			case "Identifier":
				return { kind: "Identifier", symbol: this.eat()?.value } as Identifier;
			case "Number":
				return {
					kind: "NumericLiteral",
					value: parseFloat(this.eat()?.value ?? "0"),
				} as NumericLiteral;
			case "String":
				return {
					kind: "StringLiteral",
					value: this.eat()?.value ?? "",
				} as StringLiteral;
			case "OpenParen": {
				this.eat(); // eat the opening paren
				const value = this.parse_expr();
				this.expect(
					"CloseParen",
					"Unexpected token found inside parenthesised expression. Expected closing parenthesis."
				); // eat the closing paren
				return value;
			}
			case "DoubleQuote": {
				this.eat(); // eat the double quote
				const value = this.parse_expr();
				this.expect(
					"DoubleQuote",
					"Unexpected token found inside string. Expected double quote."
				); // eat the double quote
				return value;
			}
			// Todo: Handle comments
			default:
				console.error("Unexpected token found during parsing!", this.at());
				Deno.exit(1);
		}
	}
}
