import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { GraphQLResponseError } from "@wundergraph/sdk/client"
import { fromUint8Array, toUint8Array } from "js-base64"
import { cloneDeep } from "lodash"
import * as Y from "yjs"
import { CrdtAuthorsResponse, CrdtAuthorsResponseData } from "../../graphql/models"

export type InitialState = {
    doc: Y.Doc
    response: CrdtAuthorsResponse
    sv: string
    error: GraphQLResponseError | undefined
    lastTransferred: number
    transferred: number
}

export type PersistState = {
    encodeState: string
    response: CrdtAuthorsResponse
    sv: string
    error: GraphQLResponseError | undefined
    lastTransferred: number
    transferred: number
}

const initialState: InitialState = {
    doc: new Y.Doc(),
    response: { data: { hasura_authors: [] } },
    sv: "",
    error: undefined,
    lastTransferred: 0,
    transferred: 0
}

initialState.sv = fromUint8Array(Y.encodeStateVector(initialState.doc))

// not used, but required to set up root types on the Ydoc
const ymap1 = initialState.doc.getMap("data")

export const authorSlice = createSlice({
    name: "author",
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<GraphQLResponseError | undefined>) => {
            state.error = action.payload
        },
        apply: (state, action: PayloadAction<string>) => {
            const doc = cloneDeep(state.doc)
            console.log("applying update to state.doc")
            Y.logUpdate(toUint8Array(action.payload))
            Y.applyUpdate(doc, toUint8Array(action.payload))
            // state.sv = fromUint8Array(Y.encodeStateVector(state.doc))
            state.response.data = doc.getMap("data").toJSON() as CrdtAuthorsResponseData
            state.transferred += action.payload.length
            state.lastTransferred = action.payload.length
            state.doc = doc
            console.log("client id", state.doc.clientID, "guid", state.doc.guid, "data", doc.getMap("data").toJSON())
        }
    }
})

// Action creators are generated for each case reducer function
export const { apply, setError } = authorSlice.actions

export default authorSlice.reducer
