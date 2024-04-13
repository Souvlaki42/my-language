import type { RuntimeVal } from "./values.ts";

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, RuntimeVal>;

	constructor(parentEnv?: Environment) {
		this.parent = parentEnv;
		this.variables = new Map<string, RuntimeVal>();
	}

	public declareVar(varName: string, value: RuntimeVal): RuntimeVal {
		if (this.variables.has(varName))
			throw `Cannot declare variable ${varName}, as it is already defined.`;
		this.variables.set(varName, value);
		return value;
	}

	public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
		const env = this.resolve(varName);
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
