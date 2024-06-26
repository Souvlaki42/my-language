import type {
	AssignmentExpr,
	BinaryExpr,
	Identifier,
	ObjectLiteral,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import {
	MK_NULL,
	ObjectVal,
	type NumberVal,
	type RuntimeVal,
} from "../values.ts";

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

export const eval_assignment_expr = (
	node: AssignmentExpr,
	env: Environment
): RuntimeVal => {
	if (node.assignee.kind !== "Identifier")
		throw `Invalid assignee inside assignment expr: ${JSON.stringify(
			node.assignee
		)}`;

	const varName = (node.assignee as Identifier).symbol;
	return env.assignVar(varName, evaluate(node.value, env));
};

export const eval_object_expr = (
	obj: ObjectLiteral,
	env: Environment
): RuntimeVal => {
	const object = { type: "object", properties: new Map() } as ObjectVal;

	for (const { key, value } of obj.properties) {
		const runtimeVal = !value ? env.lookupVar(key) : evaluate(value, env);
		object.properties.set(key, runtimeVal);
	}

	return object;
};
