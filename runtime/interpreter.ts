import {
	type RuntimeVal,
	type NumberVal,
	type StringVal,
	MK_NULL,
} from "./values.ts";
import type {
	Stmt,
	NumericLiteral,
	BinaryExpr,
	Program,
	Identifier,
	StringLiteral,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";

const eval_program = (program: Program, env: Environment): RuntimeVal => {
	let lastEvaluated: RuntimeVal = MK_NULL();

	program.body.forEach((stmt) => {
		lastEvaluated = evaluate(stmt, env);
	});

	return lastEvaluated;
};

function eval_numeric_binary_expr(
	left: NumberVal,
	right: NumberVal,
	operator: string
): NumberVal {
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

const eval_binary_expr = (binop: BinaryExpr, env: Environment): RuntimeVal => {
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

const eval_identifier = (
	identifier: Identifier,
	env: Environment
): RuntimeVal => {
	const val = env.lookupVar(identifier.symbol);
	return val;
};

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
		case "Program":
			return eval_program(astNode as Program, env);
		default:
			console.error(
				"This AST Node has not yet been setup for interpetation.",
				astNode
			);
			Deno.exit();
	}
};
