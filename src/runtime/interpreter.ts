import type { RuntimeVal, NumberVal, NullVal } from "./values.ts";
import type { Stmt, NumericLiteral, BinaryExpr, Program } from "../ast.ts";

const eval_program = (program: Program): RuntimeVal => {
let lastEvaluated: RuntimeVal = {
		value: "null",
		type: "null",
	} as NullVal;

	program.body.forEach((stmt) => {
		lastEvaluated = evaluate(stmt);
	});

	return lastEvaluated;
};

function eval_numeric_binary_expr(left: NumberVal, right: NumberVal, operator: string): NumberVal {
	let result = 0;
	if (operator === "+") {
		result = left.value + right.value;
	} else if (operator === "-") {
		result = left.value - right.value;
	} else if (operator === "*") {
		result = left.value * right.value;
	} else if (operator === "/") {
		if (right.value === 0) {
			console.error("Division by zero");
			Deno.exit(1);
		}
		result = left.value / right.value;
	} else if (operator === "%") {
		result = left.value % right.value;
	} else {
		console.error("Invalid operator", operator);
		Deno.exit(1);
	}

	return {
		value: result,
		type: "number",
	};
}

const eval_binary_expr = (binop: BinaryExpr): RuntimeVal => {
	const leftHandSide = evaluate(binop.left);
	const rightHandSide = evaluate(binop.right);

	if (leftHandSide.type === "number" && rightHandSide.type === "number") {
		return eval_numeric_binary_expr(leftHandSide as NumberVal, rightHandSide as NumberVal, binop.operator);
	}

	// One or both of the operands are null.
	return {
		value: "null",
		type: "null",
	} as NullVal;
};

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
