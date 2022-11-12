function L() {
}
const Ye = (e) => e;
function Be(e) {
  return e();
}
function Te() {
  return /* @__PURE__ */ Object.create(null);
}
function j(e) {
  e.forEach(Be);
}
function V(e) {
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
    return L;
  const n = e.subscribe(...t);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function le(e, t, n) {
  e.$$.on_destroy.push(_t(t, n));
}
function N(e, t, n) {
  return e.set(n), t;
}
function bt(e) {
  return e && V(e.destroy) ? e.destroy : L;
}
const We = typeof window < "u";
let Ke = We ? () => window.performance.now() : () => Date.now(), Ee = We ? (e) => requestAnimationFrame(e) : L;
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
    const i = W("style");
    i.id = t, i.textContent = n, Je(o, i);
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
  return we(e.head || e, t), t.sheet;
}
function B(e, t, n) {
  e.insertBefore(t, n || null);
}
function A(e) {
  e.parentNode && e.parentNode.removeChild(e);
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
function z(e, t, n) {
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
  const i = document.createEvent("CustomEvent");
  return i.initCustomEvent(e, n, o, t), i;
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
function Ue(e, t, n, o, i, l, s, u = 0) {
  const r = 16.666 / o;
  let c = `{
`;
  for (let b = 0; b <= 1; b += r) {
    const S = t + (n - t) * l(b);
    c += b * 100 + `%{${s(S, 1 - S)}}
`;
  }
  const d = c + `100% {${s(n, 1 - n)}}
}`, a = `__svelte_${xt(d)}_${u}`, f = pe(e), { stylesheet: g, rules: _ } = se.get(f) || kt(f, e);
  _[a] || (_[a] = !0, g.insertRule(`@keyframes ${a} ${d}`, g.cssRules.length));
  const E = e.style.animation || "";
  return e.style.animation = `${E ? `${E}, ` : ""}${a} ${o}ms linear ${i}ms 1 both`, re += 1, a;
}
function ge(e, t) {
  const n = (e.style.animation || "").split(", "), o = n.filter(
    t ? (l) => l.indexOf(t) < 0 : (l) => l.indexOf("__svelte") === -1
  ), i = n.length - o.length;
  i && (e.style.animation = o.join(", "), re -= i, re || Lt());
}
function Lt() {
  Ee(() => {
    re || (se.forEach((e) => {
      const { ownerNode: t } = e.stylesheet;
      t && A(t);
    }), se.clear());
  });
}
let $;
function U(e) {
  $ = e;
}
function Dt() {
  if (!$)
    throw new Error("Function called outside component initialization");
  return $;
}
function Nt(e) {
  Dt().$$.on_mount.push(e);
}
const Q = [], _e = [], oe = [], Ae = [], Ct = Promise.resolve();
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
  const e = $;
  do {
    for (; te < Q.length; ) {
      const t = Q[te];
      te++, U(t), Tt(t.$$);
    }
    for (U(null), Q.length = 0, te = 0; _e.length; )
      _e.pop()();
    for (let t = 0; t < oe.length; t += 1) {
      const n = oe[t];
      me.has(n) || (me.add(n), n());
    }
    oe.length = 0;
  } while (Q.length);
  for (; Ae.length; )
    Ae.pop()();
  be = !1, me.clear(), U(e);
}
function Tt(e) {
  if (e.fragment !== null) {
    e.update(), j(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(K);
  }
}
let J;
function Ze() {
  return J || (J = Promise.resolve(), J.then(() => {
    J = null;
  })), J;
}
function fe(e, t, n) {
  e.dispatchEvent(Ot(`${t ? "intro" : "outro"}${n}`));
}
const ie = /* @__PURE__ */ new Set();
let P;
function Oe() {
  P = {
    r: 0,
    c: [],
    p: P
  };
}
function xe() {
  P.r || j(P.c), P = P.p;
}
function x(e, t) {
  e && e.i && (ie.delete(e), e.i(t));
}
function H(e, t, n, o) {
  if (e && e.o) {
    if (ie.has(e))
      return;
    ie.add(e), P.c.push(() => {
      ie.delete(e), o && (n && e.d(1), o());
    }), e.o(t);
  } else
    o && o();
}
const $e = { duration: 0 };
function Pt(e, t, n) {
  let o = t(e, n), i = !1, l, s, u = 0;
  function r() {
    l && ge(e, l);
  }
  function c() {
    const { delay: a = 0, duration: f = 300, easing: g = Ye, tick: _ = L, css: E } = o || $e;
    E && (l = Ue(e, 0, 1, f, a, g, E, u++)), _(0, 1);
    const b = Ke() + a, S = b + f;
    s && s.abort(), i = !0, K(() => fe(e, !0, "start")), s = Ge((C) => {
      if (i) {
        if (C >= S)
          return _(1, 0), fe(e, !0, "end"), r(), i = !1;
        if (C >= b) {
          const D = g((C - b) / f);
          _(D, 1 - D);
        }
      }
      return i;
    });
  }
  let d = !1;
  return {
    start() {
      d || (d = !0, ge(e), V(o) ? (o = o(), Ze().then(c)) : c());
    },
    invalidate() {
      d = !1;
    },
    end() {
      i && (r(), i = !1);
    }
  };
}
function At(e, t, n) {
  let o = t(e, n), i = !0, l;
  const s = P;
  s.r += 1;
  function u() {
    const { delay: r = 0, duration: c = 300, easing: d = Ye, tick: a = L, css: f } = o || $e;
    f && (l = Ue(e, 1, 0, c, r, d, f));
    const g = Ke() + r, _ = g + c;
    K(() => fe(e, !1, "start")), Ge((E) => {
      if (i) {
        if (E >= _)
          return a(0, 1), fe(e, !1, "end"), --s.r || j(s.c), !1;
        if (E >= g) {
          const b = d((E - g) / c);
          a(1 - b, b);
        }
      }
      return i;
    });
  }
  return V(o) ? Ze().then(() => {
    o = o(), u();
  }) : u(), {
    end(r) {
      r && o.tick && o.tick(1, 0), i && (l && ge(e, l), i = !1);
    }
  };
}
function et(e) {
  e && e.c();
}
function ke(e, t, n, o) {
  const { fragment: i, after_update: l } = e.$$;
  i && i.m(t, n), o || K(() => {
    const s = e.$$.on_mount.map(Be).filter(V);
    e.$$.on_destroy ? e.$$.on_destroy.push(...s) : j(s), e.$$.on_mount = [];
  }), l.forEach(K);
}
function Le(e, t) {
  const n = e.$$;
  n.fragment !== null && (j(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Ht(e, t) {
  e.$$.dirty[0] === -1 && (Q.push(e), Ft(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function tt(e, t, n, o, i, l, s, u = [-1]) {
  const r = $;
  U(e);
  const c = e.$$ = {
    fragment: null,
    ctx: [],
    props: l,
    update: L,
    not_equal: i,
    bound: Te(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (r ? r.$$.context : [])),
    callbacks: Te(),
    dirty: u,
    skip_bound: !1,
    root: t.target || r.$$.root
  };
  s && s(c.root);
  let d = !1;
  if (c.ctx = n ? n(e, t.props || {}, (a, f, ...g) => {
    const _ = g.length ? g[0] : f;
    return c.ctx && i(c.ctx[a], c.ctx[a] = _) && (!c.skip_bound && c.bound[a] && c.bound[a](_), d && Ht(e, a)), f;
  }) : [], c.update(), d = !0, j(c.before_update), c.fragment = o ? o(c.ctx) : !1, t.target) {
    if (t.hydrate) {
      const a = pt(t.target);
      c.fragment && c.fragment.l(a), a.forEach(A);
    } else
      c.fragment && c.fragment.c();
    t.intro && x(e.$$.fragment), ke(e, t.target, t.anchor, t.customElement), Xe();
  }
  U(r);
}
class nt {
  $destroy() {
    Le(this, 1), this.$destroy = L;
  }
  $on(t, n) {
    if (!V(n))
      return L;
    const o = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return o.push(n), () => {
      const i = o.indexOf(n);
      i !== -1 && o.splice(i, 1);
    };
  }
  $set(t) {
    this.$$set && !gt(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const ve = window.requestAnimationFrame, Mt = window.cancelAnimationFrame, v = function(e, t, ...n) {
  if (typeof e == "function")
    return e.call(t, ...n);
}, ce = function(e) {
  return e === document.body || e === document;
}, zt = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(
  navigator.userAgent
), He = zt ? "touchstart" : "click", jt = /^h(\d)$/i;
let he = 0;
const qt = (e, t, n, o, i, l, s) => {
  i = i || "bitoc-heading-", l = l || "bitoc-ml-";
  let u = e.getAttribute("id");
  he = he + 1;
  let r = u;
  u || (u = i + he);
  const c = (e.textContent || "").trim();
  return {
    class: l + t,
    title: c,
    parent: o,
    target: e,
    level: t,
    oriLevel: n,
    id: u,
    oriId: r,
    y: X(e, s).y
  };
}, ot = function(e, t) {
  return e ? e.level === t ? e.parent : e.level === t - 1 ? e : ot(e.parent, t) : null;
}, It = (e, t, n, o) => {
  if (!e || !e.length)
    return { nodes: [], offsets: {} };
  const i = {}, l = [];
  let s = null;
  return e.forEach((u) => {
    let r = null;
    const c = jt.exec(u.nodeName);
    c ? r = c[1] : r = u.getAttribute("data-level"), r = parseInt(r), r = Math.max(1, Math.min(r, 6)) || 6;
    let d = r, a = null;
    s ? s.level >= r ? (a = ot(s.parent, r), d = a ? a.level + 1 : 1) : (d = s.level + 1, a = s) : (d = 1, a = null);
    const f = qt(
      u,
      d,
      r,
      a,
      t,
      n,
      o
    );
    a ? a.nodes ? a.nodes.push(f) : a.nodes = [f] : l.push(f), s = f, i[f.y] = f;
  }), { nodes: l, offsets: i };
}, Rt = function(e, t = 16) {
  let n, o = !1, i = Date.now();
  const l = () => {
    o = !0, n && Mt(n);
  }, s = () => {
    if (!o) {
      if (Date.now() - i >= t) {
        l(), v(e, this, n);
        return;
      }
      n = ve(s);
    }
  };
  return s(), l;
}, Yt = function(e, t = 24) {
  let n = null;
  return function() {
    const o = this, i = arguments, l = Date.now();
    (!n || l - n > t) && (e.apply(o, i), n = l);
  };
}, Bt = function(e, t, n) {
  (e <= 0 || isNaN(e)) && (e = 500);
  const o = Date.now();
  let i = !0;
  return ve(function l() {
    const s = (Date.now() - o) / e;
    v(t, void 0, s), s >= 1 && (t(1), i = !1, v(n, void 0, 1)), i && ve(l);
  }), function() {
    i = !1;
  };
}, it = function(e) {
  return e.scrollHeight > e.clientHeight;
}, X = function(e, t) {
  let n = t;
  (!t || ce(t)) && (n = document.documentElement);
  let o = e.offsetTop || 0, i = e.offsetLeft || 0;
  const l = e.offsetParent;
  if (ce(e) || !l)
    return { x: i, y: o };
  if (l === n.offsetParent) {
    const s = n.offsetTop || 0, u = n.offsetLeft || 0;
    return { x: i - u, y: o - s };
  }
  if (l !== n) {
    const s = X(l);
    o += s.y, i += s.x;
  }
  return { x: i, y: o };
}, ue = function(e) {
  return e === window ? e.screenY : e === document ? document.scrollingElement.scrollTop : e.scrollTop;
}, Wt = function(e, t, n) {
  if (t && !n)
    return window.getComputedStyle(e).getPropertyValue(t);
  e.style[t] = n;
}, lt = function(e) {
  return ce(e) ? document : !e || it(e) ? e : Wt(e, "position") === "fixed" || !e.parentElement ? document : lt(e.parentElement);
}, Me = (e, t, n, o) => {
  let i = 0;
  const l = o || 100;
  return function s(u, r, c) {
    if (ue(u) === r)
      i = 0, v(c);
    else {
      if (i > l) {
        i = 0, v(c);
        return;
      }
      i += 1, Rt(() => {
        s(u, r, c);
      });
    }
  }(e, t, n);
}, st = function(e, t, n = 200, o) {
  if (it(e)) {
    const i = ue(e), l = t - i;
    Bt(
      n,
      (s) => {
        e.scrollTo({
          left: 0,
          top: i + s * l,
          behavior: "smooth"
        });
      },
      o
    );
  } else
    v(o, void 0, 1);
};
function Kt(e) {
  const t = e - 1;
  return t * t * t + 1;
}
const ze = function(e, { delay: t = 0, duration: n = 150, easing: o = Kt } = {}) {
  const i = getComputedStyle(e), l = +i.opacity, s = parseFloat(i.height);
  return {
    delay: t,
    duration: n,
    easing: o,
    css: (u) => `opacity: ${Math.min(u * 20, 1) * l}; max-height: ${u * s}px;`
  };
}, R = [];
function rt(e, t = L) {
  let n;
  const o = /* @__PURE__ */ new Set();
  function i(u) {
    if (ye(e, u) && (e = u, n)) {
      const r = !R.length;
      for (const c of o)
        c[1](), R.push(c, e);
      if (r) {
        for (let c = 0; c < R.length; c += 2)
          R[c][0](R[c + 1]);
        R.length = 0;
      }
    }
  }
  function l(u) {
    i(u(e));
  }
  function s(u, r = L) {
    const c = [u, r];
    return o.add(c), o.size === 1 && (n = t(i) || L), u(e), () => {
      o.delete(c), o.size === 0 && (n(), n = null);
    };
  }
  return { set: i, update: l, subscribe: s };
}
const T = rt(0), Z = rt(null);
function je(e, t, n) {
  const o = e.slice();
  return o[18] = t[n], o;
}
function qe(e) {
  let t, n, o, i, l, s, u = e[0], r = [];
  for (let d = 0; d < u.length; d += 1)
    r[d] = Re(je(e, u, d));
  const c = (d) => H(r[d], 1, 1, () => {
    r[d] = null;
  });
  return {
    c() {
      t = W("div");
      for (let d = 0; d < r.length; d += 1)
        r[d].c();
      z(t, "class", "bitoc-nav");
    },
    m(d, a) {
      B(d, t, a);
      for (let f = 0; f < r.length; f += 1)
        r[f].m(t, null);
      i = !0, l || (s = [
        ee(t, "introstart", e[10]),
        ee(t, "introend", e[11]),
        ee(t, "outrostart", e[12]),
        ee(t, "outroend", e[13])
      ], l = !0);
    },
    p(d, a) {
      if (a & 495) {
        u = d[0];
        let f;
        for (f = 0; f < u.length; f += 1) {
          const g = je(d, u, f);
          r[f] ? (r[f].p(g, a), x(r[f], 1)) : (r[f] = Re(g), r[f].c(), x(r[f], 1), r[f].m(t, null));
        }
        for (Oe(), f = u.length; f < r.length; f += 1)
          c(f);
        xe();
      }
    },
    i(d) {
      if (!i) {
        for (let a = 0; a < u.length; a += 1)
          x(r[a]);
        K(() => {
          o && o.end(1), n = Pt(t, ze, {}), n.start();
        }), i = !0;
      }
    },
    o(d) {
      r = r.filter(Boolean);
      for (let a = 0; a < r.length; a += 1)
        H(r[a]);
      n && n.invalidate(), o = At(t, ze, {}), i = !1;
    },
    d(d) {
      d && A(t), Et(r, d), d && o && o.end(), l = !1, j(s);
    }
  };
}
function Ie(e) {
  let t, n;
  return t = new ft({
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
    m(o, i) {
      ke(t, o, i), n = !0;
    },
    p(o, i) {
      const l = {};
      i & 1 && (l.nodes = o[18].nodes), i & 1 && (l.parent = o[18]), i & 64 && (l.scrollOffset = o[6]), i & 32 && (l.onNav = o[5]), i & 2 && (l.scrollElement = o[1]), i & 4 && (l.scrollDuration = o[2]), i & 8 && (l.collapsedLevel = o[3]), i & 128 && (l.transitionEnd = o[7]), t.$set(l);
    },
    i(o) {
      n || (x(t.$$.fragment, o), n = !0);
    },
    o(o) {
      H(t.$$.fragment, o), n = !1;
    },
    d(o) {
      Le(t, o);
    }
  };
}
function Re(e) {
  let t, n = e[18].title + "", o, i, l, s, u, r, c, d, a, f = e[18].nodes && e[18].nodes.length && Ie(e);
  return {
    c() {
      t = W("a"), o = Se(n), u = wt(), f && f.c(), r = Qe(), z(t, "href", i = "#" + e[18].id), z(t, "class", l = e[18].class), Pe(t, "active", e[8] === e[18]);
    },
    m(g, _) {
      B(g, t, _), we(t, o), B(g, u, _), f && f.m(g, _), B(g, r, _), c = !0, d || (a = bt(s = e[9].call(null, t, e[18])), d = !0);
    },
    p(g, _) {
      e = g, (!c || _ & 1) && n !== (n = e[18].title + "") && St(o, n), (!c || _ & 1 && i !== (i = "#" + e[18].id)) && z(t, "href", i), (!c || _ & 1 && l !== (l = e[18].class)) && z(t, "class", l), s && V(s.update) && _ & 1 && s.update.call(null, e[18]), (!c || _ & 257) && Pe(t, "active", e[8] === e[18]), e[18].nodes && e[18].nodes.length ? f ? (f.p(e, _), _ & 1 && x(f, 1)) : (f = Ie(e), f.c(), x(f, 1), f.m(r.parentNode, r)) : f && (Oe(), H(f, 1, 1, () => {
        f = null;
      }), xe());
    },
    i(g) {
      c || (x(f), c = !0);
    },
    o(g) {
      H(f), c = !1;
    },
    d(g) {
      g && A(t), g && A(u), f && f.d(g), g && A(r), d = !1, a();
    }
  };
}
function Vt(e) {
  let t = !e[14](e[8], e[4]), n, o, i = t && qe(e);
  return {
    c() {
      i && i.c(), n = Qe();
    },
    m(l, s) {
      i && i.m(l, s), B(l, n, s), o = !0;
    },
    p(l, [s]) {
      s & 272 && (t = !l[14](l[8], l[4])), t ? i ? (i.p(l, s), s & 272 && x(i, 1)) : (i = qe(l), i.c(), x(i, 1), i.m(n.parentNode, n)) : i && (Oe(), H(i, 1, 1, () => {
        i = null;
      }), xe());
    },
    i(l) {
      o || (x(i), o = !0);
    },
    o(l) {
      H(i), o = !1;
    },
    d(l) {
      i && i.d(l), l && A(n);
    }
  };
}
function Gt(e, t, n) {
  let o, i;
  le(e, T, (h) => n(16, o = h)), le(e, Z, (h) => n(8, i = h));
  let { nodes: l = [] } = t, { scrollElement: s } = t, { scrollDuration: u } = t, { collapsedLevel: r } = t, { parent: c = null } = t, { onNav: d = null } = t, { scrollOffset: a = 0 } = t, { transitionStart: f = null } = t, { transitionEnd: g = null } = t;
  const _ = function(h, y) {
    y.element = h;
    let p = y;
    const q = function(k) {
      k.preventDefault(), N(Z, i = p, i);
      let M = s;
      s.scrollingElement && (M = s.scrollingElement);
      const I = p.y - a;
      N(T, o = o + 1, o), st(M, I, u, function() {
        if (typeof d != "function") {
          Me(M, I, () => {
            N(T, o = o - 1, o);
          });
          return;
        }
        d(k.target, p, function() {
          Me(M, I, () => {
            N(T, o = o - 1, o);
          });
        });
      });
    };
    return h.addEventListener(He, q), {
      update(k) {
        p = k, p.element = h;
      },
      destory() {
        y.element = null, p = null, h.removeEventListener(He, q);
      }
    };
  }, E = (h) => {
    N(T, o = o + 1, o), v(f, void 0, h);
  }, b = (h) => {
    N(T, o = o - 1, o), v(g, void 0, h);
  }, S = (h) => {
    N(T, o = o + 1, o), v(f, void 0, h);
  }, C = (h) => {
    N(T, o = o - 1, o), v(g, void 0, h);
  }, D = function(h, y) {
    return h && y ? h === y ? !0 : D(h.parent, y) : !1;
  }, ae = function(h, y) {
    return !h || !y ? !1 : y.level + 1 > r && !D(h, y);
  };
  return e.$$set = (h) => {
    "nodes" in h && n(0, l = h.nodes), "scrollElement" in h && n(1, s = h.scrollElement), "scrollDuration" in h && n(2, u = h.scrollDuration), "collapsedLevel" in h && n(3, r = h.collapsedLevel), "parent" in h && n(4, c = h.parent), "onNav" in h && n(5, d = h.onNav), "scrollOffset" in h && n(6, a = h.scrollOffset), "transitionStart" in h && n(15, f = h.transitionStart), "transitionEnd" in h && n(7, g = h.transitionEnd);
  }, [
    l,
    s,
    u,
    r,
    c,
    d,
    a,
    g,
    i,
    _,
    E,
    b,
    S,
    C,
    ae,
    f
  ];
}
class ft extends nt {
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
  let t, n, o, i;
  return o = new ft({
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
      t = W("main"), n = W("div"), et(o.$$.fragment), z(n, "class", "bitoc-navs svelte-f3ug8b"), z(t, "class", "bitoc svelte-f3ug8b");
    },
    m(l, s) {
      B(l, t, s), we(t, n), ke(o, n, null), e[20](t), i = !0;
    },
    p(l, s) {
      const u = {};
      s[0] & 4 && (u.scrollOffset = l[2]), s[0] & 1 && (u.collapsedLevel = l[0]), s[0] & 2 && (u.scrollDuration = l[1]), s[0] & 8 && (u.nodes = l[3]), o.$set(u);
    },
    i(l) {
      i || (x(o.$$.fragment, l), i = !0);
    },
    o(l) {
      H(o.$$.fragment, l), i = !1;
    },
    d(l) {
      l && A(t), Le(o), e[20](null);
    }
  };
}
function Ut(e, t, n) {
  let o, i;
  le(e, T, (m) => n(24, o = m)), le(e, Z, (m) => n(25, i = m));
  let { contentElement: l } = t, { scrollElement: s } = t, { fixedElement: u } = t, { headingSelector: r } = t, { collapsedLevel: c = 3 } = t, { idPrefix: d = "" } = t, { levelClassPrefix: a = "" } = t, { scrollDuration: f = 200 } = t, { fixedOffset: g = 0 } = t, { fixedClassName: _ = "bitoc-fixed" } = t, { scrollOffset: E = 0 } = t, { beforeFixed: b = null } = t, { afterFixed: S = null } = t;
  const C = function() {
    I(), G();
  }, D = function() {
    return h.length === 0;
  }, ae = function() {
    q = X(u || p, document.documentElement).y, G();
  };
  let h = [], y = {}, p = null, q = 0, k = lt(s), M = [];
  const I = function() {
    const m = l.querySelectorAll(r || "h1, h2, h3, h4, h5, h6"), O = It(m, d, a, k);
    n(3, h = O.nodes), y = O.offsets, M = Object.keys(y).map(Number);
    const w = De();
    y[w] && N(Z, i = y[w], i);
  }, De = function() {
    const m = ue(k);
    return M.find((O) => O >= m);
  }, ct = function(m) {
    if (D())
      return;
    const O = De(), w = y[O];
    if (O !== void 0 && w) {
      N(Z, i = w, i);
      const F = w.element;
      ut(F, m);
    } else
      v(m);
  }, ut = function(m, O) {
    if (D()) {
      v(O);
      return;
    }
    let w = p;
    if (m && w) {
      let F = X(m, w).y;
      const de = w.offsetHeight, Ce = w.scrollHeight - de, Fe = de / 2;
      F <= Fe ? F = 0 : F - de > Ce ? F = Ce : F = F - Fe, st(w, F, f, () => {
        v(O);
      });
    } else
      v(O);
  }, at = function() {
    if (!D() && g !== !1 && _ && ce(k)) {
      const m = u || p, O = ue(document);
      let w = g;
      if (w || (w = q), O >= w) {
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
    at(), o === 0 && ct();
  }, G = function() {
    mt();
  }, dt = () => {
    Ne();
  }, mt = Yt(Ne, 16);
  Nt(() => (q = X(u || p, document.documentElement).y, G(), k.addEventListener("scroll", G), () => {
    k.removeEventListener("scroll", G);
  }));
  function ht(m) {
    _e[m ? "unshift" : "push"](() => {
      p = m, n(4, p);
    });
  }
  return e.$$set = (m) => {
    "contentElement" in m && n(7, l = m.contentElement), "scrollElement" in m && n(8, s = m.scrollElement), "fixedElement" in m && n(9, u = m.fixedElement), "headingSelector" in m && n(10, r = m.headingSelector), "collapsedLevel" in m && n(0, c = m.collapsedLevel), "idPrefix" in m && n(11, d = m.idPrefix), "levelClassPrefix" in m && n(12, a = m.levelClassPrefix), "scrollDuration" in m && n(1, f = m.scrollDuration), "fixedOffset" in m && n(13, g = m.fixedOffset), "fixedClassName" in m && n(14, _ = m.fixedClassName), "scrollOffset" in m && n(2, E = m.scrollOffset), "beforeFixed" in m && n(15, b = m.beforeFixed), "afterFixed" in m && n(16, S = m.afterFixed);
  }, I(), [
    c,
    f,
    E,
    h,
    p,
    k,
    dt,
    l,
    s,
    u,
    r,
    d,
    a,
    g,
    _,
    b,
    S,
    C,
    D,
    ae,
    ht
  ];
}
class Xt extends nt {
  constructor(t) {
    super(), tt(
      this,
      t,
      Ut,
      Qt,
      ye,
      {
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
      },
      Jt,
      [-1, -1]
    );
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
      scrollSelector: i,
      fixedSelector: l,
      headingSelector: s,
      collapsedLevel: u,
      idPrefix: r,
      levelClassPrefix: c,
      scrollDuration: d,
      fixedOffset: a,
      fixedClassName: f,
      scrollOffset: g,
      beforeFixed: _,
      afterFixed: E
    } = n || {};
    t = ne(t, "mount");
    const b = ne(
      o,
      "contentSelector",
      document.body
    ), S = ne(
      i,
      "scrollSelector",
      document.body
    ), C = ne(l, "fixedSelector", null, !0);
    this.toc = new Xt({
      target: t,
      props: {
        contentElement: b,
        scrollElement: S,
        fixedElement: C,
        headingSelector: s,
        collapsedLevel: Math.max(1, Math.min(u, 6)) || 3,
        idPrefix: r,
        levelClassPrefix: c,
        scrollDuration: d,
        fixedOffset: a,
        fixedClassName: f,
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
