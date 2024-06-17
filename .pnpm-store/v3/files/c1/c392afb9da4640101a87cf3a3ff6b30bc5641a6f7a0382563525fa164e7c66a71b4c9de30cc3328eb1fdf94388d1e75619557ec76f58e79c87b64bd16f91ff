function u(n) {
  return n.reduce((t, e) => (t[e.name] = e.value, t), {});
}
function p(n) {
  return /\s|-/.test(n);
}
function c(n, t = 0) {
  let e = [], a = " ".repeat(t), s = " ".repeat(t + 2);
  for (const [h, i] of Object.entries(n)) {
    let d = p(h) ? `'${h}'` : h;
    if (Array.isArray(i)) {
      const r = i.map((o) => typeof o == "string" ? `'${o}'` : o && typeof o == "object" ? c(o, t + 2) : o).join(`, ${s}`);
      e.push(`${s}${d}: [${r}]`);
    } else if (i && typeof i == "object")
      e.push(
        `${s}${d}: ${c(
          i,
          t + 2
        )}`
      );
    else if (typeof i == "string") {
      let r = `${i}`;
      if (i.startsWith("JSON.stringify")) {
        const o = i.split(`
`);
        o.length > 1 && (r = o.map((f, l) => l === 0 ? f : `${s}${f}`).join(`
`));
      } else
        r = `'${i}'`;
      e.push(`${s}${d}: ${r}`);
    } else
      e.push(`${s}${d}: ${i}`);
  }
  return `{
${e.join(`,
`)}
${a}}`;
}
function m(n) {
  var d, r;
  const t = {
    method: "GET",
    ...n
  };
  t.method = t.method.toUpperCase();
  const e = {
    method: t.method === "GET" ? void 0 : t.method
  }, a = new URLSearchParams(
    t.queryString ? u(t.queryString) : void 0
  ), s = a.size ? `?${a.toString()}` : "";
  (d = t.headers) != null && d.length && (e.headers = {}, t.headers.forEach((o) => {
    e.headers[o.name] = o.value;
  })), (r = t.cookies) != null && r.length && (e.headers = e.headers || {}, t.cookies.forEach((o) => {
    e.headers["Set-Cookie"] = e.headers["Set-Cookie"] ? `${e.headers["Set-Cookie"]}; ${o.name}=${o.value}` : `${o.name}=${o.value}`;
  })), Object.keys(e).forEach((o) => {
    e[o] === void 0 && delete e[o];
  }), t.postData && (e.body = t.postData.text, t.postData.mimeType === "application/json" && (e.body = `JSON.stringify(${c(JSON.parse(e.body))})`));
  const h = Object.keys(e).length ? `, ${c(e)}` : "";
  return {
    target: "node",
    client: "undici",
    code: `import { request } from 'undici'

const { statusCode, body } = await request('${t.url}${s}'${h})`
  };
}
function $(n) {
  var d, r;
  const t = {
    method: "GET",
    ...n
  };
  t.method = t.method.toUpperCase();
  const e = {
    method: t.method === "GET" ? void 0 : t.method
  }, a = new URLSearchParams(
    t.queryString ? u(t.queryString) : void 0
  ), s = a.size ? `?${a.toString()}` : "";
  (d = t.headers) != null && d.length && (e.headers = {}, t.headers.forEach((o) => {
    e.headers[o.name] = o.value;
  })), (r = t.cookies) != null && r.length && (e.headers = e.headers || {}, t.cookies.forEach((o) => {
    e.headers["Set-Cookie"] = e.headers["Set-Cookie"] ? `${e.headers["Set-Cookie"]}; ${o.name}=${o.value}` : `${o.name}=${o.value}`;
  })), Object.keys(e).forEach((o) => {
    e[o] === void 0 && delete e[o];
  }), t.postData && (e.body = t.postData.text, t.postData.mimeType === "application/json" && (e.body = `JSON.stringify(${c(
    JSON.parse(e.body)
  )})`));
  const h = Object.keys(e).length ? `, ${c(e)}` : "";
  return {
    target: "node",
    client: "fetch",
    code: `fetch('${t.url}${s}'${h})`
  };
}
function g(n) {
  var d, r;
  const t = {
    method: "GET",
    ...n
  };
  t.method = t.method.toUpperCase();
  const e = {
    method: t.method === "GET" ? void 0 : t.method
  }, a = new URLSearchParams(
    t.queryString ? u(t.queryString) : void 0
  ), s = a.size ? `?${a.toString()}` : "";
  (d = t.headers) != null && d.length && (e.headers = {}, t.headers.forEach((o) => {
    e.headers[o.name] = o.value;
  })), (r = t.cookies) != null && r.length && (e.headers = e.headers || {}, t.cookies.forEach((o) => {
    e.headers["Set-Cookie"] = e.headers["Set-Cookie"] ? `${e.headers["Set-Cookie"]}; ${o.name}=${o.value}` : `${o.name}=${o.value}`;
  })), Object.keys(e).forEach((o) => {
    e[o] === void 0 && delete e[o];
  }), t.postData && (e.body = t.postData.text, t.postData.mimeType === "application/json" && (e.body = `JSON.stringify(${c(
    JSON.parse(e.body)
  )})`));
  const h = Object.keys(e).length ? `, ${c(e)}` : "";
  return {
    target: "js",
    client: "fetch",
    code: `fetch('${t.url}${s}'${h})`
  };
}
function y(n) {
  var i, d;
  const t = {
    method: "GET",
    ...n
  };
  t.method = t.method.toUpperCase();
  const e = {
    method: t.method === "GET" ? void 0 : t.method
  }, a = new URLSearchParams(
    t.queryString ? u(t.queryString) : void 0
  );
  a.size && (e.query = {}, a.forEach((r, o) => {
    e.query[o] = r;
  })), (i = t.headers) != null && i.length && (e.headers = {}, t.headers.forEach((r) => {
    e.headers[r.name] = r.value;
  })), (d = t.cookies) != null && d.length && (e.headers = e.headers || {}, t.cookies.forEach((r) => {
    e.headers["Set-Cookie"] = e.headers["Set-Cookie"] ? `${e.headers["Set-Cookie"]}; ${r.name}=${r.value}` : `${r.name}=${r.value}`;
  })), Object.keys(e).forEach((r) => {
    e[r] === void 0 && delete e[r];
  }), t.postData && (e.body = t.postData.text, t.postData.mimeType === "application/json" && (e.body = JSON.parse(e.body)));
  const s = Object.keys(e).length ? `, ${c(e)}` : "";
  return {
    target: "js",
    client: "ofetch",
    code: `ofetch('${t.url}'${s})`
  };
}
function S(n) {
  var i, d;
  const t = {
    method: "GET",
    ...n
  };
  t.method = t.method.toUpperCase();
  const e = {
    method: t.method === "GET" ? void 0 : t.method
  }, a = new URLSearchParams(
    t.queryString ? u(t.queryString) : void 0
  );
  a.size && (e.query = {}, a.forEach((r, o) => {
    e.query[o] = r;
  })), (i = t.headers) != null && i.length && (e.headers = {}, t.headers.forEach((r) => {
    e.headers[r.name] = r.value;
  })), (d = t.cookies) != null && d.length && (e.headers = e.headers || {}, t.cookies.forEach((r) => {
    e.headers["Set-Cookie"] = e.headers["Set-Cookie"] ? `${e.headers["Set-Cookie"]}; ${r.name}=${r.value}` : `${r.name}=${r.value}`;
  })), Object.keys(e).forEach((r) => {
    e[r] === void 0 && delete e[r];
  }), t.postData && (e.body = t.postData.text, t.postData.mimeType === "application/json" && (e.body = JSON.parse(e.body)));
  const s = Object.keys(e).length ? `, ${c(e)}` : "";
  return {
    target: "node",
    client: "ofetch",
    code: `ofetch('${t.url}'${s})`
  };
}
function v() {
  const n = [m, $, g, y, S];
  return {
    get(t, e, a) {
      const s = this.findPlugin(t, e);
      if (s)
        return s(a);
    },
    print(t, e, a) {
      var s;
      return (s = this.get(t, e, a)) == null ? void 0 : s.code;
    },
    targets() {
      return n.map((t) => t().target).filter((t, e, a) => a.indexOf(t) === e);
    },
    clients() {
      return n.map((t) => t().client);
    },
    plugins() {
      return n.map((t) => {
        const e = t();
        return {
          target: e.target,
          client: e.client
        };
      });
    },
    findPlugin(t, e) {
      return n.find((a) => {
        const s = a();
        return s.target === t && s.client === e;
      });
    },
    hasPlugin(t, e) {
      return !!this.findPlugin(t, e);
    }
  };
}
export {
  v as snippetz
};
