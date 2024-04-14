import { type RuntimeVal, type NumberVal, type StringVal } from "./values.ts";
import type {
	Stmt,
	NumericLiteral,
	BinaryExpr,
	Program,
	Identifier,
	StringLiteral,
	VarDeclaration,
	AssignmentExpr,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_program, eval_var_declaration } from "./eval/statements.ts";
import {
	eval_binary_expr,
	eval_assignment_expr,
	eval_identifier,
} from "./eval/expressions.ts";

export const evaluate = (astNode: Stmt, env: Environment): RuntimeVal => {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberVal;
		case "StringLiteral":
			return {
				value: (astNode as StringLiteral).value,
				type: "string",
			} as StringVal;
		case "Identifier":
			return eval_identifier(astNode as Identifier, env);
		case "BinaryExpr":
			return eval_binary_expr(astNode as BinaryExpr, env);
		case "AssignmentExpr":
			return eval_assignment_expr(astNode as AssignmentExpr, env);
		case "Program":
			return eval_program(astNode as Program, env);
		case "VarDeclaration":
			return eval_var_declaration(astNode as VarDeclaration, env);
		default:
			console.error(
				"This AST Node has not yet been setup for interpetation.",
				astNode
			);
			Deno.exit();
	}
};
