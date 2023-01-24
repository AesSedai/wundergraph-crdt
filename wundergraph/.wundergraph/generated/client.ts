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

export const defaultClientConfig: ClientConfig = {
	applicationHash: "e631cdc3",
	baseURL: "http://localhost:9991",
	sdkVersion: "0.132.1",
};

export const operationMetadata: OperationMetadata = {
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
		requiresAuthentication: false,
	},
	"": {
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
		csrfEnabled: false,
	});
};

export type Queries = {
	"": {
		input: QueryCrdtInput;
		data: QueryCrdtResponseData;
		requiresAuthentication: false;
		liveQuery: boolean;
	};
	"": {
		input: QueryGetAuthorsInput;
		data: QueryGetAuthorsResponseData;
		requiresAuthentication: false;
		liveQuery: boolean;
	};
	"": {
		input: QueryGetBooksInput;
		data: QueryGetBooksResponseData;
		requiresAuthentication: false;
		liveQuery: boolean;
	};
};

export type Mutations = {
	"": {
		input: CreateBookInput;
		data: CreateBookResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: CreateCrdtInput;
		data: CreateCrdtResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: DeleteBookInput;
		data: DeleteBookResponseData;
		requiresAuthentication: false;
	};
	"": {
		input?: undefined;
		data: ResetAuthorsResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: SeedAuthorsInput;
		data: SeedAuthorsResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: UpdateAuthorNameInput;
		data: UpdateAuthorNameResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: UpdateBookInput;
		data: UpdateBookResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: UpdateCrdtInput;
		data: UpdateCrdtResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: UpsertCrdtInput;
		data: UpsertCrdtResponseData;
		requiresAuthentication: false;
	};
};

export type Subscriptions = {
	"": {
		input: CrdtAuthorsInput;
		data: CrdtAuthorsResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: SubscribeAuthorsInput;
		data: SubscribeAuthorsResponseData;
		requiresAuthentication: false;
	};
	"": {
		input: SubscribeBooksInput;
		data: SubscribeBooksResponseData;
		requiresAuthentication: false;
	};
};

export type LiveQueries = {
	"": {
		input: QueryCrdtInput;
		data: QueryCrdtResponseData;
		liveQuery: true;
		requiresAuthentication: false;
	};
	"": {
		input: QueryGetAuthorsInput;
		data: QueryGetAuthorsResponseData;
		liveQuery: true;
		requiresAuthentication: false;
	};
	"": {
		input: QueryGetBooksInput;
		data: QueryGetBooksResponseData;
		liveQuery: true;
		requiresAuthentication: false;
	};
};

export interface Operations extends OperationsDefinition<Queries, Mutations, Subscriptions, UserRole, {}> {}
