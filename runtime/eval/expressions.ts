import type { BinaryExpr, Identifier } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { MK_NULL, type NumberVal, type RuntimeVal } from "../values.ts";

const eval_numeric_binary_expr = (
	left: NumberVal,
	right: NumberVal,
	operator: string
): NumberVal => {
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
};

export const eval_binary_expr = (
	binop: BinaryExpr,
	env: Environment
): RuntimeVal => {
	const leftHandSide = evaluate(binop.left, env);
	const rightHandSide = evaluate(binop.right, env);

	if (leftHandSide.type === "number" && rightHandSide.type === "number") {
		return eval_numeric_binary_expr(
			leftHandSide as NumberVal,
			rightHandSide as NumberVal,
			binop.operator
		);
	}

	// One or both of the operands are null.
	return MK_NULL();
};

export const eval_identifier = (
	identifier: Identifier,
	env: Environment
): RuntimeVal => {
	const val = env.lookupVar(identifier.symbol);
	return val;
};
