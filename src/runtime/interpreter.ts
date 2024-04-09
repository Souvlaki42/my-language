import type { RuntimeVal, NumberVal, NullVal } from "./values.ts";
import type { Stmt, NumericLiteral, BinaryExpr, Program } from "../ast.ts";

const eval_program = (program: Program): RuntimeVal => {};

const eval_binary_expr = (binop: BinaryExpr): RuntimeVal => {};

export const evaluate = (astNode: Stmt): RuntimeVal => {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberVal;
		case "NullLiteral":
			return {
				value: "null",
				type: "null",
			} as NullVal;
		case "BinaryExpr":
			return eval_binary_expr(astNode as BinaryExpr);
		case "Program":
			return eval_program(astNode as Program);
		default:
			console.error(
				"This AST Node has not yet been setup for interpetation.",
				astNode
			);
			Deno.exit();
	}
};
