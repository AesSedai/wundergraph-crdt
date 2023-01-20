// import { createHooks } from "@wundergraph/react-query"
// import { createHooks } from "./react-query/hooks"
import { createHooks } from "@wundergraph/swr"
import { createClient, Operations } from "../graphql/client"

const client = createClient({
    baseURL: "http://127.0.0.1:4000"
}) // Typesafe WunderGraph client

export const { useQuery, useMutation, useSubscription, useUser, useFileUpload, useAuth } =
    createHooks<Operations>(client)
