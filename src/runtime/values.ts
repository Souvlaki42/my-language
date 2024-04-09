export type ValueType = "null" | "number" | "string";

export type RuntimeVal = {
	type: ValueType;
};

export type NullVal = RuntimeVal & {
	type: "null";
	value: "null";
};

export type NumberVal = RuntimeVal & {
	type: "number";
	value: number;
};

export type StringVal = RuntimeVal & {
	type: "number";
	value: string;
};
