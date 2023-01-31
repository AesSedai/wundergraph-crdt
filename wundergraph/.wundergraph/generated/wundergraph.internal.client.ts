// Code generated by wunderctl. DO NOT EDIT.

import type { InternalClient as BaseClient, OperationArgsWithInput } from "@wundergraph/sdk/server";
import {
	CreateBookInput,
	CreateBookResponse,
	CreateCrdtInput,
	CreateCrdtResponse,
	DeleteBookInput,
	DeleteBookResponse,
	InternalQueryClientInput,
	InternalQueryCrdtInput,
	InternalQueryGetAuthorsInput,
	InternalQueryGetBooksInput,
	QueryClientResponse,
	QueryCrdtResponse,
	QueryGetAuthorsResponse,
	QueryGetBooksResponse,
	ResetAuthorsResponse,
	SeedAuthorsInput,
	SeedAuthorsResponse,
	UpdateAuthorNameInput,
	UpdateAuthorNameResponse,
	UpdateBookInput,
	UpdateBookResponse,
	UpdateCrdtInput,
	UpdateCrdtResponse,
	UpsertClientInput,
	UpsertClientResponse,
	UpsertCrdtInput,
	UpsertCrdtResponse,
} from "./models";

export interface Queries {
	QueryClient: (options: OperationArgsWithInput<InternalQueryClientInput>) => Promise<QueryClientResponse>;
	QueryCrdt: (options: OperationArgsWithInput<InternalQueryCrdtInput>) => Promise<QueryCrdtResponse>;
	QueryGetAuthors: (options: OperationArgsWithInput<InternalQueryGetAuthorsInput>) => Promise<QueryGetAuthorsResponse>;
	QueryGetBooks: (options: OperationArgsWithInput<InternalQueryGetBooksInput>) => Promise<QueryGetBooksResponse>;
}

export interface Mutations {
	CreateBook: (options: OperationArgsWithInput<CreateBookInput>) => Promise<CreateBookResponse>;
	CreateCrdt: (options: OperationArgsWithInput<CreateCrdtInput>) => Promise<CreateCrdtResponse>;
	DeleteBook: (options: OperationArgsWithInput<DeleteBookInput>) => Promise<DeleteBookResponse>;
	ResetAuthors: () => Promise<ResetAuthorsResponse>;
	SeedAuthors: (options: OperationArgsWithInput<SeedAuthorsInput>) => Promise<SeedAuthorsResponse>;
	UpdateAuthorName: (options: OperationArgsWithInput<UpdateAuthorNameInput>) => Promise<UpdateAuthorNameResponse>;
	UpdateBook: (options: OperationArgsWithInput<UpdateBookInput>) => Promise<UpdateBookResponse>;
	UpdateCrdt: (options: OperationArgsWithInput<UpdateCrdtInput>) => Promise<UpdateCrdtResponse>;
	UpsertClient: (options: OperationArgsWithInput<UpsertClientInput>) => Promise<UpsertClientResponse>;
	UpsertCrdt: (options: OperationArgsWithInput<UpsertCrdtInput>) => Promise<UpsertCrdtResponse>;
}

export interface InternalClient extends BaseClient<Queries, Mutations> {}
