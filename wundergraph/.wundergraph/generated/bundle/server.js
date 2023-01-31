var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/pigeon/helpers.js
var require_helpers = __commonJS({
  "lib/pigeon/helpers.js"(exports, module2) {
    var _config = {
      strict: true,
      getObjectId: (x) => x.id || x._id || x.uuid || x.slug,
      getTimestamp: Date.now
    };
    function _configure(options) {
      Object.assign(_config, options);
    }
    function _path(path, k, o) {
      if (o) {
        const id = _objId(o);
        if (id)
          k = `[${id}]`;
      }
      return _encodePath(path, k);
    }
    function _encodeKey(key) {
      return typeof key == "string" && (key.indexOf("/") !== -1 || key.indexOf("~") !== -1) ? key.replace(/~/g, "~0").replace(/\//g, "~1") : key;
    }
    function _decodeKey(key) {
      return typeof key == "string" && (key.indexOf("~1") !== -1 || key.indexOf("~0") !== -1) ? key.replace(/~1/g, "/").replace(/~0/g, "~") : key;
    }
    function _decodePath(path) {
      return path.split("/").map((c) => _decodeKey(c));
    }
    function _encodePath(path, k) {
      k = _encodeKey(k);
      return [path, k].filter((x) => x != void 0).join("/").replace("//", "/");
    }
    function _typeof(x) {
      if (Array.isArray(x))
        return "array";
      if (x === null)
        return "null";
      return typeof x;
    }
    function _isPrimitive(x) {
      const t = _typeof(x);
      return t === "number" || t === "null" || t === "boolean" || t == "string";
    }
    function _clone(x) {
      const type = _typeof(x);
      if (type == "array") {
        const arr = Array(x.length);
        for (let i = 0; i < x.length; i++) {
          arr[i] = _clone(x[i]);
        }
        return arr;
      } else if (type == "object") {
        if (x.toJSON) {
          return x.toJSON();
        } else {
          const obj = {};
          for (const k in x) {
            obj[k] = _clone(x[k]);
          }
          return obj;
        }
      } else if (_isPrimitive(x)) {
        const isNumber = typeof x == "number";
        if (isNumber) {
          if (isFinite(x)) {
            return x;
          } else {
            return null;
          }
        } else {
          return x;
        }
      }
    }
    function _entangled(a, b) {
      if (_isPrimitive(a)) {
        return a === b;
      } else if (_typeof(a) == "object") {
        return _objId(a) === _objId(b);
      } else if (_typeof(a) == "array") {
        throw new Error("can't compare arrays of arrays");
      }
    }
    function _objId(x) {
      if (_typeof(x) == "object") {
        const id = _config.getObjectId(x);
        if (id != void 0)
          return id;
        if (_config.strict) {
          throw new Error("couldn't find id for object", { cause: x });
        }
        return _hsh(_stable(x));
      } else {
        return null;
      }
    }
    function _op(op, path, extra) {
      const operation = { op, path };
      Object.assign(operation, extra);
      return operation;
    }
    function _stable(x) {
      if (_typeof(x) == "array") {
        return `[${x.map(_stable).join(",")}]`;
      } else if (_typeof(x) == "object") {
        return `{${Object.keys(x).sort().map((k) => `${JSON.stringify(k)}:${_stable(x[k])}`).join(",")}}`;
      } else {
        return JSON.stringify(x);
      }
    }
    function _hsh(str) {
      return Math.abs([].reduce.call(str, (p, c, i, a) => (p << 5) - p + a.charCodeAt(i), 0));
    }
    function _crc(x) {
      return _hsh(_stable(x));
    }
    module2.exports = {
      _path,
      _typeof,
      _isPrimitive,
      _clone,
      _entangled,
      _objId,
      _op,
      _stable,
      _crc,
      _decodePath,
      _config,
      _configure
    };
  }
});

// lib/pigeon/diff.js
var require_diff = __commonJS({
  "lib/pigeon/diff.js"(exports, module2) {
    var { _path, _typeof, _isPrimitive, _clone, _entangled, _objId, _op, _config } = require_helpers();
    function diff(left, right) {
      const type = _typeof(left);
      if (type !== _typeof(right)) {
        throw new Error("can't diff different types");
      }
      if (type == "array") {
        return diffArray(left, right);
      } else if (type == "object") {
        return diffObject(left, right);
      } else if (_isPrimitive(left)) {
        return diffPrimitive(left, right);
      } else {
        throw new Error("unsupported type");
      }
    }
    function diffPrimitive(l, r, path = "/") {
      if (l !== r) {
        return [_op("replace", _path(path), { value: r, _prev: l })];
      } else {
        return [];
      }
    }
    function diffArray(l, r, path = "/") {
      const lris = {};
      const rlis = {};
      const adds = [];
      for (let i = 0; i < l.length; i++) {
        for (let j = 0; j < r.length; j++) {
          if (j in rlis)
            continue;
          if (i in lris)
            continue;
          if (!_config.strict && _typeof(l[i]) == "array" && _typeof(r[j]) == "array" && i == j || _entangled(l[i], r[j])) {
            lris[i] = j;
            rlis[j] = i;
          }
        }
      }
      const ops = [];
      for (let i = 0, j = 0; j < r.length || i < l.length; ) {
        if (j in r && i in l && rlis[j] == i) {
          if (_typeof(r[j]) === "object") {
            ops.push(...diffObject(l[i], r[j], _path(path, i, r[j])));
          }
          j++;
          i++;
          continue;
        }
        if (i < l.length && !(i in lris)) {
          ops.push(_op("remove", _path(path, i, l[i]), { _prev: l[i] }));
          i++;
          continue;
        }
        if (j < r.length && !(j in rlis)) {
          adds.unshift(_op("add", _path(path, j, r[j + 1]), { value: r[j] }));
          j++;
          continue;
        }
        if (j < r.length && j in rlis) {
          const from = _path(path, rlis[j], l[rlis[j]]);
          const to = _path(path, j);
          if (to != from) {
            ops.push({ op: "move", from, path: to });
            if (_typeof(rlis[j]) == "object") {
              ops.push(...diffObject(l[rlis[j]], r[j], path));
            }
          }
          i++;
          j++;
          continue;
        }
        throw new Error(`couldn't create diff`);
      }
      return ops.concat(adds);
    }
    function diffObject(l, r, path = "/", ref) {
      const ops = [];
      const lkeys = Object.keys(l);
      const llen = lkeys.length;
      let removals = 0;
      for (let i = 0; i < llen; i++) {
        const k = lkeys[i];
        if (!r.hasOwnProperty(k)) {
          removals++;
          ops.push({ op: "remove", path: _path(path, k), _prev: _clone(l[k]) });
          continue;
        }
        if (l[k] === r[k])
          continue;
        const type = _typeof(l[k]);
        if (_isPrimitive(l[k])) {
          ops.push(...diffPrimitive(l[k], r[k], _path(path, k), ref));
        } else if (type !== _typeof(r[k])) {
          ops.push({ op: "replace", path: _path(path, k), value: _clone(r[k]), _prev: _clone(l[k]) });
        } else if (type === "array") {
          ops.push(...diffArray(l[k], r[k], _path(path, k)));
        } else if (type === "object") {
          ops.push(...diffObject(l[k], r[k], _path(path, k), ref));
        }
      }
      const rkeys = Object.keys(r);
      const rlen = rkeys.length;
      if (rlen > llen - removals) {
        for (let i = 0; i < rlen; i++) {
          const k = rkeys[i];
          if (!l.hasOwnProperty(k)) {
            ops.push({ op: "add", path: _path(path, k), value: _clone(r[k]) });
          }
        }
      }
      return ops;
    }
    module2.exports = diff;
  }
});

// lib/pigeon/patch.js
var require_patch = __commonJS({
  "lib/pigeon/patch.js"(exports, module2) {
    var { _typeof, _clone, _objId, _decodePath } = require_helpers();
    function patch(data, changes) {
      changes = _clone(changes);
      const conflicts = [];
      let stash = null;
      CHANGE:
        for (const [ci, change] of changes.entries()) {
          const components = _decodePath(change.path);
          const root = components.shift();
          let tip = components.pop();
          let head = data;
          for (const c of components) {
            if (!head) {
              conflicts.push(change);
              continue CHANGE;
            }
            const key2 = _key(c);
            if (key2) {
              head = head.find((i) => _objId(i) == key2);
            } else {
              head = head[c];
            }
          }
          const key = _key(tip);
          if (key) {
            const idx = head.findIndex((i) => _objId(i) == key);
            if (~idx) {
              tip = idx;
            } else {
              conflicts.push(change);
            }
          }
          const type = _typeof(head);
          if (change.op == "replace") {
            head[tip] = _clone(change.value);
          } else if (change.op == "move") {
            stash = {};
            const ops = [
              { op: "remove", path: change.from },
              { op: "add", path: change.path, value: stash }
            ];
            changes.splice(ci + 1, 0, ...ops);
          } else if (change.op == "remove") {
            if (type == "object") {
              stash && (stash.value = _clone(head[tip]));
              delete head[tip];
            } else if (type == "array") {
              const value = head.splice(tip, 1);
              stash && ([stash.value] = value);
            }
          } else if (change.op == "add") {
            if (type == "object") {
              head[tip] = _clone(change.value);
            } else if (type == "array") {
              if (stash && change.value === stash) {
                head.splice(tip, 0, stash.value);
                stash = null;
              } else {
                head.splice(tip, 0, _clone(change.value));
              }
            }
          }
        }
      return data;
    }
    function _key(c) {
      if (c === void 0)
        return;
      const m = c.match(/^\[(.+)\]$/);
      if (m)
        return m[1];
    }
    module2.exports = patch;
  }
});

// lib/pigeon/reverse.js
var require_reverse = __commonJS({
  "lib/pigeon/reverse.js"(exports, module2) {
    var { _clone, _objId } = require_helpers();
    function reverse(changes) {
      const reversed = _clone(changes).reverse();
      for (const change of reversed) {
        if (change.op == "add") {
          change.op = "remove";
          const id = _objId(change.value);
          if (id) {
            change._index = change.path.split("/").pop();
            change.path = change.path.replace(/\d+$/, `[${id}]`);
          }
        } else if (change.op == "remove") {
          change.op = "add";
        }
        if ("_prev" in change) {
          var _prev = change._prev;
        }
        if ("value" in change) {
          var _value = change.value;
        }
        if (_prev === void 0) {
          delete change.value;
        } else {
          change.value = _prev;
        }
        if (_value === void 0) {
          delete change._prev;
        } else {
          change._prev = _value;
        }
      }
      return reversed;
    }
    module2.exports = reverse;
  }
});

// lib/pigeon/auto.js
var require_auto = __commonJS({
  "lib/pigeon/auto.js"(exports, module2) {
    var assert = require("assert");
    var diff = require_diff();
    var patch = require_patch();
    var reverse = require_reverse();
    var { _clone, _crc, _configure, _config } = require_helpers();
    var HISTORY_LENGTH = 1e3;
    var meta = /* @__PURE__ */ new WeakMap();
    var _cid = _id();
    var AutoPigeon = class {
      constructor() {
        meta.set(this, {
          history: [],
          stash: [],
          warning: null,
          gids: {}
        });
      }
      static from(data, cid = _cid) {
        let doc = new AutoPigeon();
        meta.get(doc).cid = cid;
        doc = AutoPigeon.change(doc, (doc2) => Object.assign(doc2, data));
        return doc;
      }
      static _forge(data, cid = _cid) {
        let doc = new AutoPigeon();
        meta.get(doc).cid = cid;
        Object.assign(doc, _clone(data));
        return doc;
      }
      static alias(doc) {
        let alias = new AutoPigeon();
        meta.set(alias, meta.get(doc));
        Object.assign(alias, doc);
        return alias;
      }
      static init() {
        return AutoPigeon.from({});
      }
      static clone(doc, historyLength = HISTORY_LENGTH) {
        const clone = AutoPigeon._forge(doc);
        meta.get(clone).history = meta.get(doc).history;
        meta.get(clone).gids = _clone(meta.get(doc).gids);
        AutoPigeon.pruneHistory(meta.get(clone), historyLength);
        return clone;
      }
      static pruneHistory(meta2, historyLength) {
        const docHistoryLength = meta2.history.length;
        if (docHistoryLength > historyLength) {
          const prunedHistory = meta2.history.slice(0, docHistoryLength - historyLength);
          for (const item of prunedHistory) {
            delete meta2.gids[item.gid];
          }
        }
        meta2.history = meta2.history.slice(-historyLength);
      }
      static getChanges(left, right) {
        const _diff = diff(left, right);
        const changes = {
          diff: _diff,
          cid: meta.get(left).cid,
          ts: _config.getTimestamp(),
          seq: _seq(),
          gid: _id()
        };
        return changes;
      }
      static rewindChanges(doc, ts, cid) {
        const { history } = meta.get(doc);
        while (true) {
          if (history.length <= 1)
            break;
          const change = history[history.length - 1];
          if (change.ts > ts || change.ts == ts && change.cid > cid) {
            const c = meta.get(doc).history.pop();
            patch(doc, reverse(c.diff));
            delete meta.get(doc).gids[c.gid];
            meta.get(doc).stash.push(c);
            continue;
          }
          break;
        }
      }
      static fastForwardChanges(doc) {
        const { stash, history } = meta.get(doc);
        let change;
        while (change = stash.pop()) {
          patch(doc, change.diff);
          meta.get(doc).gids[change.gid] = 1;
          history.push(change);
        }
      }
      static applyChangesInPlace(doc, changes) {
        return AutoPigeon.applyChanges(doc, changes, true);
      }
      static applyChanges(doc, changes, inplace) {
        meta.get(doc).warning = null;
        const newDoc = inplace ? doc : AutoPigeon.clone(doc);
        if (meta.get(doc).gids[changes.gid]) {
          return newDoc;
        }
        try {
          AutoPigeon.rewindChanges(newDoc, changes.ts, changes.cid);
        } catch (e) {
          meta.get(newDoc).warning = "rewind failed: " + e;
        }
        try {
          patch(newDoc, changes.diff);
          meta.get(newDoc).gids[changes.gid] = 1;
        } catch (e) {
          meta.get(newDoc).warning = "patch failed: " + e;
        }
        try {
          AutoPigeon.fastForwardChanges(newDoc);
        } catch (e) {
          meta.get(newDoc).warning = "forward failed: " + e;
        }
        const history = meta.get(newDoc).history;
        let idx = history.length;
        while (idx > 1 && history[idx - 1].ts > changes.ts)
          idx--;
        history.splice(idx, 0, changes);
        return newDoc;
      }
      static change(doc, fn) {
        assert(doc instanceof AutoPigeon);
        assert(fn instanceof Function);
        const tmp = _clone(doc);
        fn(tmp);
        const changes = AutoPigeon.getChanges(doc, tmp);
        return AutoPigeon.applyChanges(doc, changes);
      }
      static getHistory(doc) {
        return meta.get(doc).history;
      }
      static merge(doc1, doc2) {
        let doc = AutoPigeon.from({});
        const history1 = AutoPigeon.getHistory(doc1);
        const history2 = AutoPigeon.getHistory(doc2);
        const changes = [];
        while (history1.length || history2.length) {
          if (!history2.length) {
            changes.push(history1.shift());
          } else if (!history1.length) {
            changes.push(history2.shift());
          } else if (history1[0].gid === history2[0].gid) {
            changes.push(history1.shift() && history2.shift());
          } else if (history1[0].ts < history2[0].ts) {
            changes.push(history1.shift());
          } else if (history1[0].ts == history2[0].ts) {
            if (history1[0].seq < history2[0].seq) {
              changes.push(history1.shift());
            } else {
              changes.push(history2.shift());
            }
          } else {
            changes.push(history2.shift());
          }
        }
        for (const c of changes) {
          doc = AutoPigeon.applyChanges(doc, c);
        }
        return doc;
      }
      static getWarning(doc) {
        return meta.get(doc).warning;
      }
      static getMissingDeps(doc) {
        return false;
      }
      static setHistoryLength(len) {
        HISTORY_LENGTH = len;
      }
      static setTimestamp(fn) {
        _config.getTimestamp = fn;
      }
      static crc(doc) {
        return _crc(doc);
      }
      static load(str, historyLength = HISTORY_LENGTH) {
        const { meta: _meta, data } = JSON.parse(str);
        AutoPigeon.pruneHistory(_meta, historyLength);
        const doc = AutoPigeon.from(data);
        Object.assign(meta.get(doc), _meta);
        return doc;
      }
      static save(doc) {
        const { cid, ..._meta } = meta.get(doc);
        return JSON.stringify({
          meta: _meta,
          data: doc
        });
      }
      static configure(options) {
        _configure(options);
      }
    };
    function _id() {
      return Math.random().toString(36).substring(2);
    }
    var seq = 0;
    function _seq() {
      return seq++;
    }
    module2.exports = AutoPigeon;
  }
});

// lib/pigeon/index.js
var require_pigeon = __commonJS({
  "lib/pigeon/index.js"(exports, module2) {
    var diff = require_diff();
    var patch = require_patch();
    var reverse = require_reverse();
    var auto = require_auto();
    module2.exports = Object.assign(auto, { auto, diff, patch, reverse });
  }
});

// wundergraph.server.ts
var wundergraph_server_exports = {};
__export(wundergraph_server_exports, {
  default: () => wundergraph_server_default
});
module.exports = __toCommonJS(wundergraph_server_exports);
var import_server = require("@wundergraph/sdk/server");
var import_graphql = require("graphql");
var import_js_base64 = require("js-base64");
var Y2 = __toESM(require("yjs"));

// lib/y-pojo/y-pojo.ts
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
var { diff: pDiff } = require_pigeon();
var docMap = /* @__PURE__ */ new Map();
var roomName = "authors";
var wundergraph_server_default = (0, import_server.configureWunderGraphServer)(() => ({
  hooks: {
    queries: {},
    mutations: {
      ResetAuthors: {
        postResolve: async () => {
        }
      }
    },
    subscriptions: {
      CrdtAuthors: {
        mutatingPreResolve: async ({ input, user, log, internalClient, clientRequest }) => {
          console.log(`preResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`);
          let { data } = await internalClient.queries.QueryCrdt({ input: { room: roomName } });
          let response = data?.hasura_crdt?.[0];
          if (!docMap.has(roomName)) {
            let ydoc1;
            if (response == null) {
              ydoc1 = new Y2.Doc();
              const ymap1 = ydoc1.getMap("data");
              const { data: data2 } = await internalClient.mutations.CreateCrdt({
                input: {
                  crdt: {
                    room: roomName,
                    client: ydoc1.clientID.toString(),
                    guid: ydoc1.guid,
                    state: (0, import_js_base64.fromUint8Array)(Y2.encodeStateAsUpdate(ydoc1)),
                    vector: (0, import_js_base64.fromUint8Array)(Y2.encodeStateVector(ydoc1))
                  }
                }
              });
              const result = data2?.hasura_insert_crdt_one;
              if (result != null) {
                response = result;
              }
            } else {
              ydoc1 = new Y2.Doc({ guid: response.guid });
              ydoc1.clientID = parseInt(response.client);
              const ymap1 = ydoc1.getMap("data");
              Y2.applyUpdate(ydoc1, (0, import_js_base64.toUint8Array)(response.state));
              ydoc1.clientID = parseInt(response.client);
            }
            docMap.set(roomName, ydoc1);
            ydoc1.on("update", (update, origin, doc, transaction) => {
            });
          }
          if (response != null) {
            const clientResponse = await internalClient.mutations.UpsertClient({
              input: {
                client: {
                  crdt_id: response.id,
                  client: input.clientId,
                  guid: input.guid,
                  vector: input.sv
                }
              }
            });
          }
          return input;
        },
        mutatingPostResolve: async ({ input, user, clientRequest, log, response, internalClient }) => {
          console.log(
            `mutatingPostResolve hook called for CrdtAuthors with ${JSON.stringify(input, null, 2)}`
          );
          if (response.data == null) {
            throw new Error("response data cannot be null");
          }
          const ydoc1 = docMap.get(roomName);
          if (ydoc1 == null) {
            throw new Error("mutatingPostResolve: ydoc1 should be in the docMap");
          }
          const yDataMap = ydoc1.getMap("data");
          console.log("mutatingPostResolve: querying client");
          const qResponse = await internalClient.queries.QueryClient({
            input: { client: input.clientId, room: roomName }
          });
          console.log("qResponse", qResponse);
          const client = qResponse?.data?.hasura_clients[0];
          console.log("mutatingPostResolve client", client);
          if (client == null) {
            throw new Error("client cannot be null");
          }
          let diff;
          const pDiffStart = process.hrtime();
          const pDiffContent = pDiff(yDataMap.toJSON(), response.data);
          const pDiffEnd = process.hrtime(pDiffStart);
          console.log("pDiff time", pDiffEnd[1] / 1e6, "changes", JSON.stringify(pDiffContent, null, 2));
          console.log("synchronizing from vector", client.vector);
          const syncDiffStart = process.hrtime();
          ydoc1.transact(() => {
            syncronize(yDataMap, response.data);
          });
          const syncDiffEnd = process.hrtime(syncDiffStart);
          diff = Y2.encodeStateAsUpdate(ydoc1, (0, import_js_base64.toUint8Array)(client.vector));
          console.log("syncrhonized, got diff in", syncDiffEnd[1] / 1e6, "upserting CRDT result", ydoc1.clientID.toString());
          const crdtResponse = await internalClient.mutations.UpsertCrdt({
            input: {
              client: ydoc1.clientID.toString(),
              crdt: {
                state: (0, import_js_base64.fromUint8Array)(Y2.encodeStateAsUpdate(ydoc1)),
                vector: (0, import_js_base64.fromUint8Array)(Y2.encodeStateVector(ydoc1))
              }
            }
          });
          const clientResponse = await internalClient.mutations.UpsertClient({
            input: {
              client: {
                client: input.clientId,
                guid: input.guid,
                vector: (0, import_js_base64.fromUint8Array)(Y2.encodeStateVector(ydoc1))
              }
            }
          });
          console.log("mutatingPostResolve returning data");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=server.js.map
