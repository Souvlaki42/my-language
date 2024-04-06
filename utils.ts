export type UnionToObject<T extends string> = { [K in T]: K };

export type ObjectToUnion<T extends Record<string, any>> = T[keyof T];

export const countOccurencies = <T, K extends keyof T>(
	array: T[],
	key: K,
	value: T[K]
) => array.filter((item) => item[key] === value).length;
