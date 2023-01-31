// Code generated by wunderctl. DO NOT EDIT.

export interface hasura_books_insert_input {
	author?: hasura_authors_obj_rel_insert_input;
	author_id?: string;
	created_at?: string;
	id?: string;
	isbn?: string;
	published_at?: string;
	title?: string;
	updated_at?: string;
}

export interface hasura_authors_obj_rel_insert_input {
	data?: hasura_authors_insert_input;
	on_conflict?: hasura_authors_on_conflict;
}

export interface hasura_authors_insert_input {
	books?: hasura_books_arr_rel_insert_input;
	created_at?: string;
	id?: string;
	name?: string;
	updated_at?: string;
}

export interface hasura_books_arr_rel_insert_input {
	data?: hasura_books_insert_input[];
	on_conflict?: hasura_books_on_conflict;
}

export interface hasura_books_on_conflict {
	constraint?: "books_pkey";
	update_columns?: ("author_id" | "created_at" | "id" | "isbn" | "published_at" | "title" | "updated_at")[];
	where?: hasura_books_bool_exp;
}

export interface hasura_books_bool_exp {
	_and?: hasura_books_bool_exp[];
	_not?: hasura_books_bool_exp;
	_or?: hasura_books_bool_exp[];
	author?: hasura_authors_bool_exp;
	author_id?: hasura_String_comparison_exp;
	created_at?: hasura_timestamptz_comparison_exp;
	id?: hasura_String_comparison_exp;
	isbn?: hasura_String_comparison_exp;
	published_at?: hasura_timestamptz_comparison_exp;
	title?: hasura_String_comparison_exp;
	updated_at?: hasura_timestamptz_comparison_exp;
}

export interface hasura_authors_bool_exp {
	_and?: hasura_authors_bool_exp[];
	_not?: hasura_authors_bool_exp;
	_or?: hasura_authors_bool_exp[];
	books?: hasura_books_bool_exp;
	books_aggregate?: hasura_books_aggregate_bool_exp;
	created_at?: hasura_timestamptz_comparison_exp;
	id?: hasura_String_comparison_exp;
	name?: hasura_String_comparison_exp;
	updated_at?: hasura_timestamptz_comparison_exp;
}

export interface hasura_books_aggregate_bool_exp {
	count?: hasura_books_aggregate_bool_exp_count;
}

export interface hasura_books_aggregate_bool_exp_count {
	arguments?: ("author_id" | "created_at" | "id" | "isbn" | "published_at" | "title" | "updated_at")[];
	distinct?: boolean;
	filter?: hasura_books_bool_exp;
	predicate?: hasura_Int_comparison_exp;
}

export interface hasura_Int_comparison_exp {
	_eq?: number;
	_gt?: number;
	_gte?: number;
	_in?: number[];
	_is_null?: boolean;
	_lt?: number;
	_lte?: number;
	_neq?: number;
	_nin?: number[];
}

export interface hasura_timestamptz_comparison_exp {
	_eq?: string;
	_gt?: string;
	_gte?: string;
	_in?: string[];
	_is_null?: boolean;
	_lt?: string;
	_lte?: string;
	_neq?: string;
	_nin?: string[];
}

export interface hasura_String_comparison_exp {
	_eq?: string;
	_gt?: string;
	_gte?: string;
	_ilike?: string;
	_in?: string[];
	_iregex?: string;
	_is_null?: boolean;
	_like?: string;
	_lt?: string;
	_lte?: string;
	_neq?: string;
	_nilike?: string;
	_nin?: string[];
	_niregex?: string;
	_nlike?: string;
	_nregex?: string;
	_nsimilar?: string;
	_regex?: string;
	_similar?: string;
}

export interface hasura_authors_on_conflict {
	constraint?: "authors_pkey";
	update_columns?: ("created_at" | "id" | "name" | "updated_at")[];
	where?: hasura_authors_bool_exp;
}

