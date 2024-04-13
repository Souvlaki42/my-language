import { VarDeclaration, type Program } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { MK_NULL, RuntimeVal } from "../values.ts";

export const eval_program = (
	program: Program,
	env: Environment
): RuntimeVal => {
	let lastEvaluated: RuntimeVal = MK_NULL();

	program.body.forEach((stmt) => {
		lastEvaluated = evaluate(stmt, env);
	});

	return lastEvaluated;
};

export const eval_var_declaration = (
	declaration: VarDeclaration,
	env: Environment
): RuntimeVal => {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: MK_NULL();
	return env.declareVar(declaration.identifier, value, declaration.constant);
};
