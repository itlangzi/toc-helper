function N() {
}
const Ye = (e) => e;
function Be(e) {
  return e();
}
function Te() {
  return /* @__PURE__ */ Object.create(null);
}
function R(e) {
  e.forEach(Be);
}
function $(e) {
  return typeof e == "function";
}
function ye(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function gt(e) {
  return Object.keys(e).length === 0;
}
function _t(e, ...t) {
  if (e == null)
    return N;
  const n = e.subscribe(...t);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function ie(e, t, n) {
  e.$$.on_destroy.push(_t(t, n));
}
function D(e, t, n) {
  return e.set(n), t;
}
function bt(e) {
  return e && $(e.destroy) ? e.destroy : N;
}
const We = typeof window < "u";
let Ke = We ? () => window.performance.now() : () => Date.now(), Ee = We ? (e) => requestAnimationFrame(e) : N;
const Y = /* @__PURE__ */ new Set();
function Ve(e) {
  Y.forEach((t) => {
    t.c(e) || (Y.delete(t), t.f());
  }), Y.size !== 0 && Ee(Ve);
}
function Ge(e) {
  let t;
  return Y.size === 0 && Ee(Ve), {
    promise: new Promise((n) => {
      Y.add(t = { c: e, f: n });
    }),
    abort() {
      Y.delete(t);
    }
  };
}
function we(e, t) {
  e.appendChild(t);
}
function vt(e, t, n) {
  const o = pe(e);
  if (!o.getElementById(t)) {
    const l = W("style");
    l.id = t, l.textContent = n, Je(o, l);
  }
}
function pe(e) {
  if (!e)
    return document;
  const t = e.getRootNode ? e.getRootNode() : e.ownerDocument;
  return t && t.host ? t : e.ownerDocument;
}
function yt(e) {
  const t = W("style");
  return Je(pe(e), t), t.sheet;
}
function Je(e, t) {
  we(e.head || e, t);
}
function B(e, t, n) {
  e.insertBefore(t, n || null);
}
function z(e) {
  e.parentNode.removeChild(e);
}
function Et(e, t) {
  for (let n = 0; n < e.length; n += 1)
    e[n] && e[n].d(t);
}
function W(e) {
  return document.createElement(e);
}
function Se(e) {
  return document.createTextNode(e);
}
function wt() {
  return Se(" ");
}
function Qe() {
  return Se("");
}
function ee(e, t, n, o) {
  return e.addEventListener(t, n, o), () => e.removeEventListener(t, n, o);
}
function M(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function pt(e) {
  return Array.from(e.childNodes);
}
function St(e, t) {
  t = "" + t, e.wholeText !== t && (e.data = t);
}
function Pe(e, t, n) {
  e.classList[n ? "add" : "remove"](t);
}
function Ot(e, t, { bubbles: n = !1, cancelable: o = !1 } = {}) {
  const l = document.createEvent("CustomEvent");
  return l.initCustomEvent(e, n, o, t), l;
}
const se = /* @__PURE__ */ new Map();
let re = 0;
function xt(e) {
  let t = 5381, n = e.length;
  for (; n--; )
    t = (t << 5) - t ^ e.charCodeAt(n);
  return t >>> 0;
}
function kt(e, t) {
  const n = { stylesheet: yt(t), rules: {} };
  return se.set(e, n), n;
}
function Ue(e, t, n, o, l, i, s, f = 0) {
  const r = 16.666 / o;
  let u = `{
`;
  for (let b = 0; b <= 1; b += r) {
    const S = t + (n - t) * i(b);
    u += b * 100 + `%{${s(S, 1 - S)}}
`;
  }
  const d = u + `100% {${s(n, 1 - n)}}
}`, a = `__svelte_${xt(d)}_${f}`, c = pe(e), { stylesheet: g, rules: _ } = se.get(c) || kt(c, e);
  _[a] || (_[a] = !0, g.insertRule(`@keyframes ${a} ${d}`, g.cssRules.length));
  const E = e.style.animation || "";
  return e.style.animation = `${E ? `${E}, ` : ""}${a} ${o}ms linear ${l}ms 1 both`, re += 1, a;
}
function ge(e, t) {
  const n = (e.style.animation || "").split(", "), o = n.filter(t ? (i) => i.indexOf(t) < 0 : (i) => i.indexOf("__svelte") === -1), l = n.length - o.length;
  l && (e.style.animation = o.join(", "), re -= l, re || Lt());
}
function Lt() {
  Ee(() => {
    re || (se.forEach((e) => {
      const { stylesheet: t } = e;
      let n = t.cssRules.length;
      for (; n--; )
        t.deleteRule(n);
      e.rules = {};
    }), se.clear());
  });
}
let Z;
function Q(e) {
  Z = e;
}
function Dt() {
  if (!Z)
    throw new Error("Function called outside component initialization");
  return Z;
}
function Nt(e) {
  Dt().$$.on_mount.push(e);
}
const J = [], _e = [], oe = [], Ae = [], Ct = Promise.resolve();
let be = !1;
function Ft() {
  be || (be = !0, Ct.then(Xe));
}
function K(e) {
  oe.push(e);
}
const me = /* @__PURE__ */ new Set();
let te = 0;
function Xe() {
  const e = Z;
  do {
    for (; te < J.length; ) {
      const t = J[te];
      te++, Q(t), Tt(t.$$);
    }
    for (Q(null), J.length = 0, te = 0; _e.length; )
      _e.pop()();
    for (let t = 0; t < oe.length; t += 1) {
      const n = oe[t];
      me.has(n) || (me.add(n), n());
    }
    oe.length = 0;
  } while (J.length);
  for (; Ae.length; )
    Ae.pop()();
  be = !1, me.clear(), Q(e);
}
function Tt(e) {
  if (e.fragment !== null) {
    e.update(), R(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(K);
  }
}
let G;
function Ze() {
  return G || (G = Promise.resolve(), G.then(() => {
    G = null;
  })), G;
}
function ce(e, t, n) {
  e.dispatchEvent(Ot(`${t ? "intro" : "outro"}${n}`));
}
const le = /* @__PURE__ */ new Set();
let P;
function Oe() {
  P = {
    r: 0,
    c: [],
    p: P
  };
}
function xe() {
  P.r || R(P.c), P = P.p;
}
function x(e, t) {
  e && e.i && (le.delete(e), e.i(t));
}
function A(e, t, n, o) {
  if (e && e.o) {
    if (le.has(e))
      return;
    le.add(e), P.c.push(() => {
      le.delete(e), o && (n && e.d(1), o());
    }), e.o(t);
  } else
    o && o();
}
const $e = { duration: 0 };
function Pt(e, t, n) {
  let o = t(e, n), l = !1, i, s, f = 0;
  function r() {
    i && ge(e, i);
  }
  function u() {
    const { delay: a = 0, duration: c = 300, easing: g = Ye, tick: _ = N, css: E } = o || $e;
    E && (i = Ue(e, 0, 1, c, a, g, E, f++)), _(0, 1);
    const b = Ke() + a, S = b + c;
    s && s.abort(), l = !0, K(() => ce(e, !0, "start")), s = Ge((C) => {
      if (l) {
        if (C >= S)
          return _(1, 0), ce(e, !0, "end"), r(), l = !1;
        if (C >= b) {
          const k = g((C - b) / c);
          _(k, 1 - k);
        }
      }
      return l;
    });
  }
  let d = !1;
  return {
    start() {
      d || (d = !0, ge(e), $(o) ? (o = o(), Ze().then(u)) : u());
    },
    invalidate() {
      d = !1;
    },
    end() {
      l && (r(), l = !1);
    }
  };
}
function At(e, t, n) {
  let o = t(e, n), l = !0, i;
  const s = P;
  s.r += 1;
  function f() {
    const { delay: r = 0, duration: u = 300, easing: d = Ye, tick: a = N, css: c } = o || $e;
    c && (i = Ue(e, 1, 0, u, r, d, c));
    const g = Ke() + r, _ = g + u;
    K(() => ce(e, !1, "start")), Ge((E) => {
      if (l) {
        if (E >= _)
          return a(0, 1), ce(e, !1, "end"), --s.r || R(s.c), !1;
        if (E >= g) {
          const b = d((E - g) / u);
          a(1 - b, b);
        }
      }
      return l;
    });
  }
  return $(o) ? Ze().then(() => {
    o = o(), f();
  }) : f(), {
    end(r) {
      r && o.tick && o.tick(1, 0), l && (i && ge(e, i), l = !1);
    }
  };
}
function et(e) {
  e && e.c();
}
function ke(e, t, n, o) {
  const { fragment: l, on_mount: i, on_destroy: s, after_update: f } = e.$$;
  l && l.m(t, n), o || K(() => {
    const r = i.map(Be).filter($);
    s ? s.push(...r) : R(r), e.$$.on_mount = [];
  }), f.forEach(K);
}
function Le(e, t) {
  const n = e.$$;
  n.fragment !== null && (R(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Ht(e, t) {
  e.$$.dirty[0] === -1 && (J.push(e), Ft(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function tt(e, t, n, o, l, i, s, f = [-1]) {
  const r = Z;
  Q(e);
  const u = e.$$ = {
    fragment: null,
    ctx: null,
    props: i,
    update: N,
    not_equal: l,
    bound: Te(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (r ? r.$$.context : [])),
    callbacks: Te(),
    dirty: f,
    skip_bound: !1,
    root: t.target || r.$$.root
  };
  s && s(u.root);
  let d = !1;
  if (u.ctx = n ? n(e, t.props || {}, (a, c, ...g) => {
    const _ = g.length ? g[0] : c;
    return u.ctx && l(u.ctx[a], u.ctx[a] = _) && (!u.skip_bound && u.bound[a] && u.bound[a](_), d && Ht(e, a)), c;
  }) : [], u.update(), d = !0, R(u.before_update), u.fragment = o ? o(u.ctx) : !1, t.target) {
    if (t.hydrate) {
      const a = pt(t.target);
      u.fragment && u.fragment.l(a), a.forEach(z);
    } else
      u.fragment && u.fragment.c();
    t.intro && x(e.$$.fragment), ke(e, t.target, t.anchor, t.customElement), Xe();
  }
  Q(r);
}
class nt {
  $destroy() {
    Le(this, 1), this.$destroy = N;
  }
  $on(t, n) {
    const o = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return o.push(n), () => {
      const l = o.indexOf(n);
      l !== -1 && o.splice(l, 1);
    };
  }
  $set(t) {
    this.$$set && !gt(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const ve = window.requestAnimationFrame, Mt = window.cancelAnimationFrame, v = function(e, t, ...n) {
  if (typeof e == "function")
    return e.call(t, ...n);
}, fe = function(e) {
  return e === document.body || e === document;
}, zt = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent), He = zt ? "touchstart" : "click", Rt = /^h(\d)$/i;
let he = 0;
const jt = (e, t, n, o, l, i, s) => {
  l = l || "bitoc-heading-", i = i || "bitoc-ml-";
  let f = e.getAttribute("id");
  he = he + 1;
  let r = f;
  f || (f = l + he);
  const u = (e.textContent || "").trim();
  return {
    class: i + t,
    title: u,
    parent: o,
    target: e,
    level: t,
    oriLevel: n,
    id: f,
    oriId: r,
    y: U(e, s).y
  };
}, ot = function(e, t) {
  return e ? e.level === t ? e.parent : e.level === t - 1 ? e : ot(e.parent, t) : null;
}, qt = (e, t, n, o) => {
  if (!e || !e.length)
    return { nodes: [], offsets: {} };
  const l = {}, i = [];
  let s = null;
  return e.forEach((f) => {
    let r = null;
    const u = Rt.exec(f.nodeName);
    u ? r = u[1] : r = f.getAttribute("data-level"), r = parseInt(r), r = Math.max(1, Math.min(r, 6)) || 6;
    let d = r, a = null;
    s ? s.level >= r ? (a = ot(s.parent, r), d = a ? a.level + 1 : 1) : (d = s.level + 1, a = s) : (d = 1, a = null);
    const c = jt(f, d, r, a, t, n, o);
    a ? a.nodes ? a.nodes.push(c) : a.nodes = [c] : i.push(c), s = c, l[c.y] = c;
  }), { nodes: i, offsets: l };
}, It = function(e, t = 16) {
  let n, o = !1, l = Date.now();
  const i = () => {
    o = !0, n && Mt(n);
  }, s = () => {
    if (!o) {
      if (Date.now() - l >= t) {
        i(), v(e, this, n);
        return;
      }
      n = ve(s);
    }
  };
  return s(), i;
}, Yt = function(e, t = 24) {
  let n = null;
  return function() {
    const o = this, l = arguments, i = Date.now();
    (!n || i - n > t) && (e.apply(o, l), n = i);
  };
}, Bt = function(e, t, n) {
  (e <= 0 || isNaN(e)) && (e = 500);
  const o = Date.now();
  let l = !0;
  return ve(function i() {
    const s = (Date.now() - o) / e;
    v(t, void 0, s), s >= 1 && (t(1), l = !1, v(n, void 0, 1)), l && ve(i);
  }), function() {
    l = !1;
  };
}, lt = function(e) {
  return e.scrollHeight > e.clientHeight;
}, U = function(e, t) {
  let n = t;
  (!t || fe(t)) && (n = document.documentElement);
  let o = e.offsetTop || 0, l = e.offsetLeft || 0;
  const i = e.offsetParent;
  if (fe(e) || !i)
    return { x: l, y: o };
  if (i === n.offsetParent) {
    const s = n.offsetTop || 0, f = n.offsetLeft || 0;
    return { x: l - f, y: o - s };
  }
  if (i !== n) {
    const s = U(i);
    o += s.y, l += s.x;
  }
  return { x: l, y: o };
}, ue = function(e) {
  return e === window ? e.screenY : e === document ? document.scrollingElement.scrollTop : e.scrollTop;
}, Wt = function(e, t, n) {
  if (t && !n)
    return window.getComputedStyle(e).getPropertyValue(t);
  e.style[t] = n;
}, it = function(e) {
  return fe(e) ? document : !e || lt(e) ? e : Wt(e, "position") === "fixed" || !e.parentElement ? document : it(e.parentElement);
}, Me = (e, t, n, o) => {
  let l = 0;
  const i = o || 100;
  return function s(f, r, u) {
    if (ue(f) === r)
      l = 0, v(u);
    else {
      if (l > i) {
        l = 0, v(u);
        return;
      }
      l += 1, It(() => {
        s(f, r, u);
      });
    }
  }(e, t, n);
}, st = function(e, t, n = 200, o) {
  if (lt(e)) {
    const l = ue(e), i = t - l;
    Bt(n, (s) => {
      e.scrollTo({
        left: 0,
        top: l + s * i,
        behavior: "smooth"
      });
    }, o);
  } else
    v(o, void 0, 1);
};
function Kt(e) {
  const t = e - 1;
  return t * t * t + 1;
}
const ze = function(e, { delay: t = 0, duration: n = 150, easing: o = Kt } = {}) {
  const l = getComputedStyle(e), i = +l.opacity, s = parseFloat(l.height);
  return {
    delay: t,
    duration: n,
    easing: o,
    css: (f) => `opacity: ${Math.min(f * 20, 1) * i}; max-height: ${f * s}px;`
  };
}, I = [];
function rt(e, t = N) {
  let n;
  const o = /* @__PURE__ */ new Set();
  function l(f) {
    if (ye(e, f) && (e = f, n)) {
      const r = !I.length;
      for (const u of o)
        u[1](), I.push(u, e);
      if (r) {
        for (let u = 0; u < I.length; u += 2)
          I[u][0](I[u + 1]);
        I.length = 0;
      }
    }
  }
  function i(f) {
    l(f(e));
  }
  function s(f, r = N) {
    const u = [f, r];
    return o.add(u), o.size === 1 && (n = t(l) || N), f(e), () => {
      o.delete(u), o.size === 0 && (n(), n = null);
    };
  }
  return { set: l, update: i, subscribe: s };
}
const T = rt(0), X = rt(null);
function Re(e, t, n) {
  const o = e.slice();
  return o[18] = t[n], o;
}
function je(e) {
  let t, n, o, l, i, s, f = e[0], r = [];
  for (let d = 0; d < f.length; d += 1)
    r[d] = Ie(Re(e, f, d));
  const u = (d) => A(r[d], 1, 1, () => {
    r[d] = null;
  });
  return {
    c() {
      t = W("div");
      for (let d = 0; d < r.length; d += 1)
        r[d].c();
      M(t, "class", "bitoc-nav");
    },
    m(d, a) {
      B(d, t, a);
      for (let c = 0; c < r.length; c += 1)
        r[c].m(t, null);
      l = !0, i || (s = [
        ee(t, "introstart", e[10]),
        ee(t, "introend", e[11]),
        ee(t, "outrostart", e[12]),
        ee(t, "outroend", e[13])
      ], i = !0);
    },
    p(d, a) {
      if (a & 495) {
        f = d[0];
        let c;
        for (c = 0; c < f.length; c += 1) {
          const g = Re(d, f, c);
          r[c] ? (r[c].p(g, a), x(r[c], 1)) : (r[c] = Ie(g), r[c].c(), x(r[c], 1), r[c].m(t, null));
        }
        for (Oe(), c = f.length; c < r.length; c += 1)
          u(c);
        xe();
      }
    },
    i(d) {
      if (!l) {
        for (let a = 0; a < f.length; a += 1)
          x(r[a]);
        K(() => {
          o && o.end(1), n = Pt(t, ze, {}), n.start();
        }), l = !0;
      }
    },
    o(d) {
      r = r.filter(Boolean);
      for (let a = 0; a < r.length; a += 1)
        A(r[a]);
      n && n.invalidate(), o = At(t, ze, {}), l = !1;
    },
    d(d) {
      d && z(t), Et(r, d), d && o && o.end(), i = !1, R(s);
    }
  };
}
function qe(e) {
  let t, n;
  return t = new ct({
    props: {
      nodes: e[18].nodes,
      parent: e[18],
      scrollOffset: e[6],
      onNav: e[5],
      scrollElement: e[1],
      scrollDuration: e[2],
      collapsedLevel: e[3],
      transitionEnd: e[7]
    }
  }), {
    c() {
      et(t.$$.fragment);
    },
    m(o, l) {
      ke(t, o, l), n = !0;
    },
    p(o, l) {
      const i = {};
      l & 1 && (i.nodes = o[18].nodes), l & 1 && (i.parent = o[18]), l & 64 && (i.scrollOffset = o[6]), l & 32 && (i.onNav = o[5]), l & 2 && (i.scrollElement = o[1]), l & 4 && (i.scrollDuration = o[2]), l & 8 && (i.collapsedLevel = o[3]), l & 128 && (i.transitionEnd = o[7]), t.$set(i);
    },
    i(o) {
      n || (x(t.$$.fragment, o), n = !0);
    },
    o(o) {
      A(t.$$.fragment, o), n = !1;
    },
    d(o) {
      Le(t, o);
    }
  };
}
function Ie(e) {
  let t, n = e[18].title + "", o, l, i, s, f, r, u, d, a, c = e[18].nodes && e[18].nodes.length && qe(e);
  return {
    c() {
      t = W("a"), o = Se(n), f = wt(), c && c.c(), r = Qe(), M(t, "href", l = "#" + e[18].id), M(t, "class", i = e[18].class), Pe(t, "active", e[8] === e[18]);
    },
    m(g, _) {
      B(g, t, _), we(t, o), B(g, f, _), c && c.m(g, _), B(g, r, _), u = !0, d || (a = bt(s = e[9].call(null, t, e[18])), d = !0);
    },
    p(g, _) {
      e = g, (!u || _ & 1) && n !== (n = e[18].title + "") && St(o, n), (!u || _ & 1 && l !== (l = "#" + e[18].id)) && M(t, "href", l), (!u || _ & 1 && i !== (i = e[18].class)) && M(t, "class", i), s && $(s.update) && _ & 1 && s.update.call(null, e[18]), _ & 257 && Pe(t, "active", e[8] === e[18]), e[18].nodes && e[18].nodes.length ? c ? (c.p(e, _), _ & 1 && x(c, 1)) : (c = qe(e), c.c(), x(c, 1), c.m(r.parentNode, r)) : c && (Oe(), A(c, 1, 1, () => {
        c = null;
      }), xe());
    },
    i(g) {
      u || (x(c), u = !0);
    },
    o(g) {
      A(c), u = !1;
    },
    d(g) {
      g && z(t), g && z(f), c && c.d(g), g && z(r), d = !1, a();
    }
  };
}
function Vt(e) {
  let t = !e[14](e[8], e[4]), n, o, l = t && je(e);
  return {
    c() {
      l && l.c(), n = Qe();
    },
    m(i, s) {
      l && l.m(i, s), B(i, n, s), o = !0;
    },
    p(i, [s]) {
      s & 272 && (t = !i[14](i[8], i[4])), t ? l ? (l.p(i, s), s & 272 && x(l, 1)) : (l = je(i), l.c(), x(l, 1), l.m(n.parentNode, n)) : l && (Oe(), A(l, 1, 1, () => {
        l = null;
      }), xe());
    },
    i(i) {
      o || (x(l), o = !0);
    },
    o(i) {
      A(l), o = !1;
    },
    d(i) {
      l && l.d(i), i && z(n);
    }
  };
}
function Gt(e, t, n) {
  let o, l;
  ie(e, T, (h) => n(16, o = h)), ie(e, X, (h) => n(8, l = h));
  let { nodes: i = [] } = t, { scrollElement: s } = t, { scrollDuration: f } = t, { collapsedLevel: r } = t, { parent: u = null } = t, { onNav: d = null } = t, { scrollOffset: a = 0 } = t, { transitionStart: c = null } = t, { transitionEnd: g = null } = t;
  const _ = function(h, y) {
    y.element = h;
    let p = y;
    const j = function(L) {
      D(X, l = p, l);
      let H = s;
      s.scrollingElement && (H = s.scrollingElement);
      const q = p.y - a;
      D(T, o = o + 1, o), st(H, q, f, function() {
        if (typeof d != "function") {
          Me(H, q, () => {
            D(T, o = o - 1, o);
          });
          return;
        }
        d(L.target, p, function() {
          Me(H, q, () => {
            D(T, o = o - 1, o);
          });
        });
      });
    };
    return h.addEventListener(He, j), {
      update(L) {
        p = L, p.element = h;
      },
      destory() {
        y.element = null, p = null, h.removeEventListener(He, j);
      }
    };
  }, E = (h) => {
    D(T, o = o + 1, o), v(c, void 0, h);
  }, b = (h) => {
    D(T, o = o - 1, o), v(g, void 0, h);
  }, S = (h) => {
    D(T, o = o + 1, o), v(c, void 0, h);
  }, C = (h) => {
    D(T, o = o - 1, o), v(g, void 0, h);
  }, k = function(h, y) {
    return h && y ? h === y ? !0 : k(h.parent, y) : !1;
  }, ae = function(h, y) {
    return !h || !y ? !1 : y.level + 1 > r && !k(h, y);
  };
  return e.$$set = (h) => {
    "nodes" in h && n(0, i = h.nodes), "scrollElement" in h && n(1, s = h.scrollElement), "scrollDuration" in h && n(2, f = h.scrollDuration), "collapsedLevel" in h && n(3, r = h.collapsedLevel), "parent" in h && n(4, u = h.parent), "onNav" in h && n(5, d = h.onNav), "scrollOffset" in h && n(6, a = h.scrollOffset), "transitionStart" in h && n(15, c = h.transitionStart), "transitionEnd" in h && n(7, g = h.transitionEnd);
  }, [
    i,
    s,
    f,
    r,
    u,
    d,
    a,
    g,
    l,
    _,
    E,
    b,
    S,
    C,
    ae,
    c
  ];
}
class ct extends nt {
  constructor(t) {
    super(), tt(this, t, Gt, Vt, ye, {
      nodes: 0,
      scrollElement: 1,
      scrollDuration: 2,
      collapsedLevel: 3,
      parent: 4,
      onNav: 5,
      scrollOffset: 6,
      transitionStart: 15,
      transitionEnd: 7
    });
  }
}
function Jt(e) {
  vt(e, "svelte-f3ug8b", '.bitoc.svelte-f3ug8b.svelte-f3ug8b,.bitoc.svelte-f3ug8b .svelte-f3ug8b{box-sizing:border-box}.bitoc-fixed{position:fixed !important}.bitoc.svelte-f3ug8b.svelte-f3ug8b{width:100%;position:relative;overflow-y:auto;-ms-overflow-style:none;overflow:-moz-scrollbars-none;scroll-behavior:smooth}.bitoc.svelte-f3ug8b.svelte-f3ug8b::-webkit-scrollbar{width:0 !important}.bitoc-nav a{display:block;padding:0.2rem 1.7rem;font-size:0.9rem;text-decoration:none;color:#555;position:relative;transition:all 0.25s}.bitoc-nav{overflow:hidden;transition:max-height 0.25s}.bitoc-nav a:before{content:" ";height:0.25rem;width:0.25rem;background:#555;position:absolute;top:0.72rem;left:1rem}.bitoc-nav a:hover, .bitoc-nav a.active{color:#009a61}.bitoc-nav a.active::before, .bitoc-nav a:hover:before{background:#009a61}.bitoc-nav a.bitoc-ml-2{margin-left:1rem !important}.bitoc-nav a.bitoc-ml-3{margin-left:2rem !important}.bitoc-nav a.bitoc-ml-4{margin-left:3rem !important}.bitoc-nav a.bitoc-ml-5{margin-left:4rem !important}.bitoc-nav a.bitoc-ml-6{margin-left:5rem !important}');
}
function Qt(e) {
  let t, n, o, l;
  return o = new ct({
    props: {
      scrollOffset: e[2],
      collapsedLevel: e[0],
      scrollDuration: e[1],
      nodes: e[3],
      scrollElement: e[5],
      transitionEnd: e[6]
    }
  }), {
    c() {
      t = W("main"), n = W("div"), et(o.$$.fragment), M(n, "class", "bitoc-navs svelte-f3ug8b"), M(t, "class", "bitoc svelte-f3ug8b");
    },
    m(i, s) {
      B(i, t, s), we(t, n), ke(o, n, null), e[20](t), l = !0;
    },
    p(i, s) {
      const f = {};
      s[0] & 4 && (f.scrollOffset = i[2]), s[0] & 1 && (f.collapsedLevel = i[0]), s[0] & 2 && (f.scrollDuration = i[1]), s[0] & 8 && (f.nodes = i[3]), o.$set(f);
    },
    i(i) {
      l || (x(o.$$.fragment, i), l = !0);
    },
    o(i) {
      A(o.$$.fragment, i), l = !1;
    },
    d(i) {
      i && z(t), Le(o), e[20](null);
    }
  };
}
function Ut(e, t, n) {
  let o, l;
  ie(e, T, (m) => n(24, o = m)), ie(e, X, (m) => n(25, l = m));
  let { contentElement: i } = t, { scrollElement: s } = t, { fixedElement: f } = t, { headingSelector: r } = t, { collapsedLevel: u = 3 } = t, { idPrefix: d = "" } = t, { levelClassPrefix: a = "" } = t, { scrollDuration: c = 200 } = t, { fixedOffset: g = 0 } = t, { fixedClassName: _ = "bitoc-fixed" } = t, { scrollOffset: E = 0 } = t, { beforeFixed: b = null } = t, { afterFixed: S = null } = t;
  const C = function() {
    q(), V();
  }, k = function() {
    return h.length === 0;
  }, ae = function() {
    j = U(f || p, document.documentElement).y, V();
  };
  let h = [], y = {}, p = null, j = 0, L = it(s), H = [];
  const q = function() {
    const m = i.querySelectorAll(r || "h1, h2, h3, h4, h5, h6"), O = qt(m, d, a, L);
    n(3, h = O.nodes), y = O.offsets, H = Object.keys(y).map(Number);
    const w = De();
    y[w] && D(X, l = y[w], l);
  }, De = function() {
    const m = ue(L);
    return H.find((O) => O >= m);
  }, ft = function(m) {
    if (k())
      return;
    const O = De(), w = y[O];
    if (O !== void 0 && w) {
      D(X, l = w, l);
      const F = w.element;
      ut(F, m);
    } else
      v(m);
  }, ut = function(m, O) {
    if (k()) {
      v(O);
      return;
    }
    let w = p;
    if (m && w) {
      let F = U(m, w).y;
      const de = w.offsetHeight, Ce = w.scrollHeight - de, Fe = de / 2;
      F <= Fe ? F = 0 : F - de > Ce ? F = Ce : F = F - Fe, st(w, F, c, () => {
        v(O);
      });
    } else
      v(O);
  }, at = function() {
    if (!k() && g !== !1 && _ && fe(L)) {
      const m = f || p, O = ue(document);
      let w = g;
      if (w || (w = j), O >= w) {
        if (!m.classList.contains(_)) {
          if (v(b, void 0, !0) === !1)
            return;
          m.classList.add(_), v(S, void 0, !0);
        }
      } else if (m.classList.contains(_)) {
        if (v(b, void 0, !1) === !1)
          return;
        m.classList.remove(_), v(S, void 0, !1);
      }
    }
  }, Ne = function() {
    at(), o === 0 && ft();
  }, V = function() {
    mt();
  }, dt = () => {
    Ne();
  }, mt = Yt(Ne, 16);
  Nt(() => (j = U(f || p, document.documentElement).y, V(), L.addEventListener("scroll", V), () => {
    L.removeEventListener("scroll", V);
  }));
  function ht(m) {
    _e[m ? "unshift" : "push"](() => {
      p = m, n(4, p);
    });
  }
  return e.$$set = (m) => {
    "contentElement" in m && n(7, i = m.contentElement), "scrollElement" in m && n(8, s = m.scrollElement), "fixedElement" in m && n(9, f = m.fixedElement), "headingSelector" in m && n(10, r = m.headingSelector), "collapsedLevel" in m && n(0, u = m.collapsedLevel), "idPrefix" in m && n(11, d = m.idPrefix), "levelClassPrefix" in m && n(12, a = m.levelClassPrefix), "scrollDuration" in m && n(1, c = m.scrollDuration), "fixedOffset" in m && n(13, g = m.fixedOffset), "fixedClassName" in m && n(14, _ = m.fixedClassName), "scrollOffset" in m && n(2, E = m.scrollOffset), "beforeFixed" in m && n(15, b = m.beforeFixed), "afterFixed" in m && n(16, S = m.afterFixed);
  }, q(), [
    u,
    c,
    E,
    h,
    p,
    L,
    dt,
    i,
    s,
    f,
    r,
    d,
    a,
    g,
    _,
    b,
    S,
    C,
    k,
    ae,
    ht
  ];
}
class Xt extends nt {
  constructor(t) {
    super(), tt(this, t, Ut, Qt, ye, {
      contentElement: 7,
      scrollElement: 8,
      fixedElement: 9,
      headingSelector: 10,
      collapsedLevel: 0,
      idPrefix: 11,
      levelClassPrefix: 12,
      scrollDuration: 1,
      fixedOffset: 13,
      fixedClassName: 14,
      scrollOffset: 2,
      beforeFixed: 15,
      afterFixed: 16,
      reset: 17,
      isEmpty: 18,
      syncScroll: 19
    }, Jt, [-1, -1]);
  }
  get reset() {
    return this.$$.ctx[17];
  }
  get isEmpty() {
    return this.$$.ctx[18];
  }
  get syncScroll() {
    return this.$$.ctx[19];
  }
}
const ne = function(e, t, n, o) {
  if (!(!e && o)) {
    if (typeof e == "string" && (e = document.querySelector(e)), !(e instanceof HTMLElement))
      if (n)
        e = n;
      else
        throw new Error(`"${t}"is an invalid selector or non-DOM node`);
    return e;
  }
};
class $t {
  constructor(t, n) {
    const {
      contentSelector: o,
      scrollSelector: l,
      fixedSelector: i,
      headingSelector: s,
      collapsedLevel: f,
      idPrefix: r,
      levelClassPrefix: u,
      scrollDuration: d,
      fixedOffset: a,
      fixedClassName: c,
      scrollOffset: g,
      beforeFixed: _,
      afterFixed: E
    } = n || {};
    t = ne(t, "mount");
    const b = ne(o, "contentSelector", document.body), S = ne(l, "scrollSelector", document.body), C = ne(i, "fixedSelector", null, !0);
    this.toc = new Xt({
      target: t,
      props: {
        contentElement: b,
        scrollElement: S,
        fixedElement: C,
        headingSelector: s,
        collapsedLevel: Math.max(1, Math.min(f, 6)) || 3,
        idPrefix: r,
        levelClassPrefix: u,
        scrollDuration: d,
        fixedOffset: a,
        fixedClassName: c,
        scrollOffset: g,
        beforeFixed: _,
        afterFixed: E
      }
    });
  }
  reset() {
    this.toc.reset();
  }
  isEmpty() {
    return this.toc.isEmpty();
  }
  syncScroll() {
    this.toc.syncScroll();
  }
}
export {
  $t as default
};
