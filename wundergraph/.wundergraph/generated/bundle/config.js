var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wundergraph.config.ts
var import_sdk2 = require("@wundergraph/sdk");

// wundergraph.operations.ts
var import_sdk = require("@wundergraph/sdk");
var wundergraph_operations_default = (0, import_sdk.configureWunderGraphOperations)({
  operations: {
    defaultConfig: {
      authentication: {
        required: false
      }
    },
    queries: (config) => ({
      ...config,
      caching: {
        enable: false,
        staleWhileRevalidate: 60,
        maxAge: 60,
        public: true
      },
      liveQuery: {
        enable: true,
        pollingIntervalSeconds: 1
      }
    }),
    mutations: (config) => ({
      ...config
    }),
    subscriptions: (config) => ({
      ...config
    }),
    custom: {}
  }
});

// wundergraph.server.ts
var import_server = require("@wundergraph/sdk/server");
var import_graphql = require("graphql");
var import_js_base64 = require("js-base64");
var Y2 = __toESM(require("yjs"));

// lib/y-pojo.ts
var Y = __toESM(require("yjs"));
function deepEquals(managed, target) {
  const managedType = detectManagedType(managed);
  try {
    var targetType = target.constructor.name;
  } catch (e) {
    targetType = "undefined";
  }
  if (managedType == "YArray" && targetType == "Array") {
    const targetArray = target;
    const managedArray = managed;
    const result = managedArray.length == targetArray.length && targetArray.every((t, i) => deepEquals(managedArray.get(i), targetArray[i]));
    return result;
  } else if (managedType == "YMap" && targetType == "Object") {
    const targetMap = target;
    const managedMap = managed;
    let targetKeyCount = 0;
    for (let targetKey in targetMap) {
      targetKeyCount++;
      if (!deepEquals(managedMap.get(targetKey), targetMap[targetKey])) {
        return false;
      }
    }
    return targetKeyCount == Array.from(managedMap.keys()).length;
  } else {
    return target === managed;
  }
}
function syncronize(managedObj, targetObj) {
  let changed = false;
  const managedType = detectManagedType(managedObj);
  switch (managedType) {
    case "YArray":
      if (!Array.isArray(targetObj)) {
        throw new Error(`Sync failed, ${targetObj} was not array`);
      }
      const managedArray = managedObj;
      const targetArray = targetObj;
      const outOfRange = Symbol();
      let cursor = 0;
      for (let i = 0; i < targetArray.length; i++) {
        let match = false;
        const targetValue = targetArray[i];
        const len = managedArray.length > targetArray.length ? managedArray.length : targetArray.length;
        for (let j = cursor; !match && j < len; j++) {
          const managedValue = j < managedArray.length ? managedArray.get(j) : outOfRange;
          const targetValue2 = i < targetArray.length ? targetArray[i] : outOfRange;
          if (deepEquals(managedValue, targetValue2)) {
            for (let x = j - 1; x >= cursor; x--) {
              changed = true;
              managedArray.delete(x);
            }
            const deletedCount = j - cursor;
            cursor = j + 1 - deletedCount;
            match = true;
          }
        }
        if (!match) {
          try {
            var childType = targetValue.constructor.name;
          } catch (e) {
            childType = "undefined";
          }
          const managedChild = cursor < managedArray.length ? managedArray.get(cursor) : "undefined";
          const managedType2 = detectManagedType(managedChild);
          if (managedType2 == "YMap" && childType == "Object" || managedType2 == "YArray" && childType == "Array") {
            syncronize(managedChild, targetValue);
          } else {
            managedArray.insert(cursor, [syncChild(targetValue)]);
          }
          cursor++;
          changed = true;
        }
      }
      while (managedArray.length > targetArray.length) {
        changed = true;
        managedArray.delete(targetArray.length);
      }
      break;
    case "YMap":
      if (targetObj.constructor.name !== "Object") {
        throw new Error(`Sync failed, ${targetObj} was not object`);
      }
      const managedMap = managedObj;
      const targetMap = targetObj;
      for (const key of managedMap.keys()) {
        if (!(key in targetObj)) {
          managedMap.delete(key);
          changed = true;
          continue;
        }
        const managedChild = managedMap.get(key);
        const targetChild = targetMap[key];
        const managedType2 = detectManagedType(managedChild);
        try {
          var childType = targetChild.constructor.name;
        } catch (e) {
          childType = "undefined";
        }
        if (managedType2 == "YMap" && childType !== "Object" || managedType2 == "YArray" && childType !== "Array" || !["YMap", "YArray"].includes(managedType2) && managedType2 !== childType) {
          managedMap.delete(key);
          changed = true;
        } else if (managedType2 == "YMap" || managedType2 == "YArray") {
          const childChanged = syncronize(managedChild, targetChild);
          changed ||= childChanged;
        } else {
          if (managedChild !== targetChild) {
            managedMap.set(key, targetChild);
            changed = true;
          }
        }
      }
      for (const key in targetMap) {
        if (!managedMap.has(key)) {
          const child = syncChild(targetMap[key]);
          managedMap.set(key, child);
          changed = true;
        }
      }
      break;
    default:
      throw new Error(`can only iterate over Y.Map and Y.Array, got ${managedObj}`);
  }
  return changed;
}
function syncChild(child) {
  try {
    var childType = child.constructor.name;
  } catch (e) {
    childType = "undefined";
  }
  if (childType == "Array") {
    const arr = new Y.Array();
    syncronize(arr, child);
    return arr;
  } else if (childType == "Object") {
    const map = new Y.Map();
    syncronize(map, child);
    return map;
  } else {
    return child;
  }
}
function detectManagedType(managed) {
  try {
    if (managed.length !== void 0 && managed.get !== void 0) {
      return "YArray";
    } else if (managed.keys !== void 0 && managed.get !== void 0) {
      return "YMap";
    } else {
      return managed.constructor.name;
    }
  } catch (e) {
    return "undefined";
  }
}

