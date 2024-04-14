export type NodeType =
	| "Program"
	| "VarDeclaration"
	| "NumericLiteral"
	| "StringLiteral"
	| "Identifier"
	| "BinaryExpr"
	| "AssignmentExpr"
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

export type VarDeclaration = Stmt & {
	kind: "VarDeclaration";
	constant: boolean;
	identifier: string;
	value?: Expr;
};

export type Expr = Stmt;

export type BinaryExpr = Expr & {
	kind: "BinaryExpr";
	left: Expr;
	right: Expr;
	operator: string;
};

export type AssignmentExpr = Expr & {
	kind: "AssignmentExpr";
	assignee: Expr;
	value: Expr;
};

export type Identifier = Expr & {
	kind: "Identifier";
	symbol: string;
};

export type StringLiteral = Expr & {
	kind: "StringLiteral";
	value: string;
};

export type NumericLiteral = Expr & {
	kind: "NumericLiteral";
	value: number;
};