export interface hasura_crdt_insert_input {
	client?: string;
	clients?: hasura_clients_arr_rel_insert_input;
	created_at?: string;
	guid?: string;
	id?: string;
	room?: string;
	state?: string;
	updated_at?: string;
	vector?: string;
}

export interface hasura_clients_arr_rel_insert_input {
	data?: hasura_clients_insert_input[];
	on_conflict?: hasura_clients_on_conflict;
}

export interface hasura_clients_insert_input {
	client?: string;
	crdt?: hasura_crdt_obj_rel_insert_input;
	crdt_id?: string;
	created_at?: string;
	guid?: string;
	id?: string;
	updated_at?: string;
	vector?: string;
}

export interface hasura_crdt_obj_rel_insert_input {
	data?: hasura_crdt_insert_input;
	on_conflict?: hasura_crdt_on_conflict;
}

export interface hasura_crdt_on_conflict {
	constraint?: "crdt_client_unique" | "crdt_guid_unique" | "crdt_pkey";
	update_columns?: ("client" | "created_at" | "guid" | "id" | "room" | "state" | "updated_at" | "vector")[];
	where?: hasura_crdt_bool_exp;
}

export interface hasura_crdt_bool_exp {
	_and?: hasura_crdt_bool_exp[];
	_not?: hasura_crdt_bool_exp;
	_or?: hasura_crdt_bool_exp[];
	client?: hasura_String_comparison_exp;
	clients?: hasura_clients_bool_exp;
	clients_aggregate?: hasura_clients_aggregate_bool_exp;
	created_at?: hasura_timestamptz_comparison_exp;
	guid?: hasura_uuid_comparison_exp;
	id?: hasura_String_comparison_exp;
	room?: hasura_String_comparison_exp;
	state?: hasura_String_comparison_exp;
	updated_at?: hasura_timestamptz_comparison_exp;
	vector?: hasura_String_comparison_exp;
}

export interface hasura_clients_bool_exp {
	_and?: hasura_clients_bool_exp[];
	_not?: hasura_clients_bool_exp;
	_or?: hasura_clients_bool_exp[];
	client?: hasura_String_comparison_exp;
	crdt?: hasura_crdt_bool_exp;
	crdt_id?: hasura_String_comparison_exp;
	created_at?: hasura_timestamptz_comparison_exp;
	guid?: hasura_uuid_comparison_exp;
	id?: hasura_String_comparison_exp;
	updated_at?: hasura_timestamptz_comparison_exp;
	vector?: hasura_String_comparison_exp;
}

export interface hasura_uuid_comparison_exp {
	_eq?: string;
	_gt?: string;
	_gte?: string;
	_in?: string[];
	_is_null?: boolean;
	_lt?: string;
	_lte?: string;
	_neq?: string;
	_nin?: string[];
}

export interface hasura_clients_aggregate_bool_exp {
	count?: hasura_clients_aggregate_bool_exp_count;
}

export interface hasura_clients_aggregate_bool_exp_count {
	arguments?: ("client" | "crdt_id" | "created_at" | "guid" | "id" | "updated_at" | "vector")[];
	distinct?: boolean;
	filter?: hasura_clients_bool_exp;
	predicate?: hasura_Int_comparison_exp;
}

export interface hasura_clients_on_conflict {
	constraint?: "clients_client_unique" | "clients_pkey";
	update_columns?: ("client" | "crdt_id" | "created_at" | "guid" | "id" | "updated_at" | "vector")[];
	where?: hasura_clients_bool_exp;
}

export interface hasura_crdt_set_input {
	client?: string;
	created_at?: string;
	guid?: string;
	id?: string;
	room?: string;
	state?: string;
	updated_at?: string;
	vector?: string;
}

export type JSONValue = string | number | boolean | JSONObject | Array<JSONValue>;

export type JSONObject = { [key: string]: JSONValue };

export interface GraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
}

export interface CrdtAuthorsInput {
	limit: number;
	sv: string;
	clientId: string;
	guid: string;
}

export interface CreateBookInput {
	book: hasura_books_insert_input;
}

export interface CreateCrdtInput {
	crdt: hasura_crdt_insert_input;
}

