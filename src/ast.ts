type NodeType =
	| "Program"
	| "NumericLiteral"
	| "StringLiteral"
	| "Identifier"
	| "BinaryExpr"
	| "CallExpr"
	| "UnaryExpr"
	| "FunctionDecleration";

export type Stmt = {
	kind: NodeType;
};

export type Program = Stmt & {
	kind: "Program";
	body: Stmt[];
};

export type Expr = Stmt;

export type BinaryExpr = Expr & {
	kind: "BinaryExpr";
	left: Expr;
	right: Expr;
	operator: string;
};

export type Identifier = Expr & {
	kind: "Identifier";
	symbol: string;
};

export type NumericLiteral = Expr & {
	kind: "NumericLiteral";
	value: number;
};
