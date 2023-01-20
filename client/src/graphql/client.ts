import {
	Client,
	ClientConfig,
	CreateClientConfig,
	FetchUserRequestOptions,
	OperationMetadata,
	OperationRequestOptions,
	OperationsDefinition,
	SubscriptionEventHandler,
	SubscriptionRequestOptions,
	UploadRequestOptions,
	User,
} from "@wundergraph/sdk/client";
import type {
	CrdtAuthorsInput,
	CrdtAuthorsResponseData,
	CreateBookInput,
	CreateBookResponseData,
	CreateCrdtInput,
	CreateCrdtResponseData,
	DeleteBookInput,
	DeleteBookResponseData,
	QueryCrdtInput,
	QueryCrdtResponseData,
	QueryGetAuthorsInput,
	QueryGetAuthorsResponseData,
	QueryGetBooksInput,
	QueryGetBooksResponseData,
	ResetAuthorsResponseData,
	SeedAuthorsInput,
	SeedAuthorsResponseData,
	SubscribeAuthorsInput,
	SubscribeAuthorsResponseData,
	SubscribeBooksInput,
	SubscribeBooksResponseData,
	UpdateAuthorNameInput,
	UpdateAuthorNameResponseData,
	UpdateBookInput,
	UpdateBookResponseData,
	UpdateCrdtInput,
	UpdateCrdtResponseData,
	UpsertCrdtInput,
	UpsertCrdtResponseData,
} from "./models";

export type UserRole = "admin" | "user";

export const WUNDERGRAPH_S3_ENABLED = false;
export const WUNDERGRAPH_AUTH_ENABLED = false;

export type UploadConfig = UploadRequestOptions<never>;

export const defaultClientConfig: ClientConfig = {
	applicationHash: "269980b1",
	baseURL: "http://localhost:9991",
	sdkVersion: "0.131.1",
};

export const operationMetadata: OperationMetadata = {
	CrdtAuthors: {
		requiresAuthentication: false,
	},
	CreateBook: {
		requiresAuthentication: false,
	},
	CreateCrdt: {
		requiresAuthentication: false,
	},
	DeleteBook: {
		requiresAuthentication: false,
	},
	QueryCrdt: {
		requiresAuthentication: false,
	},
	QueryGetAuthors: {
		requiresAuthentication: false,
	},
	QueryGetBooks: {
		requiresAuthentication: false,
	},
	ResetAuthors: {
		requiresAuthentication: false,
	},
	SeedAuthors: {
		requiresAuthentication: false,
	},
	SubscribeAuthors: {
		requiresAuthentication: false,
	},
	SubscribeBooks: {
		requiresAuthentication: false,
	},
	UpdateAuthorName: {
		requiresAuthentication: false,
	},
	UpdateBook: {
		requiresAuthentication: false,
	},
	UpdateCrdt: {
		requiresAuthentication: false,
	},
	UpsertCrdt: {
		requiresAuthentication: false,
	},
};

export class WunderGraphClient extends Client {
	query<
		OperationName extends Extract<keyof Operations["queries"], string>,
		Input extends Operations["queries"][OperationName]["input"] = Operations["queries"][OperationName]["input"],
		Data extends Operations["queries"][OperationName]["data"] = Operations["queries"][OperationName]["data"]
	>(options: OperationName extends string ? OperationRequestOptions<OperationName, Input> : OperationRequestOptions) {
		return super.query<OperationRequestOptions, Data>(options);
	}
	mutate<
		OperationName extends Extract<keyof Operations["mutations"], string>,
		Input extends Operations["mutations"][OperationName]["input"] = Operations["mutations"][OperationName]["input"],
		Data extends Operations["mutations"][OperationName]["data"] = Operations["mutations"][OperationName]["data"]
	>(options: OperationName extends string ? OperationRequestOptions<OperationName, Input> : OperationRequestOptions) {
		return super.mutate<OperationRequestOptions, Data>(options);
	}
	subscribe<
		OperationName extends Extract<keyof Operations["subscriptions"], string>,
		Input extends Operations["subscriptions"][OperationName]["input"] = Operations["subscriptions"][OperationName]["input"],
		Data extends Operations["subscriptions"][OperationName]["data"] = Operations["subscriptions"][OperationName]["data"]
	>(
		options: OperationName extends string
			? SubscriptionRequestOptions<OperationName, Input>
			: SubscriptionRequestOptions,
		cb: SubscriptionEventHandler<Data>
	) {
		return super.subscribe(options, cb);
	}
	public async uploadFiles(config: UploadConfig) {
		return super.uploadFiles(config);
	}
	public login(authProviderID: Operations["authProvider"], redirectURI?: string) {
		return super.login(authProviderID, redirectURI);
	}
	public async fetchUser<TUser extends User = User<UserRole>>(options?: FetchUserRequestOptions) {
		return super.fetchUser<TUser>(options);
	}
}

