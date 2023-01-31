import { configureWunderGraphServer } from "@wundergraph/sdk/server"
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import { fromUint8Array, toUint8Array } from "js-base64"
import * as Y from "yjs"
// import { CrdtAuthorsResponse } from "./generated/models"
import type { HooksConfig } from "./generated/wundergraph.hooks"
import type { InternalClient } from "./generated/wundergraph.internal.client"
import type { GraphQLExecutionContext } from "./generated/wundergraph.server"
import { syncronize } from "./lib/y-pojo/y-pojo"
const { diff: pDiff } = require("./lib/pigeon")

const docMap = new Map<string, Y.Doc>()
const roomName = "authors"

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
    hooks: {
        queries: {},
        mutations: {
            ResetAuthors: {
                postResolve: async () => {
                    // set initialSync back to true
                    // initialSync = true
                }
            }
        },
        subscriptions: {
            CrdtAuthors: {
                mutatingPreResolve: async ({ input, user, log, internalClient, clientRequest }) => {
                    console.log(`preResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`)

                    let { data } = await internalClient.queries.QueryCrdt({ input: { room: roomName } })
                    let response = data?.hasura_crdt?.[0]

                    // populate docMap if required
                    if (!docMap.has(roomName)) {
                        let ydoc1: Y.Doc

                        if (response == null) {
                            // initialize new document
                            ydoc1 = new Y.Doc()
                            const ymap1 = ydoc1.getMap("data")
                            const { data } = await internalClient.mutations.CreateCrdt({
                                input: {
                                    crdt: {
                                        room: roomName,
                                        client: ydoc1.clientID.toString(),
                                        guid: ydoc1.guid,
                                        state: fromUint8Array(Y.encodeStateAsUpdate(ydoc1)),
                                        vector: fromUint8Array(Y.encodeStateVector(ydoc1))
                                    }
                                }
                            })
                            const result = data?.hasura_insert_crdt_one
                            if (result != null) {
                                response = result
                            }
                        } else {
                            // hydrate document
                            ydoc1 = new Y.Doc({ guid: response.guid })
                            ydoc1.clientID = parseInt(response.client)
                            const ymap1 = ydoc1.getMap("data")
                            Y.applyUpdate(ydoc1, toUint8Array(response.state))
                            ydoc1.clientID = parseInt(response.client)
                        }

                        docMap.set(roomName, ydoc1)

                        ydoc1.on("update", (update, origin, doc, transaction) => {
                            // console.log("received updated for doc from origin", origin, "update", update)
                            // Y.logUpdate(update)
                        })
                    }

                    if (response != null) {
                        // populate client if required
                        const clientResponse = await internalClient.mutations.UpsertClient({
                            input: {
                                client: {
                                    crdt_id: response.id,
                                    client: input.clientId,
                                    guid: input.guid,
                                    vector: input.sv
                                }
                            }
                        })
                    }

                    return input
                },
                mutatingPostResolve: async ({ input, user, clientRequest, log, response, internalClient }) => {
                    console.log(
                        `mutatingPostResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`
                    )
                    if (response.data == null) {
                        throw new Error("response data cannot be null")
                    }

                    const ydoc1 = docMap.get(roomName)
                    if (ydoc1 == null) {
                        throw new Error("mutatingPostResolve: ydoc1 should be in the docMap")
                    }
                    const yDataMap = ydoc1.getMap("data")

                    console.log("mutatingPostResolve: querying client")
                    const qResponse = await internalClient.queries.QueryClient({
                        input: { client: input.clientId, room: roomName }
                    })
                    console.log("qResponse", qResponse)

                    const client = qResponse?.data?.hasura_clients[0]
                    console.log("mutatingPostResolve client", client)
                    if (client == null) {
                        throw new Error("client cannot be null")
                    }

                    let diff: Uint8Array

                    const pDiffStart = process.hrtime()
                    const pDiffContent = pDiff(yDataMap.toJSON(), response.data)
                    const pDiffEnd = process.hrtime(pDiffStart)
                    console.log("pDiff time",  pDiffEnd[1] / 1000000, "changes", JSON.stringify(pDiffContent, null, 2))
                    console.log("synchronizing from vector", client.vector)

                    const syncDiffStart = process.hrtime()
                    ydoc1.transact(() => {
                        syncronize(yDataMap, response!.data!)
                    })
                    const syncDiffEnd = process.hrtime(syncDiffStart)
                    diff = Y.encodeStateAsUpdate(ydoc1, toUint8Array(client.vector))
                    console.log("syncrhonized, got diff in", syncDiffEnd[1] / 1000000, "upserting CRDT result", ydoc1.clientID.toString())

                    const crdtResponse = await internalClient.mutations.UpsertCrdt({
                        input: {
                            client: ydoc1.clientID.toString(),
                            crdt: {
                                state: fromUint8Array(Y.encodeStateAsUpdate(ydoc1)),
                                vector: fromUint8Array(Y.encodeStateVector(ydoc1))
                            }
                        }
                    })

                    // console.log("mutatingPostResolve success, crdtResponse", crdtResponse)

                    // const diffUpdate = Y.diffUpdate(diff, toUint8Array(client.vector))
                    // console.log("diffUpdate", fromUint8Array(diffUpdate))
                    // const esvDiff = Y.encodeStateVectorFromUpdate(diffUpdate)
                    // console.log("diffUpdate sv", fromUint8Array(esvDiff))

                    // console.log("mutatingPostResolve upserting client")
                    const clientResponse = await internalClient.mutations.UpsertClient({
                        input: {
                            client: {
                                client: input.clientId,
                                guid: input.guid,
                                vector: fromUint8Array(Y.encodeStateVector(ydoc1)) // fromUint8Array(esvDiff) // fromUint8Array(Y.encodeStateVectorFromUpdate(diff))
                            }
                        }
                    })
                    // console.log("mutatingPostResolve client upsert response", clientResponse)

                    // console.log("diff", diff.length, fromUint8Array(diff).length, diff)
                    // Y.logUpdate(diff)
                    // console.log("encoded state", fromUint8Array(Y.encodeStateAsUpdate(ydoc1)))

                    console.log("mutatingPostResolve returning data")
                    // mangle the return into {data: string} so we can handle it on the client
                    return { data: fromUint8Array(diff) } as unknown as any
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
