export type UnionToObject<T extends string> = { [K in T]: K };

export type ObjectToUnion<T extends Record<string, any>> = T[keyof T];