export const createClient = (config?: CreateClientConfig) => {
	return new WunderGraphClient({
		...defaultClientConfig,
		...config,
		operationMetadata,
		// csrfEnabled: false,
	});
};

export type Queries = {
	QueryCrdt: {
		input: QueryCrdtInput;
		data: QueryCrdtResponseData;
		requiresAuthentication: false;
		liveQuery: boolean;
	};
	QueryGetAuthors: {
		input: QueryGetAuthorsInput;
		data: QueryGetAuthorsResponseData;
		requiresAuthentication: false;
		liveQuery: boolean;
	};
	QueryGetBooks: {
		input: QueryGetBooksInput;
		data: QueryGetBooksResponseData;
		requiresAuthentication: false;
		liveQuery: boolean;
	};
};

export type Mutations = {
	CreateBook: {
		input: CreateBookInput;
		data: CreateBookResponseData;
		requiresAuthentication: false;
	};
	CreateCrdt: {
		input: CreateCrdtInput;
		data: CreateCrdtResponseData;
		requiresAuthentication: false;
	};
	DeleteBook: {
		input: DeleteBookInput;
		data: DeleteBookResponseData;
		requiresAuthentication: false;
	};
	ResetAuthors: {
		input?: undefined;
		data: ResetAuthorsResponseData;
		requiresAuthentication: false;
	};
	SeedAuthors: {
		input: SeedAuthorsInput;
		data: SeedAuthorsResponseData;
		requiresAuthentication: false;
	};
	UpdateAuthorName: {
		input: UpdateAuthorNameInput;
		data: UpdateAuthorNameResponseData;
		requiresAuthentication: false;
	};
	UpdateBook: {
		input: UpdateBookInput;
		data: UpdateBookResponseData;
		requiresAuthentication: false;
	};
	UpdateCrdt: {
		input: UpdateCrdtInput;
		data: UpdateCrdtResponseData;
		requiresAuthentication: false;
	};
	UpsertCrdt: {
		input: UpsertCrdtInput;
		data: UpsertCrdtResponseData;
		requiresAuthentication: false;
	};
};

export type Subscriptions = {
	CrdtAuthors: {
		input: CrdtAuthorsInput;
		data: CrdtAuthorsResponseData;
		requiresAuthentication: false;
	};
	SubscribeAuthors: {
		input: SubscribeAuthorsInput;
		data: SubscribeAuthorsResponseData;
		requiresAuthentication: false;
	};
	SubscribeBooks: {
		input: SubscribeBooksInput;
		data: SubscribeBooksResponseData;
		requiresAuthentication: false;
	};
};

export type LiveQueries = {
	QueryCrdt: {
		input: QueryCrdtInput;
		data: QueryCrdtResponseData;
		liveQuery: true;
		requiresAuthentication: false;
	};
	QueryGetAuthors: {
		input: QueryGetAuthorsInput;
		data: QueryGetAuthorsResponseData;
		liveQuery: true;
		requiresAuthentication: false;
	};
	QueryGetBooks: {
		input: QueryGetBooksInput;
		data: QueryGetBooksResponseData;
		liveQuery: true;
		requiresAuthentication: false;
	};
};

export interface Operations extends OperationsDefinition<Queries, Mutations, Subscriptions, UserRole> {}
