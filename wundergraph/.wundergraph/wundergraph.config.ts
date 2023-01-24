import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from "@wundergraph/sdk"
import operations from "./wundergraph.operations"
import server from "./wundergraph.server"

const hasura = introspect.graphql({
    apiNamespace: "hasura",
    url: new EnvironmentVariable("HASURA_GRAPHQL_HTTP_URL"),
    headers: (builder) =>
        builder.addStaticHeader("x-hasura-admin-secret", new EnvironmentVariable("HASURA_GRAPHQL_ADMIN_SECRET"))
})

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    apis: [hasura],
    server,
    operations,
    codeGenerators: [
        {
            templates: [...templates.typescript.all]
        },
        {
            templates: [templates.typescript.client],
            path: "../../client/src/graphql"
        }
    ],
    cors: {
        ...cors.allowAll,
        allowedOrigins: ["*"]
    },
    dotGraphQLConfig: {
        hasDotWunderGraphDirectory: false
    },
    security: {
        enableGraphQLEndpoint: true //process.env.NODE_ENV !== 'production' || process.env.GITPOD_WORKSPACE_ID !== undefined,
    }
})
