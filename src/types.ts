import { updatedAtKey, updatedAtSymbol } from "./symbols";


export type Schema = Record<string, Record<string, boolean | null | number | string>>;

export type ConfigItemID<S extends Schema> = NonNullable<Exclude<Extract<keyof S, string>, "addListener" | "on" | "removeListener" | "off" | "update">>;

export type Listener<CI extends Config<Schema>[ConfigItemID<Schema>]> = (this: CI, updatedFields: Partial<CI>, prevFields: Partial<CI>) => void | Promise<void>;

export type Updates<CI extends Config<Schema>[ConfigItemID<Schema>]> = Partial<Omit<CI, typeof updatedAtKey> & { [updatedAtSymbol]: number }>

type AddListener<S extends Schema> = {
	<ID extends ConfigItemID<S>>(_id: ID, listener: Listener<Config<S>[ID]>, immediately?: boolean): void;
}

type RemoveListener<S extends Schema> = {
	<ID extends ConfigItemID<S>>(_id: ID, listener: Listener<Config<S>[ID]>): void;
}

export type Config<S extends Schema> = {
	[ID in ConfigItemID<S>]: Readonly<{
		[updatedAtKey]: number;
	} & S[ID]>
} & {
	
	addListener: AddListener<S>
	on: AddListener<S>
	
	removeListener: RemoveListener<S>
	off: RemoveListener<S>
	
	update<ID extends ConfigItemID<S>>(_id: ID, updates: Updates<Config<S>[ID]>): Promise<Config<S>[ID]>;
	
};
