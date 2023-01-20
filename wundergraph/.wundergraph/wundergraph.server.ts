import { configureWunderGraphServer } from "@wundergraph/sdk/server"
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import { fromUint8Array, toUint8Array } from "js-base64"
import * as Y from "yjs"
import { CrdtAuthorsResponse } from "./generated/models"
import type { HooksConfig } from "./generated/wundergraph.hooks"
import type { InternalClient } from "./generated/wundergraph.internal.client"
import type { GraphQLExecutionContext } from "./generated/wundergraph.server"
import { syncronize } from "./lib/y-pojo"

let initialSync = true

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
    hooks: {
        queries: {},
        mutations: {
            ResetAuthors: {
                postResolve: async () => {
                    // set initialSync back to true
                    initialSync = true
                }
            }
        },
        subscriptions: {
            CrdtAuthors: {
                mutatingPreResolve: async ({ input, user, log, internalClient, clientRequest }) => {
                    console.log(`preResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`)
                    input.limit = 150
                    initialSync = true
                    return input
                },
                mutatingPostResolve: async ({ input, user, clientRequest, log, response, internalClient }) => {
                    console.log(
                        `mutatingPostResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`
                    )
                    if (response.data == null) {
                        throw new Error("response data cannot be null")
                    }

                    const ydoc1 = new Y.Doc()
                    const yDataMap = ydoc1.getMap("data")

                    const { data: loaded } = await internalClient.queries.QueryCrdt({ input: { client: "first" } })

                    let hasuraCrdt = loaded?.hasura_crdt?.[0]?.state
                    if (hasuraCrdt != null) {
                        // const buf = bytea(hasuraCrdt)
                        // hasuraCrdt = hasuraCrdt.slice(2)
                        // console.log("hasuraCrdt", hasuraCrdt)
                        Y.applyUpdate(ydoc1, toUint8Array(hasuraCrdt))
                        // console.log("applied update")
                    }

                    let diff: Uint8Array
                    let stateVector: Uint8Array

                    if (initialSync) {
                        initialSync = false
                        stateVector = toUint8Array(input.sv)
                    } else {
                        stateVector = Y.encodeStateVector(ydoc1)
                    }

                    syncronize(yDataMap, response.data)
                    diff = Y.encodeStateAsUpdate(ydoc1, stateVector)

                    await internalClient.mutations.UpsertCrdt({
                        input: {
                            crdt: {
                                client: "first",
                                state: fromUint8Array(Y.encodeStateAsUpdate(ydoc1)),
                                vector: fromUint8Array(Y.encodeStateVector(ydoc1))
                            }
                        }
                    })

                    // Y.logUpdate(diff)

                    console.log("diff", diff.length, fromUint8Array(diff).length, diff)
                    // console.log("encoded state", fromUint8Array(Y.encodeStateAsUpdate(ydoc1)))

                    // mangle the return into {data: string} so we can handle it on the client
                    return { data: fromUint8Array(diff) } as unknown as CrdtAuthorsResponse
                }
            }
        }
    },
    graphqlServers: [
        {
            apiNamespace: "public",
            serverName: "public",
            enableGraphQLEndpoint: true,
            schema: new GraphQLSchema({
                query: new GraphQLObjectType<any, GraphQLExecutionContext>({
                    name: "Query",
                    fields: {
                        hello: {
                            type: GraphQLString,
                            resolve: (args: any, ctx: GraphQLExecutionContext) => {
                                return `Hello ${ctx.wundergraph.user?.name || "World"}`
                            }
                        }
                    }
                }),
                subscription: new GraphQLObjectType<any, GraphQLExecutionContext>({
                    name: "Subscription",
                    fields: {
                        hello: {
                            type: GraphQLString,
                            resolve: (args: any, ctx: GraphQLExecutionContext) => {
                                return `Hello ${ctx.wundergraph.user?.name || "World"}`
                            }
                        }
                    }
                })
            })
        }
    ]
}))