export interface DeleteBookInput {
	id: string;
}

export interface QueryClientInput {
	client: string;
	room: string;
}

export interface QueryCrdtInput {
	room: string;
}

export interface QueryGetAuthorsInput {
	limit: number;
}

export interface QueryGetBooksInput {
	limit: number;
}

export interface SeedAuthorsInput {
	authors: hasura_authors_insert_input[];
}

export interface SubscribeAuthorsInput {
	limit: number;
}

export interface SubscribeBooksInput {
	limit: number;
}

export interface UpdateAuthorNameInput {
	id: string;
	name: string;
}

export interface UpdateBookInput {
	id: string;
	title: string;
}

export interface UpdateCrdtInput {
	client: string;
	state: string;
	vector: string;
}

export interface UpsertClientInput {
	client: hasura_clients_insert_input;
}

export interface UpsertCrdtInput {
	client: string;
	crdt: hasura_crdt_set_input;
}

export interface InternalCrdtAuthorsInput {
	limit: number;
	sv: string;
	clientId: string;
	guid: string;
}

export interface InternalCreateBookInput {
	book: hasura_books_insert_input;
}

export interface InternalCreateCrdtInput {
	crdt: hasura_crdt_insert_input;
}

export interface InternalDeleteBookInput {
	id: string;
}

export interface InternalQueryClientInput {
	client: string;
	room: string;
}

export interface InternalQueryCrdtInput {
	room: string;
}

export interface InternalQueryGetAuthorsInput {
	limit: number;
}

export interface InternalQueryGetBooksInput {
	limit: number;
}

export interface InternalSeedAuthorsInput {
	authors: hasura_authors_insert_input[];
}

export interface InternalSubscribeAuthorsInput {
	limit: number;
}

export interface InternalSubscribeBooksInput {
	limit: number;
}

export interface InternalUpdateAuthorNameInput {
	id: string;
	name: string;
}

export interface InternalUpdateBookInput {
	id: string;
	title: string;
}

export interface InternalUpdateCrdtInput {
	client: string;
	state: string;
	vector: string;
}

export interface InternalUpsertClientInput {
	client: hasura_clients_insert_input;
}

export interface InternalUpsertCrdtInput {
	client: string;
	crdt: hasura_crdt_set_input;
}

export interface InjectedCrdtAuthorsInput {
	limit: number;
	sv: string;
	clientId: string;
	guid: string;
}

export interface InjectedCreateBookInput {
	book: hasura_books_insert_input;
}

export interface InjectedCreateCrdtInput {
	crdt: hasura_crdt_insert_input;
}

export interface InjectedDeleteBookInput {
	id: string;
}

export interface InjectedQueryClientInput {
	client: string;
	room: string;
}

export interface InjectedQueryCrdtInput {
	room: string;
}

export interface InjectedQueryGetAuthorsInput {
	limit: number;
}

export interface InjectedQueryGetBooksInput {
	limit: number;
}

export interface InjectedSeedAuthorsInput {
	authors: hasura_authors_insert_input[];
}

export interface InjectedSubscribeAuthorsInput {
	limit: number;
}

export interface InjectedSubscribeBooksInput {
	limit: number;
}

export interface InjectedUpdateAuthorNameInput {
	id: string;
	name: string;
}

export interface InjectedUpdateBookInput {
	id: string;
	title: string;
}

export interface InjectedUpdateCrdtInput {
	client: string;
	state: string;
	vector: string;
}

export interface InjectedUpsertClientInput {
	client: hasura_clients_insert_input;
}

export interface InjectedUpsertCrdtInput {
	client: string;
	crdt: hasura_crdt_set_input;
}

