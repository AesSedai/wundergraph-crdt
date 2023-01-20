import { fromUint8Array, toUint8Array } from "js-base64"
import { omit } from "lodash"
import { createTransform } from "redux-persist"
import * as Y from "yjs"
import { InitialState, PersistState } from "./authorSlice"

export const yjsTransform = createTransform<InitialState, PersistState>(
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => {
        console.log("transform inbound", inboundState)

        return {
            ...omit(inboundState, "doc"),
            encodeState: fromUint8Array(Y.encodeStateAsUpdate(inboundState.doc))
        }
    },
    // transform state being rehydrated
    (outboundState, key) => {
        console.log("transform outbound", outboundState)

        const doc = new Y.Doc()
        const ymap1 = doc.getMap("data")
        Y.applyUpdate(doc, toUint8Array(outboundState.encodeState))
        return {
            ...omit(outboundState, "encodeState"),
            sv: fromUint8Array(Y.encodeStateVector(doc)),
            doc: doc
        }
    },
    // define which reducers this transform gets called for.
    { whitelist: ["author"] }
)
