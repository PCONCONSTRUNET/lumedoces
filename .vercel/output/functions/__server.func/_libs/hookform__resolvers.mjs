import { g as get, s as set, a as appendErrors } from "./react-hook-form.mjs";
const t$1 = (r, t2, s2) => {
  if (r && "reportValidity" in r) {
    const o2 = get(s2, t2);
    r.setCustomValidity(o2 && o2.message || ""), r.reportValidity();
  }
}, s$1 = (e, r) => {
  for (const s2 in r.fields) {
    const o2 = r.fields[s2];
    o2 && o2.ref && "reportValidity" in o2.ref ? t$1(o2.ref, s2, e) : o2 && o2.refs && o2.refs.forEach((r2) => t$1(r2, s2, e));
  }
}, o$1 = (t2, o2) => {
  o2.shouldUseNativeValidation && s$1(t2, o2);
  const n2 = {};
  for (const s2 in t2) {
    const f = get(o2.fields, s2), c = Object.assign(t2[s2] || {}, { ref: f && f.refs ? f.refs[0] : f && f.ref });
    if (i$1(o2.names || Object.keys(t2), s2)) {
      const t3 = Object.assign({}, get(n2, s2));
      set(t3, "root", c), set(n2, s2, t3);
    } else set(n2, s2, c);
  }
  return n2;
}, i$1 = (e, r) => {
  const t2 = n(r).replace(/[.*+?^${}()|\\]/g, "\\$&");
  return e.some((e2) => n(e2).match(`^${t2}\\.\\d+`));
};
function n(e) {
  return e.replace(/\[(\d+)]/g, ".$1").replace(/[[\]]/g, "");
}
function o() {
  return o = Object.assign ? Object.assign.bind() : function(r) {
    for (var e = 1; e < arguments.length; e++) {
      var n2 = arguments[e];
      for (var o2 in n2) ({}).hasOwnProperty.call(n2, o2) && (r[o2] = n2[o2]);
    }
    return r;
  }, o.apply(null, arguments);
}
function t(r, e) {
  try {
    var n2 = r();
  } catch (r2) {
    return e(r2);
  }
  return n2 && n2.then ? n2.then(void 0, e) : n2;
}
function s(r, e) {
  for (var o2 = /* @__PURE__ */ Object.create(null); r.length; ) {
    var t2 = r[0], s2 = t2.code, i2 = t2.message, u2 = t2.path.join(".");
    if (!o2[u2]) if ("unionErrors" in t2) {
      var a, c, l = t2.unionErrors.reduce(function(r2, e2) {
        return e2.errors.length < r2.errors.length ? e2 : r2;
      }).errors[0];
      o2[u2] = { message: null != (a = null == l ? void 0 : l.message) ? a : i2, type: null != (c = null == l ? void 0 : l.code) ? c : s2 };
    } else o2[u2] = { message: i2, type: s2 };
    if ("unionErrors" in t2 && t2.unionErrors.forEach(function(e2) {
      return e2.errors.forEach(function(e3) {
        return r.push(e3);
      });
    }), e) {
      var f = o2[u2].types, d = f && f[t2.code];
      o2[u2] = appendErrors(u2, e, o2, s2, d ? [].concat(d, t2.message) : t2.message);
    }
    r.shift();
  }
  return o2;
}
function i(r, e) {
  for (var t2 = /* @__PURE__ */ Object.create(null), s2 = function() {
    var s3 = r[0], i2 = s3.code, u2 = s3.message, a = s3.path.join(".");
    if (!t2[a]) if ("invalid_union" === s3.code && s3.errors.length > 0) {
      var c, l, f = s3.errors.reduce(function(r2, e2) {
        return e2.length < r2.length ? e2 : r2;
      })[0];
      t2[a] = { message: null != (c = null == f ? void 0 : f.message) ? c : u2, type: null != (l = null == f ? void 0 : f.code) ? l : i2 };
    } else t2[a] = { message: u2, type: i2 };
    if ("invalid_union" === s3.code && s3.errors.forEach(function(e2) {
      return e2.forEach(function(e3) {
        return r.push(o({}, e3, { path: [].concat(s3.path, e3.path) }));
      });
    }), e) {
      var d = t2[a].types, h = d && d[s3.code];
      t2[a] = appendErrors(a, e, t2, i2, h ? [].concat(h, s3.message) : s3.message);
    }
    r.shift();
  }; r.length; ) s2();
  return t2;
}
function u(n2, o2, u2) {
  if (void 0 === u2 && (u2 = {}), (function(r) {
    return "_zod" in r && "object" == typeof r._zod;
  })(n2)) return function(s2, a, c) {
    try {
      return Promise.resolve(t(function() {
        function e(e2) {
          return c.shouldUseNativeValidation && s$1({}, c), { errors: {}, values: u2.raw ? Object.assign({}, s2) : e2 };
        }
        var t2 = n2;
        return "sync" === u2.mode ? e(t2.parse(s2, o2)) : Promise.resolve(t2.parseAsync(s2, o2)).then(e);
      }, function(r) {
        if ((function(r2) {
          var e;
          return !(null == r2 || null == (e = r2._zod) || null == (e = e.traits) || !e.has("$ZodError"));
        })(r)) return { values: {}, errors: o$1(i(r.issues, !c.shouldUseNativeValidation && "all" === c.criteriaMode), c) };
        throw r;
      }));
    } catch (r) {
      return Promise.reject(r);
    }
  };
  if ((function(r) {
    return "_def" in r && "object" == typeof r._def;
  })(n2)) return function(i2, a, c) {
    try {
      return Promise.resolve(t(function() {
        return Promise.resolve(n2["sync" === u2.mode ? "parse" : "parseAsync"](i2, o2)).then(function(e) {
          return c.shouldUseNativeValidation && s$1({}, c), { errors: {}, values: u2.raw ? Object.assign({}, i2) : e };
        });
      }, function(r) {
        if ((function(r2) {
          return Array.isArray(null == r2 ? void 0 : r2.issues);
        })(r)) return { values: {}, errors: o$1(s(r.errors, !c.shouldUseNativeValidation && "all" === c.criteriaMode), c) };
        throw r;
      }));
    } catch (r) {
      return Promise.reject(r);
    }
  };
  throw new Error("Invalid input: not a Zod schema");
}
export {
  u
};