export interface CrdtAuthorsResponse {
	data?: CrdtAuthorsResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface CreateBookResponse {
	data?: CreateBookResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface CreateCrdtResponse {
	data?: CreateCrdtResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface DeleteBookResponse {
	data?: DeleteBookResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface QueryClientResponse {
	data?: QueryClientResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface QueryCrdtResponse {
	data?: QueryCrdtResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface QueryGetAuthorsResponse {
	data?: QueryGetAuthorsResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface QueryGetBooksResponse {
	data?: QueryGetBooksResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface ResetAuthorsResponse {
	data?: ResetAuthorsResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface SeedAuthorsResponse {
	data?: SeedAuthorsResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface SubscribeAuthorsResponse {
	data?: SubscribeAuthorsResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface SubscribeBooksResponse {
	data?: SubscribeBooksResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface UpdateAuthorNameResponse {
	data?: UpdateAuthorNameResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface UpdateBookResponse {
	data?: UpdateBookResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface UpdateCrdtResponse {
	data?: UpdateCrdtResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface UpsertClientResponse {
	data?: UpsertClientResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface UpsertCrdtResponse {
	data?: UpsertCrdtResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface CrdtAuthorsResponseData {
	hasura_authors: {
		__typename: "hasura_authors";
		id: string;
		name: string;
		updated_at: string;
		books: {
			__typename: "hasura_books";
			id: string;
			title: string;
			isbn: string;
			updated_at: string;
		}[];
	}[];
}

export interface CreateBookResponseData {
	hasura_insert_books_one?: {
		id: string;
	};
}

export interface CreateCrdtResponseData {
	hasura_insert_crdt_one?: {
		__typename: "hasura_crdt";
		id: string;
		guid: string;
		client: string;
		state: string;
		vector: string;
	};
}

export interface DeleteBookResponseData {
	hasura_delete_books_by_pk?: {
		id: string;
	};
}

export interface QueryClientResponseData {
	hasura_clients: {
		id: string;
		vector: string;
	}[];
}

export interface QueryCrdtResponseData {
	hasura_crdt: {
		id: string;
		__typename: "hasura_crdt";
		client: string;
		guid: string;
		state: string;
		vector: string;
	}[];
}

export interface QueryGetAuthorsResponseData {
	hasura_authors: {
		__typename: "hasura_authors";
		id: string;
		name: string;
		updated_at: string;
		books: {
			__typename: "hasura_books";
			id: string;
			title: string;
			isbn: string;
			updated_at: string;
		}[];
	}[];
}

export interface QueryGetBooksResponseData {
	hasura_books: {
		__typename: "hasura_books";
		id: string;
		title: string;
		isbn: string;
		updated_at: string;
		author?: {
			__typename: "hasura_authors";
			id: string;
			name: string;
			updated_at: string;
		};
	}[];
}

export interface ResetAuthorsResponseData {
	hasura_delete_authors?: {
		affected_rows: number;
	};
}

export interface SeedAuthorsResponseData {
	hasura_insert_authors?: {
		affected_rows: number;
	};
}

export interface SubscribeAuthorsResponseData {
	hasura_authors: {
		__typename: "hasura_authors";
		id: string;
		name: string;
		updated_at: string;
		books: {
			__typename: "hasura_books";
			id: string;
			title: string;
			isbn: string;
			updated_at: string;
		}[];
	}[];
}

export interface SubscribeBooksResponseData {
	hasura_books: {
		__typename: "hasura_books";
		id: string;
		title: string;
		isbn: string;
		updated_at: string;
		author?: {
			__typename: "hasura_authors";
			id: string;
			name: string;
			updated_at: string;
		};
	}[];
}

export interface UpdateAuthorNameResponseData {
	hasura_update_authors_by_pk?: {
		id: string;
	};
}

export interface UpdateBookResponseData {
	hasura_update_books_by_pk?: {
		id: string;
	};
}

export interface UpdateCrdtResponseData {
	hasura_update_crdt?: {
		returning: {
			id: string;
		}[];
	};
}

export interface UpsertClientResponseData {
	hasura_insert_clients_one?: {
		__typename: "hasura_clients";
		id: string;
		guid: string;
		client: string;
	};
}

export interface UpsertCrdtResponseData {
	hasura_update_crdt?: {
		returning: {
			id: string;
		}[];
	};
}
