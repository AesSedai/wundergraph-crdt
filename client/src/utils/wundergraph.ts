// import { createHooks } from "@wundergraph/react-query"
// import { createHooks } from "./react-query/hooks"
import { createHooks } from "@wundergraph/swr"
import { createClient, Operations } from "../graphql/client"

const client = createClient({
    baseURL: import.meta.env.VITE_SERVER_URL
}) // Typesafe WunderGraph client

export const { useQuery, useMutation, useSubscription, useUser, useFileUpload, useAuth } =
    createHooks<Operations>(client)
