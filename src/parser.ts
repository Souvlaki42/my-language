import type {
	Stmt,
	Program,
	Expr,
	BinaryExpr,
	Identifier,
	NumericLiteral,
	NullLiteral,
	StringLiteral,
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
		return this.parse_expr();
	}

	private parse_expr(): Expr {
		return this.parse_additive_expr();
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
			this.at().value === "%" // ||
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
			case "Null":
				this.eat(); // advance past null keyword
				return { kind: "NullLiteral", value: "null" } as NullLiteral;
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
			default:
				console.error("Unexpected token found during parsing!", this.at());
				Deno.exit(1);
		}
	}
}