// wundergraph.server.ts
var initialSync = true;
var wundergraph_server_default = (0, import_server.configureWunderGraphServer)(() => ({
  hooks: {
    queries: {},
    mutations: {
      ResetAuthors: {
        postResolve: async () => {
          initialSync = true;
        }
      }
    },
    subscriptions: {
      CrdtAuthors: {
        mutatingPreResolve: async ({ input, user, log, internalClient, clientRequest }) => {
          console.log(`preResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`);
          input.limit = 150;
          initialSync = true;
          return input;
        },
        mutatingPostResolve: async ({ input, user, clientRequest, log, response, internalClient }) => {
          console.log(
            `mutatingPostResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`
          );
          if (response.data == null) {
            throw new Error("response data cannot be null");
          }
          const ydoc1 = new Y2.Doc();
          const yDataMap = ydoc1.getMap("data");
          const { data: loaded } = await internalClient.queries.QueryCrdt({ input: { client: "first" } });
          let hasuraCrdt = loaded?.hasura_crdt?.[0]?.state;
          if (hasuraCrdt != null) {
            Y2.applyUpdate(ydoc1, (0, import_js_base64.toUint8Array)(hasuraCrdt));
          }
          let diff;
          let stateVector;
          if (initialSync) {
            initialSync = false;
            stateVector = (0, import_js_base64.toUint8Array)(input.sv);
          } else {
            stateVector = Y2.encodeStateVector(ydoc1);
          }
          syncronize(yDataMap, response.data);
          diff = Y2.encodeStateAsUpdate(ydoc1, stateVector);
          await internalClient.mutations.UpsertCrdt({
            input: {
              crdt: {
                client: "first",
                state: (0, import_js_base64.fromUint8Array)(Y2.encodeStateAsUpdate(ydoc1)),
                vector: (0, import_js_base64.fromUint8Array)(Y2.encodeStateVector(ydoc1))
              }
            }
          });
          console.log("diff", diff.length, (0, import_js_base64.fromUint8Array)(diff).length, diff);
          return { data: (0, import_js_base64.fromUint8Array)(diff) };
        }
      }
    }
  },
  graphqlServers: [
    {
      apiNamespace: "public",
      serverName: "public",
      enableGraphQLEndpoint: true,
      schema: new import_graphql.GraphQLSchema({
        query: new import_graphql.GraphQLObjectType({
          name: "Query",
          fields: {
            hello: {
              type: import_graphql.GraphQLString,
              resolve: (args, ctx) => {
                return `Hello ${ctx.wundergraph.user?.name || "World"}`;
              }
            }
          }
        }),
        subscription: new import_graphql.GraphQLObjectType({
          name: "Subscription",
          fields: {
            hello: {
              type: import_graphql.GraphQLString,
              resolve: (args, ctx) => {
                return `Hello ${ctx.wundergraph.user?.name || "World"}`;
              }
            }
          }
        })
      })
    }
  ]
}));

// wundergraph.config.ts
var hasura = import_sdk2.introspect.graphql({
  apiNamespace: "hasura",
  url: new import_sdk2.EnvironmentVariable("HASURA_GRAPHQL_HTTP_URL"),
  headers: (builder) => builder.addStaticHeader("x-hasura-admin-secret", new import_sdk2.EnvironmentVariable("HASURA_GRAPHQL_ADMIN_SECRET"))
});
(0, import_sdk2.configureWunderGraphApplication)({
  apis: [hasura],
  server: wundergraph_server_default,
  operations: wundergraph_operations_default,
  codeGenerators: [
    {
      templates: [...import_sdk2.templates.typescript.all]
    },
    {
      templates: [import_sdk2.templates.typescript.client],
      path: "../../client/src/graphql"
    }
  ],
  cors: {
    ...import_sdk2.cors.allowAll,
    allowedOrigins: ["http://127.0.0.1:3000/"]
  },
  dotGraphQLConfig: {
    hasDotWunderGraphDirectory: false
  },
  security: {
    enableGraphQLEndpoint: true
  }
});
//# sourceMappingURL=config.js.map
