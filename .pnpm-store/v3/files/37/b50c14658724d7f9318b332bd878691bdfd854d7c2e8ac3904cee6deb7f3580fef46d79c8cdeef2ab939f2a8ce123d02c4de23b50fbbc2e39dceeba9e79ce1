function d(a) {
  return a.reduce((t, e) => (t[e.name] = e.value, t), {});
}
function l(a) {
  return /\s|-/.test(a);
}
function u(a, t = 0) {
  let e = [], f = " ".repeat(t), n = " ".repeat(t + 2);
  for (const [h, o] of Object.entries(a)) {
    let i = l(h) ? `'${h}'` : h;
    if (Array.isArray(o)) {
      const r = o.map((s) => typeof s == "string" ? `'${s}'` : s && typeof s == "object" ? u(s, t + 2) : s).join(`, ${n}`);
      e.push(`${n}${i}: [${r}]`);
    } else if (o && typeof o == "object")
      e.push(
        `${n}${i}: ${u(
          o,
          t + 2
        )}`
      );
    else if (typeof o == "string") {
      let r = `${o}`;
      if (o.startsWith("JSON.stringify")) {
        const s = o.split(`
`);
        s.length > 1 && (r = s.map((c, $) => $ === 0 ? c : `${n}${c}`).join(`
`));
      } else
        r = `'${o}'`;
      e.push(`${n}${i}: ${r}`);
    } else
      e.push(`${n}${i}: ${o}`);
  }
  return `{
${e.join(`,
`)}
${f}}`;
}
function p(a) {
  var o, i;
  const t = {
    method: "GET",
    ...a
  };
  t.method = t.method.toUpperCase();
  const e = {
    method: t.method === "GET" ? void 0 : t.method
  }, f = new URLSearchParams(
    t.queryString ? d(t.queryString) : void 0
  );
  f.size && (e.query = {}, f.forEach((r, s) => {
    e.query[s] = r;
  })), (o = t.headers) != null && o.length && (e.headers = {}, t.headers.forEach((r) => {
    e.headers[r.name] = r.value;
  })), (i = t.cookies) != null && i.length && (e.headers = e.headers || {}, t.cookies.forEach((r) => {
    e.headers["Set-Cookie"] = e.headers["Set-Cookie"] ? `${e.headers["Set-Cookie"]}; ${r.name}=${r.value}` : `${r.name}=${r.value}`;
  })), Object.keys(e).forEach((r) => {
    e[r] === void 0 && delete e[r];
  }), t.postData && (e.body = t.postData.text, t.postData.mimeType === "application/json" && (e.body = JSON.parse(e.body)));
  const n = Object.keys(e).length ? `, ${u(e)}` : "";
  return {
    target: "node",
    client: "ofetch",
    code: `ofetch('${t.url}'${n})`
  };
}
export {
  p as ofetch
};
