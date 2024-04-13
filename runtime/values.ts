export type ValueType = "null" | "number" | "string" | "boolean";

export type RuntimeVal = {
	type: ValueType;
};

export type NullVal = RuntimeVal & {
	type: "null";
	value: null;
};

export type BooleanVal = RuntimeVal & {
	type: "boolean";
	value: boolean;
};

export type NumberVal = RuntimeVal & {
	type: "number";
	value: number;
};

export type StringVal = RuntimeVal & {
	type: "string";
	value: string;
};

export const MK_NUMBER = (n = 0): NumberVal => {
	return { value: n, type: "number" };
};

export const MK_NULL = (): NullVal => {
	return { value: null, type: "null" };
};

export const MK_BOOL = (b = false): BooleanVal => {
	return { value: b, type: "boolean" };
};
