import type { RuntimeVal } from "./values.ts";

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, RuntimeVal>;
	private constants: Set<string>;

	constructor(parentEnv?: Environment) {
		this.parent = parentEnv;
		this.variables = new Map<string, RuntimeVal>();
		this.constants = new Set<string>();
	}

	public declareVar(
		varName: string,
		value: RuntimeVal,
		constant: boolean
	): RuntimeVal {
		if (this.variables.has(varName))
			throw `Cannot declare variable ${varName}, as it is already defined.`;
		this.variables.set(varName, value);
		if (constant) this.constants.add(varName);
		return value;
	}

	public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
		// TODO: Check if type is the same
		const env = this.resolve(varName);
		if (env.constants.has(varName))
			throw `Cannot reassign variable ${varName}, as it was declared constant.`;
		env.variables.set(varName, value);
		return value;
	}

	public lookupVar(varName: string): RuntimeVal {
		const env = this.resolve(varName);
		const variable = env.variables.get(varName);
		if (!variable) throw `Variable doesn't exist.`;
		return variable;
	}

	public resolve(varName: string): Environment {
		if (this.variables.has(varName)) return this;

		if (!this.parent) throw `Cannot resolve ${varName}, as it doesn't exist.`;

		return this.parent.resolve(varName);
	}
}
