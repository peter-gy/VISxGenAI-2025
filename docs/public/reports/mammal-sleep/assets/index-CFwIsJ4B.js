const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f || (m.f = ["./inputs-DoHVubAa.js", "./inputs-Cuu9vI3M.css"]),
) => i.map((i) => d[i]);
(function () {
	const t = document.createElement("link").relList;
	if (t && t.supports && t.supports("modulepreload")) return;
	for (const o of document.querySelectorAll('link[rel="modulepreload"]')) i(o);
	new MutationObserver((o) => {
		for (const r of o)
			if (r.type === "childList")
				for (const a of r.addedNodes)
					a.tagName === "LINK" && a.rel === "modulepreload" && i(a);
	}).observe(document, { childList: !0, subtree: !0 });
	function n(o) {
		const r = {};
		return (
			o.integrity && (r.integrity = o.integrity),
			o.referrerPolicy && (r.referrerPolicy = o.referrerPolicy),
			o.crossOrigin === "use-credentials"
				? (r.credentials = "include")
				: o.crossOrigin === "anonymous"
					? (r.credentials = "omit")
					: (r.credentials = "same-origin"),
			r
		);
	}
	function i(o) {
		if (o.ep) return;
		o.ep = !0;
		const r = n(o);
		fetch(o.href, r);
	}
})();
const ut = "modulepreload",
	gt = function (e, t) {
		return new URL(e, t).href;
	},
	Ye = {},
	p = function (t, n, i) {
		let o = Promise.resolve();
		if (n && n.length > 0) {
			let s = function (d) {
				return Promise.all(
					d.map((u) =>
						Promise.resolve(u).then(
							(g) => ({ status: "fulfilled", value: g }),
							(g) => ({ status: "rejected", reason: g }),
						),
					),
				);
			};
			const a = document.getElementsByTagName("link"),
				l = document.querySelector("meta[property=csp-nonce]"),
				c = l?.nonce || l?.getAttribute("nonce");
			o = s(
				n.map((d) => {
					if (((d = gt(d, i)), d in Ye)) return;
					Ye[d] = !0;
					const u = d.endsWith(".css"),
						g = u ? '[rel="stylesheet"]' : "";
					if (!!i)
						for (let G = a.length - 1; G >= 0; G--) {
							const _ = a[G];
							if (_.href === d && (!u || _.rel === "stylesheet")) return;
						}
					else if (document.querySelector(`link[href="${d}"]${g}`)) return;
					const C = document.createElement("link");
					if (
						((C.rel = u ? "stylesheet" : ut),
						u || (C.as = "script"),
						(C.crossOrigin = ""),
						(C.href = d),
						c && C.setAttribute("nonce", c),
						document.head.appendChild(C),
						u)
					)
						return new Promise((G, _) => {
							C.addEventListener("load", G),
								C.addEventListener("error", () =>
									_(new Error(`Unable to preload CSS for ${d}`)),
								);
						});
				}),
			);
		}
		function r(a) {
			const l = new Event("vite:preloadError", { cancelable: !0 });
			if (((l.payload = a), window.dispatchEvent(l), !l.defaultPrevented))
				throw a;
		}
		return o.then((a) => {
			for (const l of a || []) l.status === "rejected" && r(l.reason);
			return t().catch(r);
		});
	};
function ae(e, t, n) {
	n = n || {};
	var i = e.ownerDocument,
		o = i.defaultView.CustomEvent;
	typeof o == "function"
		? (o = new o(t, { detail: n }))
		: ((o = i.createEvent("Event")), o.initEvent(t, !1, !1), (o.detail = n)),
		e.dispatchEvent(o);
}
function Te(e) {
	return (
		Array.isArray(e) ||
		e instanceof Int8Array ||
		e instanceof Int16Array ||
		e instanceof Int32Array ||
		e instanceof Uint8Array ||
		e instanceof Uint8ClampedArray ||
		e instanceof Uint16Array ||
		e instanceof Uint32Array ||
		e instanceof Float32Array ||
		e instanceof Float64Array
	);
}
function Le(e) {
	return e === (e | 0) + "";
}
function B(e) {
	const t = document.createElement("span");
	return (
		(t.className = "observablehq--cellname"), (t.textContent = `${e} = `), t
	);
}
const It = Symbol.prototype.toString;
function T(e) {
	return It.call(e);
}
const {
		getOwnPropertySymbols: mt,
		prototype: { hasOwnProperty: pt },
	} = Object,
	{ toStringTag: Ct } = Symbol,
	ze = {},
	q = mt;
function ge(e, t) {
	return pt.call(e, t);
}
function be(e) {
	return e[Ct] || (e.constructor && e.constructor.name) || "Object";
}
function w(e, t) {
	try {
		const n = e[t];
		return n && n.constructor, n;
	} catch {
		return ze;
	}
}
const bt = [
	{ symbol: "@@__IMMUTABLE_INDEXED__@@", name: "Indexed", modifier: !0 },
	{ symbol: "@@__IMMUTABLE_KEYED__@@", name: "Keyed", modifier: !0 },
	{ symbol: "@@__IMMUTABLE_LIST__@@", name: "List", arrayish: !0 },
	{ symbol: "@@__IMMUTABLE_MAP__@@", name: "Map" },
	{
		symbol: "@@__IMMUTABLE_ORDERED__@@",
		name: "Ordered",
		modifier: !0,
		prefix: !0,
	},
	{ symbol: "@@__IMMUTABLE_RECORD__@@", name: "Record" },
	{ symbol: "@@__IMMUTABLE_SET__@@", name: "Set", arrayish: !0, setish: !0 },
	{ symbol: "@@__IMMUTABLE_STACK__@@", name: "Stack", arrayish: !0 },
];
function je(e) {
	try {
		let t = bt.filter(({ symbol: a }) => e[a] === !0);
		if (!t.length) return;
		const n = t.find((a) => !a.modifier),
			i = n.name === "Map" && t.find((a) => a.modifier && a.prefix),
			o = t.some((a) => a.arrayish),
			r = t.some((a) => a.setish);
		return {
			name: `${i ? i.name : ""}${n.name}`,
			symbols: t,
			arrayish: o && !r,
			setish: r,
		};
	} catch {
		return null;
	}
}
const { getPrototypeOf: _e, getOwnPropertyDescriptors: ft } = Object,
	Pe = _e({});
function Qe(e, t, n, i) {
	let o = Te(e),
		r,
		a,
		l,
		c;
	e instanceof Map
		? e instanceof e.constructor
			? ((r = `Map(${e.size})`), (a = ht))
			: ((r = "Map()"), (a = U))
		: e instanceof Set
			? e instanceof e.constructor
				? ((r = `Set(${e.size})`), (a = At))
				: ((r = "Set()"), (a = U))
			: o
				? ((r = `${e.constructor.name}(${e.length})`), (a = _t))
				: (c = je(e))
					? ((r = `Immutable.${c.name}${c.name === "Record" ? "" : `(${e.size})`}`),
						(o = c.arrayish),
						(a = c.arrayish ? yt : c.setish ? Zt : Wt))
					: i
						? ((r = be(e)), (a = Gt))
						: ((r = be(e)), (a = U));
	const s = document.createElement("span");
	(s.className = "observablehq--expanded"), n && s.appendChild(B(n));
	const d = s.appendChild(document.createElement("a"));
	(d.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M4 7L0 1h8z' fill='currentColor' />
  </svg>`),
		d.appendChild(document.createTextNode(`${r}${o ? " [" : " {"}`)),
		d.addEventListener("mouseup", function (u) {
			u.stopPropagation(), se(s, ye(e, null, n, i));
		}),
		(a = a(e));
	for (let u = 0; !(l = a.next()).done && u < 20; ++u) s.appendChild(l.value);
	if (!l.done) {
		const u = s.appendChild(document.createElement("a"));
		(u.className = "observablehq--field"),
			(u.style.display = "block"),
			u.appendChild(document.createTextNode("  … more")),
			u.addEventListener("mouseup", function (g) {
				g.stopPropagation(),
					s.insertBefore(l.value, s.lastChild.previousSibling);
				for (let h = 0; !(l = a.next()).done && h < 19; ++h)
					s.insertBefore(l.value, s.lastChild.previousSibling);
				l.done && s.removeChild(s.lastChild.previousSibling), ae(s, "load");
			});
	}
	return s.appendChild(document.createTextNode(o ? "]" : "}")), s;
}
function* ht(e) {
	for (const [t, n] of e) yield wt(t, n);
	yield* U(e);
}
function* At(e) {
	for (const t of e) yield Me(t);
	yield* U(e);
}
function* Zt(e) {
	for (const t of e) yield Me(t);
}
function* _t(e) {
	for (let t = 0, n = e.length; t < n; ++t)
		t in e && (yield X(t, w(e, t), "observablehq--index"));
	for (const t in e)
		!Le(t) && ge(e, t) && (yield X(t, w(e, t), "observablehq--key"));
	for (const t of q(e)) yield X(T(t), w(e, t), "observablehq--symbol");
}
function* yt(e) {
	let t = 0;
	for (const n = e.size; t < n; ++t) yield X(t, e.get(t), !0);
}
function* Gt(e) {
	for (const n in ft(e)) yield X(n, w(e, n), "observablehq--key");
	for (const n of q(e)) yield X(T(n), w(e, n), "observablehq--symbol");
	const t = _e(e);
	t && t !== Pe && (yield Ue(t));
}
function* U(e) {
	for (const n in e) ge(e, n) && (yield X(n, w(e, n), "observablehq--key"));
	for (const n of q(e)) yield X(T(n), w(e, n), "observablehq--symbol");
	const t = _e(e);
	t && t !== Pe && (yield Ue(t));
}
function* Wt(e) {
	for (const [t, n] of e) yield X(t, n, "observablehq--key");
}
function Ue(e) {
	const t = document.createElement("div"),
		n = t.appendChild(document.createElement("span"));
	return (
		(t.className = "observablehq--field"),
		(n.className = "observablehq--prototype-key"),
		(n.textContent = "  <prototype>"),
		t.appendChild(document.createTextNode(": ")),
		t.appendChild(W(e, void 0, void 0, void 0, !0)),
		t
	);
}
function X(e, t, n) {
	const i = document.createElement("div"),
		o = i.appendChild(document.createElement("span"));
	return (
		(i.className = "observablehq--field"),
		(o.className = n),
		(o.textContent = `  ${e}`),
		i.appendChild(document.createTextNode(": ")),
		i.appendChild(W(t)),
		i
	);
}
function wt(e, t) {
	const n = document.createElement("div");
	return (
		(n.className = "observablehq--field"),
		n.appendChild(document.createTextNode("  ")),
		n.appendChild(W(e)),
		n.appendChild(document.createTextNode(" => ")),
		n.appendChild(W(t)),
		n
	);
}
function Me(e) {
	const t = document.createElement("div");
	return (
		(t.className = "observablehq--field"),
		t.appendChild(document.createTextNode("  ")),
		t.appendChild(W(e)),
		t
	);
}
function Ne(e) {
	const t = window.getSelection();
	return (
		t.type === "Range" &&
		(t.containsNode(e, !0) ||
			e.contains(t.anchorNode) ||
			e.contains(t.focusNode))
	);
}
function ye(e, t, n, i) {
	let o = Te(e),
		r,
		a,
		l,
		c;
	if (
		(e instanceof Map
			? e instanceof e.constructor
				? ((r = `Map(${e.size})`), (a = vt))
				: ((r = "Map()"), (a = M))
			: e instanceof Set
				? e instanceof e.constructor
					? ((r = `Set(${e.size})`), (a = Vt))
					: ((r = "Set()"), (a = M))
				: o
					? ((r = `${e.constructor.name}(${e.length})`), (a = Xt))
					: (c = je(e))
						? ((r = `Immutable.${c.name}${c.name === "Record" ? "" : `(${e.size})`}`),
							(o = c.arrayish),
							(a = c.arrayish ? Rt : c.setish ? Bt : Ft))
						: ((r = be(e)), (a = M)),
		t)
	) {
		const u = document.createElement("span");
		return (
			(u.className = "observablehq--shallow"),
			n && u.appendChild(B(n)),
			u.appendChild(document.createTextNode(r)),
			u.addEventListener("mouseup", function (g) {
				Ne(u) || (g.stopPropagation(), se(u, ye(e)));
			}),
			u
		);
	}
	const s = document.createElement("span");
	(s.className = "observablehq--collapsed"), n && s.appendChild(B(n));
	const d = s.appendChild(document.createElement("a"));
	(d.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`),
		d.appendChild(document.createTextNode(`${r}${o ? " [" : " {"}`)),
		s.addEventListener(
			"mouseup",
			function (u) {
				Ne(s) || (u.stopPropagation(), se(s, Qe(e, null, n, i)));
			},
			!0,
		),
		(a = a(e));
	for (let u = 0; !(l = a.next()).done && u < 20; ++u)
		u > 0 && s.appendChild(document.createTextNode(", ")),
			s.appendChild(l.value);
	return (
		l.done || s.appendChild(document.createTextNode(", …")),
		s.appendChild(document.createTextNode(o ? "]" : "}")),
		s
	);
}
function* vt(e) {
	for (const [t, n] of e) yield Yt(t, n);
	yield* M(e);
}
function* Vt(e) {
	for (const t of e) yield W(t, !0);
	yield* M(e);
}
function* Bt(e) {
	for (const t of e) yield W(t, !0);
}
function* Rt(e) {
	let t = -1,
		n = 0;
	for (const i = e.size; n < i; ++n)
		n > t + 1 && (yield le(n - t - 1)), yield W(e.get(n), !0), (t = n);
	n > t + 1 && (yield le(n - t - 1));
}
function* Xt(e) {
	let t = -1,
		n = 0;
	for (const i = e.length; n < i; ++n)
		n in e &&
			(n > t + 1 && (yield le(n - t - 1)), yield W(w(e, n), !0), (t = n));
	n > t + 1 && (yield le(n - t - 1));
	for (const i in e)
		!Le(i) && ge(e, i) && (yield D(i, w(e, i), "observablehq--key"));
	for (const i of q(e)) yield D(T(i), w(e, i), "observablehq--symbol");
}
function* M(e) {
	for (const t in e) ge(e, t) && (yield D(t, w(e, t), "observablehq--key"));
	for (const t of q(e)) yield D(T(t), w(e, t), "observablehq--symbol");
}
function* Ft(e) {
	for (const [t, n] of e) yield D(t, n, "observablehq--key");
}
function le(e) {
	const t = document.createElement("span");
	return (
		(t.className = "observablehq--empty"),
		(t.textContent = e === 1 ? "empty" : `empty × ${e}`),
		t
	);
}
function D(e, t, n) {
	const i = document.createDocumentFragment(),
		o = i.appendChild(document.createElement("span"));
	return (
		(o.className = n),
		(o.textContent = e),
		i.appendChild(document.createTextNode(": ")),
		i.appendChild(W(t, !0)),
		i
	);
}
function Yt(e, t) {
	const n = document.createDocumentFragment();
	return (
		n.appendChild(W(e, !0)),
		n.appendChild(document.createTextNode(" => ")),
		n.appendChild(W(t, !0)),
		n
	);
}
function Nt(e, t) {
	if ((e instanceof Date || (e = new Date(+e)), isNaN(e)))
		return typeof t == "function" ? t(e) : t;
	const n = e.getUTCHours(),
		i = e.getUTCMinutes(),
		o = e.getUTCSeconds(),
		r = e.getUTCMilliseconds();
	return `${kt(e.getUTCFullYear())}-${R(e.getUTCMonth() + 1, 2)}-${R(e.getUTCDate(), 2)}${n || i || o || r ? `T${R(n, 2)}:${R(i, 2)}${o || r ? `:${R(o, 2)}${r ? `.${R(r, 3)}` : ""}` : ""}Z` : ""}`;
}
function kt(e) {
	return e < 0 ? `-${R(-e, 6)}` : e > 9999 ? `+${R(e, 6)}` : R(e, 4);
}
function R(e, t) {
	return `${e}`.padStart(t, "0");
}
function Ht(e) {
	return Nt(e, "Invalid Date");
}
var Et = Error.prototype.toString;
function St(e) {
	return e.stack || Et.call(e);
}
var xt = RegExp.prototype.toString;
function Kt(e) {
	return xt.call(e);
}
const pe = 20;
function Jt(e, t, n, i) {
	if (t === !1) {
		if (He(e, /["\n]/g) <= He(e, /`|\${/g)) {
			const s = document.createElement("span");
			i && s.appendChild(B(i));
			const d = s.appendChild(document.createElement("span"));
			return (
				(d.className = "observablehq--string"),
				(d.textContent = JSON.stringify(e)),
				s
			);
		}
		const a = e.split(`
`);
		if (a.length > pe && !n) {
			const s = document.createElement("div");
			i && s.appendChild(B(i));
			const d = s.appendChild(document.createElement("span"));
			(d.className = "observablehq--string"),
				(d.textContent =
					"`" +
					ke(
						a.slice(0, pe).join(`
`),
					));
			const u = s.appendChild(document.createElement("span")),
				g = a.length - pe;
			return (
				(u.textContent = `Show ${g} truncated line${g > 1 ? "s" : ""}`),
				(u.className = "observablehq--string-expand"),
				u.addEventListener("mouseup", function (h) {
					h.stopPropagation(), se(s, W(e, t, !0, i));
				}),
				s
			);
		}
		const l = document.createElement("span");
		i && l.appendChild(B(i));
		const c = l.appendChild(document.createElement("span"));
		return (
			(c.className = `observablehq--string${n ? " observablehq--expanded" : ""}`),
			(c.textContent = "`" + ke(e) + "`"),
			l
		);
	}
	const o = document.createElement("span");
	i && o.appendChild(B(i));
	const r = o.appendChild(document.createElement("span"));
	return (
		(r.className = "observablehq--string"),
		(r.textContent = JSON.stringify(
			e.length > 100 ? `${e.slice(0, 50)}…${e.slice(-49)}` : e,
		)),
		o
	);
}
function ke(e) {
	return e.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, Tt);
}
function Tt(e) {
	var t = e.charCodeAt(0);
	switch (t) {
		case 8:
			return "\\b";
		case 9:
			return "\\t";
		case 11:
			return "\\v";
		case 12:
			return "\\f";
		case 13:
			return "\\r";
	}
	return t < 16
		? "\\x0" + t.toString(16)
		: t < 32
			? "\\x" + t.toString(16)
			: "\\" + e;
}
function He(e, t) {
	for (var n = 0; t.exec(e); ) ++n;
	return n;
}
var Lt = Function.prototype.toString,
	zt = { prefix: "async ƒ" },
	jt = { prefix: "async ƒ*" },
	Ee = { prefix: "class" },
	Pt = { prefix: "ƒ" },
	Qt = { prefix: "ƒ*" };
function Ut(e, t) {
	var n,
		i,
		o = Lt.call(e);
	switch (e.constructor && e.constructor.name) {
		case "AsyncFunction":
			n = zt;
			break;
		case "AsyncGeneratorFunction":
			n = jt;
			break;
		case "GeneratorFunction":
			n = Qt;
			break;
		default:
			n = /^class\b/.test(o) ? Ee : Pt;
			break;
	}
	return n === Ee
		? Q(n, "", t)
		: (i = /^(?:async\s*)?(\w+)\s*=>/.exec(o))
			? Q(n, "(" + i[1] + ")", t)
			: (i = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(o))
				? Q(n, i[1] ? "(" + i[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t)
				: (i =
							/^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(
								o,
							))
					? Q(n, i[1] ? "(" + i[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t)
					: Q(n, "(…)", t);
}
function Q(e, t, n) {
	var i = document.createElement("span");
	(i.className = "observablehq--function"), n && i.appendChild(B(n));
	var o = i.appendChild(document.createElement("span"));
	return (
		(o.className = "observablehq--keyword"),
		(o.textContent = e.prefix),
		i.appendChild(document.createTextNode(t)),
		i
	);
}
const {
	prototype: { toString: Mt },
} = Object;
function W(e, t, n, i, o) {
	let r = typeof e;
	switch (r) {
		case "boolean":
		case "undefined": {
			e += "";
			break;
		}
		case "number": {
			e = e === 0 && 1 / e < 0 ? "-0" : e + "";
			break;
		}
		case "bigint": {
			e = e + "n";
			break;
		}
		case "symbol": {
			e = T(e);
			break;
		}
		case "function":
			return Ut(e, i);
		case "string":
			return Jt(e, t, n, i);
		default: {
			if (e === null) {
				(r = null), (e = "null");
				break;
			}
			if (e instanceof Date) {
				(r = "date"), (e = Ht(e));
				break;
			}
			if (e === ze) {
				(r = "forbidden"), (e = "[forbidden]");
				break;
			}
			switch (Mt.call(e)) {
				case "[object RegExp]": {
					(r = "regexp"), (e = Kt(e));
					break;
				}
				case "[object Error]":
				case "[object DOMException]": {
					(r = "error"), (e = St(e));
					break;
				}
				default:
					return (n ? Qe : ye)(e, t, i, o);
			}
			break;
		}
	}
	const a = document.createElement("span");
	i && a.appendChild(B(i));
	const l = a.appendChild(document.createElement("span"));
	return (l.className = `observablehq--${r}`), (l.textContent = e), a;
}
function se(e, t) {
	e.classList.contains("observablehq--inspect") &&
		t.classList.add("observablehq--inspect"),
		e.parentNode.replaceChild(t, e),
		ae(t, "load");
}
const Ot = /\s+\(\d+:\d+\)$/m;
class ce {
	constructor(t) {
		if (!t) throw new Error("invalid node");
		(this._node = t), t.classList.add("observablehq");
	}
	pending() {
		const { _node: t } = this;
		t.classList.remove("observablehq--error"),
			t.classList.add("observablehq--running");
	}
	fulfilled(t, n) {
		const { _node: i } = this;
		if (
			((!Dt(t) || (t.parentNode && t.parentNode !== i)) &&
				((t = W(
					t,
					!1,
					i.firstChild &&
						i.firstChild.classList &&
						i.firstChild.classList.contains("observablehq--expanded"),
					n,
				)),
				t.classList.add("observablehq--inspect")),
			i.classList.remove("observablehq--running", "observablehq--error"),
			i.firstChild !== t)
		)
			if (i.firstChild) {
				for (; i.lastChild !== i.firstChild; ) i.removeChild(i.lastChild);
				i.replaceChild(t, i.firstChild);
			} else i.appendChild(t);
		ae(i, "update");
	}
	rejected(t, n) {
		const { _node: i } = this;
		for (
			i.classList.remove("observablehq--running"),
				i.classList.add("observablehq--error");
			i.lastChild;
		)
			i.removeChild(i.lastChild);
		var o = document.createElement("div");
		(o.className = "observablehq--inspect"),
			n && o.appendChild(B(n)),
			o.appendChild(document.createTextNode((t + "").replace(Ot, ""))),
			i.appendChild(o),
			ae(i, "error", { error: t });
	}
}
ce.into = function (e) {
	if (typeof e == "string" && ((e = document.querySelector(e)), e == null))
		throw new Error("container not found");
	return function () {
		return new ce(e.appendChild(document.createElement("div")));
	};
};
function Dt(e) {
	return (
		(e instanceof Element || e instanceof Text) && e instanceof e.constructor
	);
}
function $t(e, t) {
	const n = document.createElement("div");
	if ((new ce(n).fulfilled(e), t))
		for (const i of t) {
			let o = n;
			for (const r of i) o = o?.childNodes[r];
			o?.dispatchEvent(new Event("mouseup"));
		}
	return n;
}
function qt(e) {
	const t = document.createElement("div");
	return new ce(t).rejected(e), t;
}
function en(e) {
	if (!nn(e)) return;
	const t = e.querySelectorAll(".observablehq--expanded");
	if (t.length) return Array.from(t, (n) => on(e, n));
}
function tn(e) {
	return e.nodeType === 1;
}
function nn(e) {
	return tn(e) && e.classList.contains("observablehq");
}
function on(e, t) {
	const n = [];
	for (; t !== e; ) n.push(rn(t)), (t = t.parentNode);
	return n.reverse();
}
function rn(e) {
	return Array.prototype.indexOf.call(e.parentNode.childNodes, e);
}
const an = [
		"audio source[src]",
		"audio[src]",
		"img[src]",
		"picture source[src]",
		"video source[src]",
		"video[src]",
	].join(),
	ln = ["img[srcset]", "picture source[srcset]"].join(),
	sn = ["a[href][download]", "link[href]"].join(),
	cn = [
		[an, "src"],
		[ln, "srcset"],
		[sn, "href"],
	];
function dn(e, t) {
	const n = (i) => t.get(In(i)) ?? i;
	for (const [i, o] of cn)
		for (const r of e.querySelectorAll(i)) {
			if (un(r)) continue;
			const a = decodeURI(r.getAttribute(o));
			o === "srcset" ? r.setAttribute(o, pn(a, n)) : r.setAttribute(o, n(a));
		}
}
function un(e) {
	return /(?:^|\s)external(?:\s|$)/i.test(e.getAttribute("rel") ?? "");
}
function gn(e) {
	const t = e.indexOf("?"),
		n = e.indexOf("#"),
		i = t >= 0 && n >= 0 ? Math.min(t, n) : t >= 0 ? t : n;
	return i >= 0 ? e.slice(0, i) : e;
}
function In(e) {
	const t = gn(e);
	return mn(t) ? t : `./${t}`;
}
function mn(e) {
	return ["./", "../", "/"].some((t) => e.startsWith(t));
}
function pn(e, t) {
	return e
		.trim()
		.split(/\s*,\s*/)
		.filter((n) => n)
		.map((n) => {
			const i = n.split(/\s+/),
				o = t(i[0]);
			return o && (i[0] = encodeURI(o)), i.join(" ");
		})
		.join(", ");
}
function Oe(e, t) {
	const { root: n, expanded: i } = e,
		o = bn(t, n) ? t : $t(t, i[n.childNodes.length]);
	De(e, o);
}
function De(e, t) {
	if (t.nodeType === 11) {
		let n;
		for (; (n = t.firstChild); ) e.root.appendChild(n);
	} else e.root.appendChild(t);
}
function Cn(e, t) {
	De(e, qt(t));
}
function bn(e, t) {
	return (
		(e instanceof Element || e instanceof Text) &&
		e instanceof e.constructor &&
		(!e.parentNode || t.contains(e))
	);
}
function O(e) {
	for (e.expanded = Array.from(e.root.childNodes, en); e.root.lastChild; )
		e.root.lastChild.remove();
}
function fn(e, { autodisplay: t, assets: n }) {
	return {
		_error: !1,
		_node: e.root,
		pending() {
			this._error && ((this._error = !1), O(e));
		},
		fulfilled(i) {
			t && (O(e), n && i instanceof Element && dn(i, n), Oe(e, i));
		},
		rejected(i) {
			console.error(i), (this._error = !0), O(e), Cn(e, i);
		},
	};
}
class F extends Error {
	constructor(t, n) {
		super(t), (this.input = n);
	}
}
F.prototype.name = "RuntimeError";
function hn(e) {
	return e && typeof e.next == "function" && typeof e.return == "function";
}
function fe(e) {
	return () => e;
}
function de(e) {
	return e;
}
function An(e) {
	return () => {
		throw e;
	};
}
const Zn = Array.prototype,
	_n = Zn.map;
function N() {}
const Ge = 1,
	ee = 2,
	oe = 3,
	$ = Symbol("no-observer"),
	yn = Promise.resolve();
function H(e, t, n, i) {
	n || (n = $),
		Object.defineProperties(this, {
			_observer: { value: n, writable: !0 },
			_definition: { value: We, writable: !0 },
			_duplicate: { value: void 0, writable: !0 },
			_duplicates: { value: void 0, writable: !0 },
			_indegree: { value: NaN, writable: !0 },
			_inputs: { value: [], writable: !0 },
			_invalidate: { value: N, writable: !0 },
			_module: { value: t },
			_name: { value: null, writable: !0 },
			_outputs: { value: new Set(), writable: !0 },
			_promise: { value: yn, writable: !0 },
			_reachable: { value: n !== $, writable: !0 },
			_rejector: { value: vn(this) },
			_shadow: { value: Gn(t, i) },
			_type: { value: e },
			_value: { value: void 0, writable: !0 },
			_version: { value: 0, writable: !0 },
		});
}
Object.defineProperties(H.prototype, {
	_pending: { value: Fn, writable: !0, configurable: !0 },
	_fulfilled: { value: Yn, writable: !0, configurable: !0 },
	_rejected: { value: Nn, writable: !0, configurable: !0 },
	_resolve: { value: Bn, writable: !0, configurable: !0 },
	define: { value: Vn, writable: !0, configurable: !0 },
	delete: { value: Xn, writable: !0, configurable: !0 },
	import: { value: Rn, writable: !0, configurable: !0 },
});
function Gn(e, t) {
	return t?.shadow
		? new Map(
				Object.entries(t.shadow).map(([n, i]) => [
					n,
					new H(ee, e).define([], i),
				]),
			)
		: null;
}
function Wn(e) {
	e._module._runtime._dirty.add(e), e._outputs.add(this);
}
function wn(e) {
	e._module._runtime._dirty.add(e), e._outputs.delete(this);
}
function We() {
	throw We;
}
function Y() {
	throw Y;
}
function vn(e) {
	return (t) => {
		throw t === Y
			? t
			: t === We
				? new F(`${e._name} is not defined`, e._name)
				: t instanceof Error && t.message
					? new F(t.message, e._name)
					: new F(`${e._name} could not be resolved`, e._name);
	};
}
function Se(e) {
	return () => {
		throw new F(`${e} is defined more than once`);
	};
}
function Vn(e, t, n) {
	switch (arguments.length) {
		case 1: {
			(n = e), (e = t = null);
			break;
		}
		case 2: {
			(n = t), typeof e == "string" ? (t = null) : ((t = e), (e = null));
			break;
		}
	}
	return we.call(
		this,
		e == null ? null : String(e),
		t == null ? [] : _n.call(t, this._resolve, this),
		typeof n == "function" ? n : fe(n),
	);
}
function Bn(e) {
	return this._shadow?.get(e) ?? this._module._resolve(e);
}
function we(e, t, n) {
	const i = this._module._scope,
		o = this._module._runtime;
	if (
		(this._inputs.forEach(wn, this),
		t.forEach(Wn, this),
		(this._inputs = t),
		(this._definition = n),
		(this._value = void 0),
		n === N ? o._variables.delete(this) : o._variables.add(this),
		e !== this._name || i.get(e) !== this)
	) {
		let r, a;
		if (this._name)
			if (this._outputs.size)
				i.delete(this._name),
					(a = this._module._resolve(this._name)),
					(a._outputs = this._outputs),
					(this._outputs = new Set()),
					a._outputs.forEach(function (l) {
						l._inputs[l._inputs.indexOf(this)] = a;
					}, this),
					a._outputs.forEach(o._updates.add, o._updates),
					o._dirty.add(a).add(this),
					i.set(this._name, a);
			else if ((a = i.get(this._name)) === this) i.delete(this._name);
			else if (a._type === oe)
				a._duplicates.delete(this),
					(this._duplicate = void 0),
					a._duplicates.size === 1 &&
						((a = a._duplicates.keys().next().value),
						(r = i.get(this._name)),
						(a._outputs = r._outputs),
						(r._outputs = new Set()),
						a._outputs.forEach(function (l) {
							l._inputs[l._inputs.indexOf(r)] = a;
						}),
						(a._definition = a._duplicate),
						(a._duplicate = void 0),
						o._dirty.add(r).add(a),
						o._updates.add(a),
						i.set(this._name, a));
			else throw new Error();
		if (this._outputs.size) throw new Error();
		e &&
			((a = i.get(e))
				? a._type === oe
					? ((this._definition = Se(e)),
						(this._duplicate = n),
						a._duplicates.add(this))
					: a._type === ee
						? ((this._outputs = a._outputs),
							(a._outputs = new Set()),
							this._outputs.forEach(function (l) {
								l._inputs[l._inputs.indexOf(a)] = this;
							}, this),
							o._dirty.add(a).add(this),
							i.set(e, this))
						: ((a._duplicate = a._definition),
							(this._duplicate = n),
							(r = new H(oe, this._module)),
							(r._name = e),
							(r._definition = this._definition = a._definition = Se(e)),
							(r._outputs = a._outputs),
							(a._outputs = new Set()),
							r._outputs.forEach(function (l) {
								l._inputs[l._inputs.indexOf(a)] = r;
							}),
							(r._duplicates = new Set([this, a])),
							o._dirty.add(a).add(r),
							o._updates.add(a).add(r),
							i.set(e, r))
				: i.set(e, this)),
			(this._name = e);
	}
	return (
		this._version > 0 && ++this._version,
		o._updates.add(this),
		o._compute(),
		this
	);
}
function Rn(e, t, n) {
	return (
		arguments.length < 3 && ((n = t), (t = e)),
		we.call(this, String(t), [n._resolve(String(e))], de)
	);
}
function Xn() {
	return we.call(this, null, [], N);
}
function Fn() {
	this._observer.pending && this._observer.pending();
}
function Yn(e) {
	this._observer.fulfilled && this._observer.fulfilled(e, this._name);
}
function Nn(e) {
	this._observer.rejected && this._observer.rejected(e, this._name);
}
const $e = Symbol("variable"),
	qe = Symbol("invalidation"),
	et = Symbol("visibility");
function ue(e, t = []) {
	Object.defineProperties(this, {
		_runtime: { value: e },
		_scope: { value: new Map() },
		_builtins: {
			value: new Map([
				["@variable", $e],
				["invalidation", qe],
				["visibility", et],
				...t,
			]),
		},
		_source: { value: null, writable: !0 },
	});
}
Object.defineProperties(ue.prototype, {
	_resolve: { value: Jn, writable: !0, configurable: !0 },
	redefine: { value: kn, writable: !0, configurable: !0 },
	define: { value: Hn, writable: !0, configurable: !0 },
	derive: { value: Kn, writable: !0, configurable: !0 },
	import: { value: En, writable: !0, configurable: !0 },
	value: { value: xn, writable: !0, configurable: !0 },
	variable: { value: Sn, writable: !0, configurable: !0 },
	builtin: { value: Tn, writable: !0, configurable: !0 },
});
function kn(e) {
	const t = this._scope.get(e);
	if (!t) throw new F(`${e} is not defined`);
	if (t._type === oe) throw new F(`${e} is defined more than once`);
	return t.define.apply(t, arguments);
}
function Hn() {
	const e = new H(Ge, this);
	return e.define.apply(e, arguments);
}
function En() {
	const e = new H(Ge, this);
	return e.import.apply(e, arguments);
}
function Sn(e, t) {
	return new H(Ge, this, e, t);
}
async function xn(e) {
	let t = this._scope.get(e);
	if (!t) throw new F(`${e} is not defined`);
	if (t._observer === $) {
		t = this.variable(!0).define([e], de);
		try {
			return await he(this._runtime, t);
		} finally {
			t.delete();
		}
	} else return he(this._runtime, t);
}
async function he(e, t) {
	await e._compute();
	try {
		return await t._promise;
	} catch (n) {
		if (n === Y) return he(e, t);
		throw n;
	}
}
function Kn(e, t) {
	const n = new Map(),
		i = new Set(),
		o = [];
	function r(l) {
		let c = n.get(l);
		return (
			c ||
			((c = new ue(l._runtime, l._builtins)),
			(c._source = l),
			n.set(l, c),
			o.push([c, l]),
			i.add(l),
			c)
		);
	}
	const a = r(this);
	for (const l of e) {
		const { alias: c, name: s } = typeof l == "object" ? l : { name: l };
		a.import(s, c ?? s, t);
	}
	for (const l of i)
		for (const [c, s] of l._scope)
			if (s._definition === de) {
				if (l === this && a._scope.has(c)) continue;
				const d = s._inputs[0]._module;
				d._source && r(d);
			}
	for (const [l, c] of o)
		for (const [s, d] of c._scope) {
			const u = l._scope.get(s);
			if (!(u && u._type !== ee))
				if (d._definition === de) {
					const g = d._inputs[0],
						h = g._module;
					l.import(g._name, s, n.get(h) || h);
				} else l.define(s, d._inputs.map(Ln), d._definition);
		}
	return a;
}
function Jn(e) {
	let t = this._scope.get(e),
		n;
	if (!t)
		if (((t = new H(ee, this)), this._builtins.has(e)))
			t.define(e, fe(this._builtins.get(e)));
		else if (this._runtime._builtin._scope.has(e))
			t.import(e, this._runtime._builtin);
		else {
			try {
				n = this._runtime._global(e);
			} catch (i) {
				return t.define(e, An(i));
			}
			n === void 0 ? this._scope.set((t._name = e), t) : t.define(e, fe(n));
		}
	return t;
}
function Tn(e, t) {
	this._builtins.set(e, t);
}
function Ln(e) {
	return e._name;
}
const zn =
	typeof requestAnimationFrame == "function"
		? requestAnimationFrame
		: typeof setImmediate == "function"
			? setImmediate
			: (e) => setTimeout(e, 0);
function tt(e, t = si) {
	const n = this.module();
	if (
		(Object.defineProperties(this, {
			_dirty: { value: new Set() },
			_updates: { value: new Set() },
			_precomputes: { value: [], writable: !0 },
			_computing: { value: null, writable: !0 },
			_init: { value: null, writable: !0 },
			_modules: { value: new Map() },
			_variables: { value: new Set() },
			_disposed: { value: !1, writable: !0 },
			_builtin: { value: n },
			_global: { value: t },
		}),
		e)
	)
		for (const i in e) new H(ee, n).define(i, [], e[i]);
}
Object.defineProperties(tt.prototype, {
	_precompute: { value: Qn, writable: !0, configurable: !0 },
	_compute: { value: Un, writable: !0, configurable: !0 },
	_computeSoon: { value: Mn, writable: !0, configurable: !0 },
	_computeNow: { value: On, writable: !0, configurable: !0 },
	dispose: { value: jn, writable: !0, configurable: !0 },
	module: { value: Pn, writable: !0, configurable: !0 },
});
function jn() {
	(this._computing = Promise.resolve()),
		(this._disposed = !0),
		this._variables.forEach((e) => {
			e._invalidate(), (e._version = NaN);
		});
}
function Pn(e, t = N) {
	let n;
	if (e === void 0)
		return (n = this._init) ? ((this._init = null), n) : new ue(this);
	if (((n = this._modules.get(e)), n)) return n;
	(this._init = n = new ue(this)), this._modules.set(e, n);
	try {
		e(this, t);
	} finally {
		this._init = null;
	}
	return n;
}
function Qn(e) {
	this._precomputes.push(e), this._compute();
}
function Un() {
	return this._computing || (this._computing = this._computeSoon());
}
function Mn() {
	return new Promise(zn).then(() =>
		this._disposed ? void 0 : this._computeNow(),
	);
}
async function On() {
	let e = [],
		t,
		n,
		i = this._precomputes;
	if (i.length) {
		this._precomputes = [];
		for (const r of i) r();
		await Dn(3);
	}
	(t = new Set(this._dirty)),
		t.forEach(function (r) {
			r._inputs.forEach(t.add, t);
			const a = li(r);
			a > r._reachable
				? this._updates.add(r)
				: a < r._reachable && r._invalidate(),
				(r._reachable = a);
		}, this),
		(t = new Set(this._updates)),
		t.forEach(function (r) {
			r._reachable
				? ((r._indegree = 0), r._outputs.forEach(t.add, t))
				: ((r._indegree = NaN), t.delete(r));
		}),
		(this._computing = null),
		this._updates.clear(),
		this._dirty.clear(),
		t.forEach(function (r) {
			r._outputs.forEach(qn);
		});
	do {
		for (
			t.forEach(function (r) {
				r._indegree === 0 && e.push(r);
			});
			(n = e.pop());
		)
			ii(n), n._outputs.forEach(o), t.delete(n);
		t.forEach(function (r) {
			$n(r) &&
				(ri(r, new F("circular definition")),
				r._outputs.forEach(ei),
				t.delete(r));
		});
	} while (t.size);
	function o(r) {
		--r._indegree === 0 && e.push(r);
	}
}
function Dn(e = 0) {
	let t = Promise.resolve();
	for (let n = 0; n < e; ++n) t = t.then(() => {});
	return t;
}
function $n(e) {
	const t = new Set(e._inputs);
	for (const n of t) {
		if (n === e) return !0;
		n._inputs.forEach(t.add, t);
	}
	return !1;
}
function qn(e) {
	++e._indegree;
}
function ei(e) {
	--e._indegree;
}
function ti(e) {
	return e._promise.catch(e._rejector);
}
function Ce(e) {
	return new Promise(function (t) {
		e._invalidate = t;
	});
}
function ni(e, t) {
	let n =
			typeof IntersectionObserver == "function" &&
			t._observer &&
			t._observer._node,
		i = !n,
		o = N,
		r = N,
		a,
		l;
	return (
		n &&
			((l = new IntersectionObserver(
				([c]) => (i = c.isIntersecting) && ((a = null), o()),
			)),
			l.observe(n),
			e.then(() => (l.disconnect(), (l = null), r()))),
		function (c) {
			return i
				? Promise.resolve(c)
				: l
					? (a || (a = new Promise((s, d) => ((o = s), (r = d)))),
						a.then(() => c))
					: Promise.reject();
		}
	);
}
function ii(e) {
	e._invalidate(), (e._invalidate = N), e._pending();
	const t = e._value,
		n = ++e._version,
		i = e._inputs,
		o = e._definition;
	let r = null;
	const a = (e._promise = e._promise.then(l, l).then(c).then(s));
	function l() {
		return Promise.all(i.map(ti));
	}
	function c(d) {
		if (e._version !== n) throw Y;
		for (let u = 0, g = d.length; u < g; ++u)
			switch (d[u]) {
				case qe: {
					d[u] = r = Ce(e);
					break;
				}
				case et: {
					r || (r = Ce(e)), (d[u] = ni(r, e));
					break;
				}
				case $e: {
					d[u] = e;
					break;
				}
			}
		return o.apply(t, d);
	}
	function s(d) {
		if (e._version !== n) throw Y;
		return hn(d) ? ((r || Ce(e)).then(ai(d)), oi(e, n, d)) : d;
	}
	a.then(
		(d) => {
			(e._value = d), e._fulfilled(d);
		},
		(d) => {
			d === Y || e._version !== n || ((e._value = void 0), e._rejected(d));
		},
	);
}
function oi(e, t, n) {
	const i = e._module._runtime;
	let o;
	function r(c) {
		return new Promise((s) => s(n.next(o))).then(({ done: s, value: d }) =>
			s ? void 0 : Promise.resolve(d).then(c),
		);
	}
	function a() {
		const c = r((s) => {
			if (e._version !== t) throw Y;
			return (o = s), l(s, c).then(() => i._precompute(a)), e._fulfilled(s), s;
		});
		c.catch((s) => {
			s === Y || e._version !== t || (l(void 0, c), e._rejected(s));
		});
	}
	function l(c, s) {
		return (
			(e._value = c),
			(e._promise = s),
			e._outputs.forEach(i._updates.add, i._updates),
			i._compute()
		);
	}
	return r((c) => {
		if (e._version !== t) throw Y;
		return (o = c), i._precompute(a), c;
	});
}
function ri(e, t) {
	e._invalidate(),
		(e._invalidate = N),
		e._pending(),
		++e._version,
		(e._indegree = NaN),
		(e._promise = Promise.reject(t)).catch(N),
		(e._value = void 0),
		e._rejected(t);
}
function ai(e) {
	return function () {
		e.return();
	};
}
function li(e) {
	if (e._observer !== $) return !0;
	const t = new Set(e._outputs);
	for (const n of t) {
		if (n._observer !== $) return !0;
		n._outputs.forEach(t.add, t);
	}
	return !1;
}
function si(e) {
	return globalThis[e];
}
const xe = new Map();
function nt(e, t = document.baseURI) {
	if (new.target !== void 0)
		throw new TypeError("FileAttachment is not a constructor");
	const n = new URL(e, t).href;
	let i = xe.get(n);
	return i || ((i = new J(n, e.split("/").pop())), xe.set(n, i)), i;
}
async function K(e) {
	const t = await fetch(e.href);
	if (!t.ok) throw new Error(`Unable to load file: ${e.name}`);
	return t;
}
class ci {
	constructor(t, n = di(t), i, o) {
		Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0,
		}),
			Object.defineProperty(this, "mimeType", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			Object.defineProperty(this, "lastModified", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			Object.defineProperty(this, "size", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			Object.defineProperties(this, {
				name: { value: `${t}`, enumerable: !0 },
				mimeType: { value: `${n}`, enumerable: !0 },
				lastModified: { value: i === void 0 ? void 0 : +i, enumerable: !0 },
				size: { value: o === void 0 ? void 0 : +o, enumerable: !0 },
			});
	}
	async url() {
		return this.href;
	}
	async blob() {
		return (await K(this)).blob();
	}
	async arrayBuffer() {
		return (await K(this)).arrayBuffer();
	}
	async text(t) {
		return t === void 0
			? (await K(this)).text()
			: new TextDecoder(t).decode(await this.arrayBuffer());
	}
	async json() {
		return (await K(this)).json();
	}
	async stream() {
		return (await K(this)).body;
	}
	async dsv({ delimiter: t = ",", array: n = !1, typed: i = !1 } = {}) {
		const [o, r] = await Promise.all([
				this.text(),
				p(
					() => import("https://cdn.jsdelivr.net/npm/d3-dsv/+esm"),
					[],
					import.meta.url,
				),
			]),
			a = r.dsvFormat(t);
		return (n ? a.parseRows : a.parse)(o, i && r.autoType);
	}
	async csv(t) {
		return this.dsv({ ...t, delimiter: "," });
	}
	async tsv(t) {
		return this.dsv({ ...t, delimiter: "	" });
	}
	async image(t) {
		const n = await this.url();
		return new Promise((i, o) => {
			const r = new Image();
			new URL(n, document.baseURI).origin !== location.origin &&
				(r.crossOrigin = "anonymous"),
				Object.assign(r, t),
				(r.onload = () => i(r)),
				(r.onerror = () => o(new Error(`Unable to load file: ${this.name}`))),
				(r.src = n);
		});
	}
	async arrow() {
		const [t, n] = await Promise.all([
			p(
				() => import("https://cdn.jsdelivr.net/npm/apache-arrow/+esm"),
				[],
				import.meta.url,
			),
			K(this),
		]);
		return t.tableFromIPC(n);
	}
	async arquero(t) {
		let n, i;
		switch (this.mimeType) {
			case "application/json":
				(n = this.text()), (i = "fromJSON");
				break;
			case "text/tab-separated-values":
				t?.delimiter === void 0 && (t = { ...t, delimiter: "	" });
			case "text/csv":
				(n = this.text()), (i = "fromCSV");
				break;
			default:
				if (/\.arrow$/i.test(this.name)) (n = this.arrow()), (i = "fromArrow");
				else if (/\.parquet$/i.test(this.name))
					(n = this.parquet()), (i = "fromArrow");
				else
					throw new Error(`unable to determine Arquero loader: ${this.name}`);
				break;
		}
		const [o, r] = await Promise.all([
			p(
				() => import("https://cdn.jsdelivr.net/npm/arquero/+esm"),
				[],
				import.meta.url,
			),
			n,
		]);
		return o[i](r, t);
	}
	async parquet() {
		const [t, n, i] = await Promise.all([
			p(
				() => import("https://cdn.jsdelivr.net/npm/apache-arrow/+esm"),
				[],
				import.meta.url,
			),
			p(
				() => import("https://cdn.jsdelivr.net/npm/parquet-wasm/+esm"),
				[],
				import.meta.url,
			).then(
				async (o) => (
					await o.default(
						"https://cdn.jsdelivr.net/npm/parquet-wasm/esm/parquet_wasm_bg.wasm",
					),
					o
				),
			),
			this.arrayBuffer(),
		]);
		return t.tableFromIPC(n.readParquet(new Uint8Array(i)).intoIPCStream());
	}
	async xml(t = "application/xml") {
		return new DOMParser().parseFromString(await this.text(), t);
	}
	async html() {
		return this.xml("text/html");
	}
}
function di(e) {
	const t = e.lastIndexOf("."),
		n = e.lastIndexOf("/");
	switch (t > 0 && (n < 0 || t > n) ? e.slice(t).toLowerCase() : "") {
		case ".csv":
			return "text/csv";
		case ".tsv":
			return "text/tab-separated-values";
		case ".json":
			return "application/json";
		case ".html":
			return "text/html";
		case ".xml":
			return "application/xml";
		case ".png":
			return "image/png";
		case ".jpg":
			return "image/jpg";
		case ".js":
			return "text/javascript";
		default:
			return "application/octet-stream";
	}
}
class J extends ci {
	constructor(t, n, i, o, r) {
		super(n, i, o, r),
			Object.defineProperty(this, "href", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			Object.defineProperty(this, "href", { value: t });
	}
}
Object.defineProperty(J, "name", { value: "FileAttachment" });
nt.prototype = J.prototype;
function ui(e) {
	function t(n) {
		const i = e((n += ""));
		if (i == null) throw new Error(`File not found: ${n}`);
		if (typeof i == "object" && "url" in i) {
			const { url: o, mimeType: r } = i;
			return new J(o, n, r);
		}
		return new J(i, n);
	}
	return (t.prototype = J.prototype), t;
}
async function* Ie(e) {
	let t,
		n,
		i = !1;
	const o = e((r) => ((n = r), t ? (t(r), (t = void 0)) : (i = !0), r));
	if (o != null && typeof o != "function")
		throw new Error(
			typeof o == "object" && "then" in o && typeof o.then == "function"
				? "async initializers are not supported"
				: "initializer returned something, but not a dispose function",
		);
	try {
		for (;;) yield i ? ((i = !1), n) : new Promise((r) => (t = r));
	} finally {
		o?.();
	}
}
function it(e) {
	let t;
	return Object.defineProperty(
		Ie((n) => {
			(t = n), e !== void 0 && t(e);
		}),
		"value",
		{ get: () => e, set: (n) => ((e = n), void t?.(e)) },
	);
}
function gi(e) {
	const t = it(e);
	return [
		t,
		{
			get value() {
				return t.value;
			},
			set value(n) {
				t.value = n;
			},
		},
	];
}
function Ae(e) {
	return Ie((t) => {
		const n = Ii(e),
			i = Ke(e),
			o = () => t(Ke(e));
		return (
			e.addEventListener(n, o),
			i !== void 0 && t(i),
			() => e.removeEventListener(n, o)
		);
	});
}
function Ke(e) {
	const t = e,
		n = e;
	if ("type" in e)
		switch (e.type) {
			case "range":
			case "number":
				return t.valueAsNumber;
			case "date":
				return t.valueAsDate;
			case "checkbox":
				return t.checked;
			case "file":
				return t.multiple ? t.files : t.files[0];
			case "select-multiple":
				return Array.from(n.selectedOptions, (i) => i.value);
		}
	return t.value;
}
function Ii(e) {
	if ("type" in e)
		switch (e.type) {
			case "button":
			case "submit":
			case "checkbox":
				return "click";
			case "file":
				return "change";
		}
	return "input";
}
async function* ot() {
	for (;;) yield Date.now();
}
async function* mi(e) {
	let t;
	const n = [],
		i = e((o) => (n.push(o), t && (t(n.shift()), (t = void 0)), o));
	if (i != null && typeof i != "function")
		throw new Error(
			typeof i == "object" && "then" in i && typeof i.then == "function"
				? "async initializers are not supported"
				: "initializer returned something, but not a dispose function",
		);
	try {
		for (;;) yield n.length ? n.shift() : new Promise((o) => (t = o));
	} finally {
		i?.();
	}
}
function rt(e, t) {
	return Ie((n) => {
		let i;
		const o = new ResizeObserver(([r]) => {
			const a = r.contentRect.width;
			a !== i && n((i = a));
		});
		return o.observe(e, t), () => o.disconnect();
	});
}
const pi = Object.freeze(
	Object.defineProperty(
		{ __proto__: null, input: Ae, now: ot, observe: Ie, queue: mi, width: rt },
		Symbol.toStringTag,
		{ value: "Module" },
	),
);
function Ci(e, t) {
	const n = document.createElement("canvas");
	return (n.width = e), (n.height = t), n;
}
function bi(e, t, n = devicePixelRatio) {
	const i = document.createElement("canvas");
	(i.width = e * n), (i.height = t * n), (i.style.width = `${e}px`);
	const o = i.getContext("2d");
	return o.scale(n, n), o;
}
function fi(e, t) {
	const n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	return (
		n.setAttribute("viewBox", `0 0 ${e} ${t}`),
		n.setAttribute("width", `${e}`),
		n.setAttribute("height", `${t}`),
		n
	);
}
function hi(e) {
	return document.createTextNode(e);
}
let Ai = 0;
function Zi(e) {
	return new _i(`O-${e == null ? "" : `${e}-`}${++Ai}`);
}
class _i {
	constructor(t) {
		Object.defineProperty(this, "id", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0,
		}),
			Object.defineProperty(this, "href", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			(this.id = t),
			(this.href = new URL(`#${t}`, location.href).href);
	}
	toString() {
		return `url(${this.href})`;
	}
}
const yi = Object.freeze(
	Object.defineProperty(
		{ __proto__: null, canvas: Ci, context2d: bi, svg: fi, text: hi, uid: Zi },
		Symbol.toStringTag,
		{ value: "Module" },
	),
);
var Gi = function (e, t, n, i) {
		if (n === "a" && !i)
			throw new TypeError("Private accessor was defined without a getter");
		if (typeof t == "function" ? e !== t || !i : !t.has(e))
			throw new TypeError(
				"Cannot read private member from an object whose class did not declare it",
			);
		return n === "m" ? i : n === "a" ? i.call(e) : i ? i.value : t.get(e);
	},
	Wi = function (e, t, n, i, o) {
		if (i === "m") throw new TypeError("Private method is not writable");
		if (i === "a" && !o)
			throw new TypeError("Private accessor was defined without a setter");
		if (typeof t == "function" ? e !== t || !o : !t.has(e))
			throw new TypeError(
				"Cannot write private member to an object whose class did not declare it",
			);
		return i === "a" ? o.call(e, n) : o ? (o.value = n) : t.set(e, n), n;
	},
	re;
class wi {
	constructor() {
		re.set(this, void 0),
			Object.defineProperty(this, "fulfilled", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			Object.defineProperty(this, "rejected", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			this.next();
	}
	async next() {
		const t = await Gi(this, re, "f");
		return (
			Wi(
				this,
				re,
				new Promise((n, i) => ((this.fulfilled = n), (this.rejected = i))),
				"f",
			),
			{ done: !1, value: t }
		);
	}
	throw() {
		return { done: !0 };
	}
	return() {
		return { done: !0 };
	}
}
re = new WeakMap();
const vi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/lodash/+esm"),
			[],
			import.meta.url,
		).then((e) => e.default),
	Vi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/arquero/+esm"),
			[],
			import.meta.url,
		),
	Bi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/apache-arrow/+esm"),
			[],
			import.meta.url,
		),
	Ri = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/d3/+esm"),
			[],
			import.meta.url,
		),
	Xi = () =>
		p(() => import("./dot-DSyh6hFx.js"), [], import.meta.url).then(
			(e) => e.dot,
		),
	Fi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm/+esm"),
			[],
			import.meta.url,
		),
	Yi = () =>
		p(() => import("./duckdb-HAp-LwRb.js"), [], import.meta.url).then(
			(e) => e.DuckDBClient,
		),
	Ni = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/echarts/+esm"),
			[],
			import.meta.url,
		),
	ki = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/htl/+esm"),
			[],
			import.meta.url,
		),
	Hi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/htl/+esm"),
			[],
			import.meta.url,
		).then((e) => e.html),
	Ei = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/htl/+esm"),
			[],
			import.meta.url,
		).then((e) => e.svg),
	Si = () =>
		p(
			() => import("./inputs-DoHVubAa.js"),
			__vite__mapDeps([0, 1]),
			import.meta.url,
		),
	xi = () => p(() => import("./leaflet-D54mqpIu.js"), [], import.meta.url),
	Ki = () =>
		p(() => import("./mapboxgl-C94UFoDx.js"), [], import.meta.url).then(
			(e) => e.default,
		),
	Ji = () =>
		p(() => import("./md-B1X10lBL.js"), [], import.meta.url).then((e) => e.md),
	Ti = () =>
		p(() => import("./mermaid-CWCaPgOr.js"), [], import.meta.url).then(
			(e) => e.mermaid,
		),
	Li = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/@observablehq/plot/+esm"),
			[],
			import.meta.url,
		),
	zi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/react/+esm"),
			[],
			import.meta.url,
		),
	ji = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/react-dom/+esm"),
			[],
			import.meta.url,
		),
	Pi = () =>
		p(() => import("./tex-BE43Lb2g.js"), [], import.meta.url).then(
			(e) => e.tex,
		),
	Qi = () =>
		p(
			() => import("https://cdn.jsdelivr.net/npm/topojson-client/+esm"),
			[],
			import.meta.url,
		),
	Ui = () =>
		p(() => import("./vega-lite-ClQwpDTB.js"), [], import.meta.url).then(
			(e) => e.vl,
		),
	Mi = Object.freeze(
		Object.defineProperty(
			{
				__proto__: null,
				Arrow: Bi,
				DuckDBClient: Yi,
				Inputs: Si,
				L: xi,
				Plot: Li,
				React: zi,
				ReactDOM: ji,
				_: vi,
				aq: Vi,
				d3: Ri,
				dot: Xi,
				duckdb: Fi,
				echarts: Ni,
				htl: ki,
				html: Hi,
				mapboxgl: Ki,
				md: Ji,
				mermaid: Ti,
				svg: Ei,
				tex: Pi,
				topojson: Qi,
				vl: Ui,
			},
			Symbol.toStringTag,
			{ value: "Module" },
		),
	);
ve.resolve = at;
function ve(...e) {
	return e.length === 1
		? import(at(e[0]))
		: Promise.all(e.map((t) => ve(t))).then((t) => Object.assign({}, ...t));
}
function Oi(e) {
	const t = e.split("/"),
		n = e.startsWith("@") ? [t.shift(), t.shift()].join("/") : t.shift(),
		i = n.indexOf("@", 1),
		o = i > 0 ? n.slice(0, i) : n,
		r = i > 0 ? n.slice(i) : "",
		a = t.length > 0 ? `/${t.join("/")}` : "";
	return { name: o, range: r, path: a };
}
function at(e) {
	const t = String(e);
	if (Di(t) || $i(t)) return t;
	const { name: n, range: i, path: o } = Oi(t);
	return `https://cdn.jsdelivr.net/npm/${n}${i}${o + (qi(o) || eo(o) ? "" : "/+esm")}`;
}
function Di(e) {
	return /^\w+:/.test(e);
}
function $i(e) {
	return /^(\.\/|\.\.\/|\/)/.test(e);
}
function qi(e) {
	return /(\.\w*)$/.test(e);
}
function eo(e) {
	return /(\/)$/.test(e);
}
const to = () => V(v("aapl.csv")),
	no = () => V(v("alphabet.csv")),
	io = () => V(v("cars.csv")),
	oo = () => V(v("citywages.csv")),
	ro = () => V(v("diamonds.csv")),
	ao = () => V(v("flare.csv")),
	lo = () => V(v("industries.csv")),
	so = () => mo(v("miserables.json")),
	co = () => V(v("olympians.csv")),
	uo = () => V(v("penguins.csv")),
	go = () => V(v("pizza.csv")),
	Io = () => V(v("weather.csv"));
function v(e) {
	return `https://cdn.jsdelivr.net/npm/@observablehq/sample-datasets/${e}`;
}
async function mo(e) {
	const t = await fetch(e);
	if (!t.ok) throw new Error(`unable to fetch ${e}: status ${t.status}`);
	return t.json();
}
async function po(e) {
	const t = await fetch(e);
	if (!t.ok) throw new Error(`unable to fetch ${e}: status ${t.status}`);
	return t.text();
}
async function V(e, t) {
	const [n, i] = await Promise.all([
		po(e),
		p(
			() => import("https://cdn.jsdelivr.net/npm/d3-dsv/+esm"),
			[],
			import.meta.url,
		),
	]);
	return i.csvParse(n, i.autoType);
}
const Co = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			aapl: to,
			alphabet: no,
			cars: io,
			citywages: oo,
			diamonds: ro,
			flare: ao,
			industries: lo,
			miserables: so,
			olympians: co,
			penguins: uo,
			pizza: go,
			weather: Io,
		},
		Symbol.toStringTag,
		{ value: "Module" },
	),
);
function bo(e, t) {
	return (n, ...i) => e.sql.call(e, n, ...i).then(t);
}
const fo = document.querySelector("main") ?? document.body,
	ho = {
		now: () => ot(),
		width: () => rt(fo),
		FileAttachment: () => nt,
		Generators: () => pi,
		Mutable: () => it,
		DOM: () => yi,
		require: () => ve,
		__sql: () => bo,
		__ojs_observer: () => () => new wi(),
		...Mi,
		...Co,
	},
	Ze = Object.assign(new tt({ ...ho, __ojs_runtime: () => Ze }), {
		fileAttachments: ui,
	}),
	S = (Ze.main = Ze.module());
S.constructor.prototype.defines = function (e) {
	return (
		this._scope.has(e) ||
		this._builtins.has(e) ||
		this._runtime._builtin._scope.has(e)
	);
};
function L(e, t, n = fn) {
	const {
			id: i,
			body: o,
			inputs: r = [],
			outputs: a = [],
			output: l,
			autodisplay: c,
			autoview: s,
			automutable: d,
		} = t,
		u = e.variables,
		g = S.variable(n(e, t), { shadow: {} }),
		h = l ?? (a.length ? `cell ${i}` : null);
	if (r.includes("display") || r.includes("view")) {
		let C = -1;
		const G = new g.constructor(2, g._module);
		if (
			(G.define(
				r.filter((_) => _ !== "display" && _ !== "view"),
				() => {
					const _ = g._version;
					return (E) => {
						if (_ < C) throw new Error("stale display");
						if (e.variables[0] !== g) throw new Error("stale display");
						return _ > C && O(e), (C = _), Oe(e, E), E;
					};
				},
			),
			g._shadow.set("display", G),
			r.includes("view"))
		) {
			const _ = new g.constructor(2, g._module, null, { shadow: {} });
			_._shadow.set("display", G),
				_.define(["display"], (E) => (z) => Ae(E(z))),
				g._shadow.set("view", _);
		}
	} else c || O(e);
	if ((u.push(g.define(h, r, o)), l != null)) {
		if (s) {
			const C = Je(l, "viewof$");
			u.push(S.define(C, [l], Ae));
		} else if (d) {
			const C = Je(l, "mutable "),
				G = `cell ${i}`;
			g.define(C, [G], ([_]) => _),
				u.push(
					S.define(l, r, o),
					S.define(G, [l], gi),
					S.define(`mutable$${C}`, [G], ([, _]) => _),
				);
		}
	} else for (const C of a) u.push(S.variable(!0).define(C, [h], (G) => G[C]));
}
function Je(e, t) {
	if (!e.startsWith(t)) throw new Error(`expected ${t}: ${e}`);
	return e.slice(t.length);
}
L(
	{ root: document.getElementById("cell-8"), expanded: [], variables: [] },
	{
		id: 8,
		body: async (e, t, n, i, o, r, a, l) => {
			const c = {
					goal: "Examine the relationship between individual species' brain weight and body weight, segmented by their dietary classification (vore).",
					summary:
						"A dataset of individual mammalian species showing the relationship between their body weight and brain weight. Data is segmented by dietary classification and includes additional contextual details like taxonomic order, conservation status, and sleep patterns, suitable for a scatter plot visualization.",
					fields: [
						{
							name: "name",
							label: "Name",
							description: "Original field name used without modification.",
							semantic_type: "Name",
							role: "detail",
						},
						{
							name: "body_weight",
							label: "Body Weight",
							description: "Original field bodywt used without modification.",
							semantic_type: "Numeric",
							role: "primary",
						},
						{
							name: "brain_weight",
							label: "Brain Weight",
							description: "Original field brainwt used without modification.",
							semantic_type: "Numeric",
							role: "primary",
						},
						{
							name: "diet",
							label: "Diet",
							description:
								"Derived from vore: Mapped dietary codes (e.g., 'carni', 'herbi') to human-readable labels ('Carnivore', 'Herbivore'). Nulls are labeled 'Unknown'.",
							semantic_type: "Category",
							role: "segment",
						},
						{
							name: "taxonomic_order",
							label: "Taxonomic Order",
							description: "Original field order used without modification.",
							semantic_type: "Category",
							role: "detail",
						},
						{
							name: "conservation_status",
							label: "Conservation Status",
							description:
								"Derived from conservation: Original field used, with NULL values replaced by 'Unknown'.",
							semantic_type: "Category",
							role: "detail",
						},
						{
							name: "sleep_total",
							label: "Total Sleep",
							description:
								"Original field sleep_total used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "awake",
							label: "Awake",
							description: "Original field awake used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_01" },
					facet: { column: { field: "diet", title: "Diet", type: "nominal" } },
					spec: {
						mark: { type: "point" },
						encoding: {
							tooltip: [
								{ field: "name", title: "Name", type: "nominal" },
								{
									field: "body_weight",
									title: "Body Weight",
									type: "quantitative",
								},
								{
									field: "brain_weight",
									title: "Brain Weight",
									type: "quantitative",
								},
								{ field: "diet", title: "Diet", type: "nominal" },
								{
									field: "taxonomic_order",
									title: "Taxonomic Order",
									type: "nominal",
								},
								{
									field: "conservation_status",
									title: "Conservation Status",
									type: "nominal",
								},
								{
									field: "sleep_total",
									title: "Total Sleep",
									type: "quantitative",
								},
								{ field: "awake", title: "Awake", type: "quantitative" },
							],
							x: {
								field: "body_weight",
								scale: { type: "symlog" },
								title: "Body Weight",
								type: "quantitative",
							},
							y: {
								field: "brain_weight",
								scale: { type: "symlog" },
								title: "Brain Weight",
								type: "quantitative",
							},
						},
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_01 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_01");
			d && d.setAttribute("href", t(n, c.goal, s));
			const u = "dataset_01",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/devious-aircraft-joked-quirkily/artifacts/datasets.parquet";
			await i(o, u, g);
			const h = await r({ table: u, spec: s, metadata: c, coordinator: a });
			l(h.viewClient.node()), l(h.tableClient.node());
			const C = document.getElementById("loading-skeleton-dataset_01");
			return (
				C && C.remove(),
				{
					dataset_01_metadata: c,
					dataset_01_vegalite: s,
					dataset_01_provenance_nb_link: d,
					dataset_01_table: u,
					dataset_01_url: g,
					dataset_01_clients: h,
					dataset_01_loading_skeleton: C,
				}
			);
		},
		inputs: [
			"registerDataFieldTooltips",
			"constructProvenanceNotebookUrl",
			"provenanceNotebookTemplate",
			"registerDataset",
			"db",
			"datatableWithView",
			"coordinator",
			"display",
		],
		outputs: [
			"dataset_01_metadata",
			"dataset_01_vegalite",
			"dataset_01_provenance_nb_link",
			"dataset_01_table",
			"dataset_01_url",
			"dataset_01_clients",
			"dataset_01_loading_skeleton",
		],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
L(
	{ root: document.getElementById("cell-14"), expanded: [], variables: [] },
	{
		id: 14,
		body: async (e, t, n, i, o, r, a, l) => {
			const c = {
					goal: "Show the median total sleep duration across different taxonomic orders, faceted by conservation status.",
					summary:
						"A summary of the median total sleep duration for mammalian species, grouped by their taxonomic order and conservation status.",
					fields: [
						{
							name: "taxonomic_order",
							label: "Taxonomic Order",
							description:
								"Derived from order: Cleaned using TRIM() and COALESCE() to handle NULL or empty values, which are mapped to 'Unknown'.",
							semantic_type: "Category",
							role: "primary",
						},
						{
							name: "conservation_status",
							label: "Conservation Status",
							description:
								"Derived from conservation: Cleaned using TRIM() and COALESCE() to handle NULL or empty values, which are mapped to 'Unknown'.",
							semantic_type: "Category",
							role: "facet",
						},
						{
							name: "median_total_sleep_hours",
							label: "Median Total Sleep (Hours)",
							description:
								"Derived from sleep_total: Median aggregated by taxonomic_order and conservation_status. NULL values in sleep_total were excluded from the calculation.",
							semantic_type: "Numeric",
							role: "primary",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_03" },
					mark: { type: "point" },
					encoding: {
						size: {
							field: "median_total_sleep_hours",
							scale: { type: "linear", zero: !0 },
							title: "Median Total Sleep (Hours)",
							type: "quantitative",
						},
						tooltip: [
							{
								field: "taxonomic_order",
								title: "Taxonomic Order",
								type: "nominal",
							},
							{
								field: "conservation_status",
								title: "Conservation Status",
								type: "nominal",
							},
							{
								field: "median_total_sleep_hours",
								title: "Median Total Sleep (Hours)",
								type: "quantitative",
							},
						],
						x: {
							field: "taxonomic_order",
							sort: "-y",
							title: "Taxonomic Order",
							type: "ordinal",
						},
						y: {
							field: "conservation_status",
							sort: "-x",
							title: "Conservation Status",
							type: "ordinal",
						},
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_03 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_03");
			d && d.setAttribute("href", t(n, c.goal, s));
			const u = "dataset_03",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/devious-aircraft-joked-quirkily/artifacts/datasets.parquet";
			await i(o, u, g);
			const h = await r({ table: u, spec: s, metadata: c, coordinator: a });
			l(h.viewClient.node()), l(h.tableClient.node());
			const C = document.getElementById("loading-skeleton-dataset_03");
			return (
				C && C.remove(),
				{
					dataset_03_metadata: c,
					dataset_03_vegalite: s,
					dataset_03_provenance_nb_link: d,
					dataset_03_table: u,
					dataset_03_url: g,
					dataset_03_clients: h,
					dataset_03_loading_skeleton: C,
				}
			);
		},
		inputs: [
			"registerDataFieldTooltips",
			"constructProvenanceNotebookUrl",
			"provenanceNotebookTemplate",
			"registerDataset",
			"db",
			"datatableWithView",
			"coordinator",
			"display",
		],
		outputs: [
			"dataset_03_metadata",
			"dataset_03_vegalite",
			"dataset_03_provenance_nb_link",
			"dataset_03_table",
			"dataset_03_url",
			"dataset_03_clients",
			"dataset_03_loading_skeleton",
		],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
L(
	{ root: document.getElementById("cell-18"), expanded: [], variables: [] },
	{
		id: 18,
		body: async (e, t, n, i, o, r, a, l) => {
			const c = {
					goal: "Rank the top 10 mammalian species by their percentage of REM sleep (sleep_rem / sleep_total), segmented by dietary classification (vore).",
					summary:
						"A ranking of the top 10 mammalian species by their percentage of daily sleep that is REM sleep, segmented by their primary diet.",
					fields: [
						{
							name: "species_name",
							label: "Species Name",
							description: "Original field name used without modification.",
							semantic_type: "Name",
							role: "detail",
						},
						{
							name: "diet",
							label: "Diet",
							description:
								"Derived from vore: Dietary classification, with empty strings and NULLs replaced by 'Unknown'.",
							semantic_type: "Category",
							role: "segment",
						},
						{
							name: "rem_sleep_percentage",
							label: "REM Sleep %",
							description:
								"Derived from sleep_rem and sleep_total: Calculated as (sleep_rem / sleep_total) * 100.0 to represent the percentage of total sleep that is REM sleep.",
							semantic_type: "Percentage",
							role: "primary",
						},
						{
							name: "total_sleep_hours",
							label: "Total Sleep (hrs)",
							description:
								"Original field sleep_total used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "rem_sleep_hours",
							label: "REM Sleep (hrs)",
							description:
								"Original field sleep_rem used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_04" },
					mark: { type: "tick" },
					encoding: {
						tooltip: [
							{ field: "species_name", title: "Species Name", type: "nominal" },
							{ field: "diet", title: "Diet", type: "nominal" },
							{
								field: "rem_sleep_percentage",
								title: "REM Sleep %",
								type: "quantitative",
							},
							{
								field: "total_sleep_hours",
								title: "Total Sleep (hrs)",
								type: "quantitative",
							},
							{
								field: "rem_sleep_hours",
								title: "REM Sleep (hrs)",
								type: "quantitative",
							},
						],
						x: {
							field: "rem_sleep_percentage",
							scale: { type: "linear" },
							title: "REM Sleep %",
							type: "quantitative",
						},
						y: { field: "diet", sort: "-x", title: "Diet", type: "ordinal" },
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_04 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_04");
			d && d.setAttribute("href", t(n, c.goal, s));
			const u = "dataset_04",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/devious-aircraft-joked-quirkily/artifacts/datasets.parquet";
			await i(o, u, g);
			const h = await r({ table: u, spec: s, metadata: c, coordinator: a });
			l(h.viewClient.node()), l(h.tableClient.node());
			const C = document.getElementById("loading-skeleton-dataset_04");
			return (
				C && C.remove(),
				{
					dataset_04_metadata: c,
					dataset_04_vegalite: s,
					dataset_04_provenance_nb_link: d,
					dataset_04_table: u,
					dataset_04_url: g,
					dataset_04_clients: h,
					dataset_04_loading_skeleton: C,
				}
			);
		},
		inputs: [
			"registerDataFieldTooltips",
			"constructProvenanceNotebookUrl",
			"provenanceNotebookTemplate",
			"registerDataset",
			"db",
			"datatableWithView",
			"coordinator",
			"display",
		],
		outputs: [
			"dataset_04_metadata",
			"dataset_04_vegalite",
			"dataset_04_provenance_nb_link",
			"dataset_04_table",
			"dataset_04_url",
			"dataset_04_clients",
			"dataset_04_loading_skeleton",
		],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
L(
	{ root: document.getElementById("cell-21"), expanded: [], variables: [] },
	{
		id: 21,
		body: async (e, t, n, i) => {
			const [
					{ datatable: o },
					r,
					{ default: a },
					{ default: l },
					{ default: c },
					s,
					d,
					{ default: u },
					{ default: g },
				] = await Promise.all([
					p(
						() =>
							import("https://visxgenai-cdn.peter.gy/npm/quak/DataTable.js"),
						[],
						import.meta.url,
					).then((I) => {
						if (!("datatable" in I))
							throw new SyntaxError("export 'datatable' not found");
						return I;
					}),
					p(
						() => import("https://cdn.jsdelivr.net/npm/@uwdata/vgplot/+esm"),
						[],
						import.meta.url,
					),
					p(
						() => import("https://cdn.jsdelivr.net/npm/anchor-js/+esm"),
						[],
						import.meta.url,
					).then((I) => {
						if (!("default" in I))
							throw new SyntaxError("export 'default' not found");
						return I;
					}),
					p(
						() => import("https://cdn.jsdelivr.net/npm/lz-string/+esm"),
						[],
						import.meta.url,
					).then((I) => {
						if (!("default" in I))
							throw new SyntaxError("export 'default' not found");
						return I;
					}),
					p(
						() => import("https://cdn.jsdelivr.net/npm/tippy.js/+esm"),
						[],
						import.meta.url,
					).then((I) => {
						if (!("default" in I))
							throw new SyntaxError("export 'default' not found");
						return I;
					}),
					p(
						() => import("https://cdn.jsdelivr.net/npm/tocbot/+esm"),
						[],
						import.meta.url,
					),
					p(
						() => import("https://cdn.jsdelivr.net/npm/vega/+esm"),
						[],
						import.meta.url,
					),
					p(
						() => import("https://cdn.jsdelivr.net/npm/vega-embed/+esm"),
						[],
						import.meta.url,
					).then((I) => {
						if (!("default" in I))
							throw new SyntaxError("export 'default' not found");
						return I;
					}),
					p(
						() => import("https://cdn.jsdelivr.net/npm/vega-loader-arrow/+esm"),
						[],
						import.meta.url,
					).then((I) => {
						if (!("default" in I))
							throw new SyntaxError("export 'default' not found");
						return I;
					}),
				]),
				h = {
					info: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWluZm8taWNvbiBsdWNpZGUtaW5mbyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgMTZ2LTQiLz48cGF0aCBkPSJNMTIgOGguMDEiLz48L3N2Zz4=",
					chevronDown:
						"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93bi1pY29uIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==",
				},
				C = await e.of(),
				G = new r.Coordinator();
			G.databaseConnector(r.wasmConnector({ duckdb: C._db }));
			function _(I, m, A) {
				const b = `SELECT UNNEST("${m}", max_depth := 2) FROM '${A}'`;
				return I.query(`CREATE TABLE IF NOT EXISTS "${m}" AS ${b}`);
			}
			d.formats("arrow", g);
			function E(I, m = "#677389", A = "gray", b = 0.125, Z = "__selected__") {
				const f = JSON.parse(JSON.stringify(I));
				let y,
					te = !1;
				if (f.spec && typeof f.spec == "object") (y = f.spec), (te = !0);
				else if (
					f.encoding ||
					f.mark ||
					f.layer ||
					f.concat ||
					f.facet ||
					f.repeat
				)
					y = f;
				else throw new Error("Invalid input: could not find Vega-Lite spec");
				y.encoding || (y.encoding = {});
				function j(P, k, x) {
					if (y.encoding[P]) {
						const ne = y.encoding[P];
						y.encoding[P] = {
							condition: { test: `datum.${Z}`, ...ne },
							value: x,
						};
					}
				}
				return (
					y.encoding?.color
						? j("color", null, A)
						: (y.encoding.color = {
								condition: { test: `datum.${Z}`, value: m },
								value: A,
							}),
					y.encoding?.opacity
						? j("opacity", null, b)
						: (y.encoding.opacity = {
								condition: { test: `datum.${Z}`, value: 1 },
								value: b,
							}),
					te ? f : y
				);
			}
			const z = {
				theme: "light",
				animation: "fade",
				duration: [0, 100],
				maxWidth: 500,
				placement: "top",
				arrow: !1,
				offset: [0, 8],
			};
			function me(I, m) {
				c(I, { content: m, ...z });
			}
			function lt(I, m) {
				const A = (b) => m.find((Z) => Z.label === b);
				for (const b of I) {
					const Z =
							b.getAttribute("data-field")?.trim() || b.textContent.trim(),
						f = A(Z);
					if (f) {
						const y = f.description;
						me(b, y);
					} else
						console.warn(`Field "${Z}" not found in metadata.`),
							b.classList.remove("data-field");
				}
			}
			class Ve extends r.MosaicClient {
				#n;
				#t;
				#i = t.html`<div style="width: 100%; max-width: 100%; overflow-x: auto; overflow-y: hidden;">`;
				#e;
				constructor(m) {
					super(m.filterBy), (this.#n = m.table), (this.#t = E(m.spec));
				}
				async initView() {
					const m = {
							...this.#t,
							width: "container",
							padding: { top: 20, bottom: 20, left: 10, right: 10 },
							config: { view: { continuousWidth: 250, continuousHeight: 250 } },
							autosize: { type: "fit", contains: "padding" },
						},
						{ view: A } = await u(this.#i, m, {
							renderer: "canvas",
							actions: !1,
							scaleFactor: 1,
						});
					this.#e = A;
					const b = (this.#t.params || []).map((Z) => Z.name);
					for (const Z of b) A.addSignalListener(Z, (f, y) => this.#o(f, y));
				}
				#o(m, A) {}
				query(m = []) {
					return r.Query.from(this.#n).select("*", {
						__selected__: m.length ? r.and(m) : !0,
					});
				}
				queryResult(m) {
					const A = this.#t.data.name;
					return (
						this.#e
							.change(
								A,
								d
									.changeset()
									.remove(() => !0)
									.insert(d.format.arrow(m)),
							)
							.run(),
						this.#e.resize(),
						this.#e.run(),
						window.dispatchEvent(new n("resize")),
						this
					);
				}
				get vegaView() {
					return this.#e;
				}
				node() {
					return this.#i;
				}
			}
			async function Be(I, m) {
				const { coordinator: A, table: b, filterBy: Z } = m,
					f = new Ve({ spec: I, table: b, filterBy: Z });
				return await f.initView(), A.connect(f), f;
			}
			async function st(I) {
				const {
						table: m,
						metadata: A,
						spec: b,
						coordinator: Z,
						tableHeight: f = 225,
					} = I,
					y = (k) => A.fields.filter((x) => x.name === k)[0]?.label || k;
				function te(k) {
					const x = A.fields.find((ie) => ie.name === k.name),
						ne = x?.label ?? k.name,
						Fe = x?.description ?? "";
					if (Fe) {
						const ie = i`<img
        src="${h.info}"
        alt="info"
        style="width: 14px; height: 14px; margin-left: 4px; cursor: help; margin-bottom: -2px;"
      />`;
						return (
							me(ie, Fe),
							i`
        <span>
          <span class="data-field">${ne}</span>
          ${ie}
        </span>
      `
						);
					} else return i`<span class="data-field">${ne}</span>`;
				}
				const j = await o(m, {
						coordinator: Z,
						height: f,
						getColumnLabel: te,
						getColumnWidth: (k) => Math.max(125, y(k.name).length * 10 + 24),
					}),
					P = await Be(b, { coordinator: Z, table: m, filterBy: j.filterBy });
				return { tableClient: j, viewClient: P };
			}
			function Re(I) {
				const { code: m, baseUrl: A = "https://marimo.app" } = I,
					b = new URL(A);
				if (m) {
					const Z = l.compressToEncodedURIComponent(m);
					b.hash = `#code/${Z}`;
				}
				return b.href;
			}
			function Xe(I, m) {
				let A = I;
				for (const [b, Z] of Object.entries(m))
					A = A.replace(new RegExp("\\$" + b, "g"), Z);
				return A;
			}
			function ct(I, m, A) {
				const Z = {
						provenance_json_url:
							document.getElementById("provenance-json").href,
						goal: m,
						vl_spec: JSON.stringify(A),
					},
					f = Xe(I, Z);
				return Re({ code: f });
			}
			function dt() {
				c("[data-tippy-content]", z);
				const I = document.getElementById("full-report-link");
				window && I?.href === window.location.href && I.remove();
				const m = document.querySelector(".js-toc");
				if (m) {
					const b = document.createElement("div");
					b.className = "js-toc-header";
					const Z = document.createElement("span");
					(Z.className = "js-toc-title"), (Z.textContent = "Contents");
					const f = document.createElement("img");
					(f.className = "js-toc-toggle"),
						(f.src = h.chevronDown),
						(f.alt = "Toggle table of contents"),
						b.appendChild(Z),
						b.appendChild(f);
					const y = document.createElement("div");
					(y.className = "js-toc-content"),
						m.appendChild(b),
						m.appendChild(y),
						b.addEventListener("click", () => {
							m.classList.toggle("collapsed");
						});
				}
				const A = new a({
					icon: "#",
					placement: "left",
					visible: "hover",
					class: "anchor-link",
					truncate: 64,
				});
				setTimeout(() => {
					A.add("h2, h3");
				}, 100),
					setTimeout(() => {
						s.init({
							tocSelector: ".js-toc-content",
							contentSelector: "body main",
							headingSelector: "h2, h3",
							hasInnerContainers: !0,
							scrollSmooth: !0,
							scrollSmoothDuration: 420,
							throttleTimeout: 50,
							positionFixedSelector: ".js-toc",
							fixedSidebarOffset: "auto",
							headingsOffset: 80,
							includeHtml: !0,
							orderedList: !1,
						});
					}, 150);
			}
			return {
				datatable: o,
				vgplot: r,
				AnchorJS: a,
				lzString: l,
				tippy: c,
				tocbot: s,
				vega: d,
				vegaEmbed: u,
				arrow: g,
				Icons: h,
				db: C,
				coordinator: G,
				registerDataset: _,
				specWithSelectionConditioning: E,
				TIPPY_CONFIG_DEFAULT: z,
				registerTooltipOnFieldSpan: me,
				registerDataFieldTooltips: lt,
				VegaView: Ve,
				vegaview: Be,
				datatableWithView: st,
				createMarimoWASMLink: Re,
				renderProvenanceNotebookTemplate: Xe,
				constructProvenanceNotebookUrl: ct,
				initializeReportUI: dt,
			};
		},
		inputs: ["DuckDBClient", "htl", "Event", "html"],
		outputs: [
			"datatable",
			"vgplot",
			"AnchorJS",
			"lzString",
			"tippy",
			"tocbot",
			"vega",
			"vegaEmbed",
			"arrow",
			"Icons",
			"db",
			"coordinator",
			"registerDataset",
			"specWithSelectionConditioning",
			"TIPPY_CONFIG_DEFAULT",
			"registerTooltipOnFieldSpan",
			"registerDataFieldTooltips",
			"VegaView",
			"vegaview",
			"datatableWithView",
			"createMarimoWASMLink",
			"renderProvenanceNotebookTemplate",
			"constructProvenanceNotebookUrl",
			"initializeReportUI",
		],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
L(
	{ root: document.getElementById("cell-22"), expanded: [], variables: [] },
	{
		id: 22,
		body: () => {
			const e =
					"IiIiClRoaXMgaXMgYSBNYXJpbW8gbm90ZWJvb2sgdGVtcGxhdGUgcmVxdWlyaW5nIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGUgdmFyaWFibGVzIGFzIGlucHV0OgoKLSBwcm92ZW5hbmNlX2pzb25fdXJsOiBzdHIKLSBnb2FsOiBzdHIKLSB2bF9zcGVjOiBzdHIKIiIiCgppbXBvcnQgbWFyaW1vCgpfX2dlbmVyYXRlZF93aXRoID0gIjAuMTQuMTcuZGV2MTMiCmFwcCA9IG1hcmltby5BcHAod2lkdGg9ImNvbHVtbnMiKQoKCkBhcHAuY2VsbChjb2x1bW49MCwgaGlkZV9jb2RlPVRydWUpCmRlZiBfKGZsb3djaGFydCwgbW8pOgogICAgbW8ubWQoCiAgICAgICAgcmYiIiIKICAgICMgNS4gVmlzdWFsaXphdGlvbgoKICAgIHtmbG93Y2hhcnQoc2VsZWN0ZWQ9NSl9CgogICAgVGhlIHN5c3RlbSBwaWNrZWQgdGhlIGtleSBmaWVsZHMgZnJvbSB0aGUgW2Rlcml2ZWQgZGF0YV0oI2RhdGFzZXQtZGVyaXZhdGlvbikgYW5kIHVzZWQgW0RyYWNvXShodHRwczovL2dpdGh1Yi5jb20vY211ZGlnL2RyYWNvMikgdG8gY3JlYXRlIHRoaXMgY2hhcnQuCiAgICAiIiIKICAgICkKICAgIHJldHVybgoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oYWx0LCBkZXJpdmVkX2RmLCBwbCwgdmxfc3BlYyk6CiAgICBjaGFydCA9IGFsdC5DaGFydC5mcm9tX2pzb24odmxfc3BlYykucHJvcGVydGllcyhkYXRhPXBsLmZyb21fYXJyb3coZGVyaXZlZF9kZikpCiAgICBjaGFydAogICAgcmV0dXJuCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhtbyk6CiAgICBtby5tZCgKICAgICAgICByIiIiCiAgICAjIEZyb20gU291cmNlIERhdGEgdG8gRmluYWwgQ2hhcnQKCiAgICBUaGlzIG5vdGVib29rIHNob3dzIGhvdyBjb29yZGluYXRlZCBBSSBhZ2VudHMgdHVybmVkIGlucHV0IGRhdGEgaW50byB0aGUgdmlzdWFsaXphdGlvbiB5b3Ugc2VlIGluIHRoZSByZXBvcnQuIFdlJ2xsIHdhbGsgdGhyb3VnaCBlYWNoIHN0ZXAsIHN0YXJ0aW5nIHdpdGggdGhlIGZpbmFsIGNoYXJ0IGFuZCB3b3JraW5nIGJhY2t3YXJkcyB0byBzZWUgaG93IGl0IHdhcyBidWlsdC4gU3RhcnQgc2Nyb2xsaW5nIHRvIHRoZSByaWdodCBvciB1c2UgdGhlIGxpbmtzIGJlbG93IHRvIGp1bXAgdG8gYW55IHNlY3Rpb24uCgogICAgLSBbMS4gT3JpZ2luYWwgRGF0YXNldF0oIzEtb3JpZ2luYWwtZGF0YXNldCk6IFRoZSBkYXRhIHdlIHN0YXJ0ZWQgd2l0aAogICAgLSBbMi4gRGF0YXNldCBSZWZpbmVtZW50XSgjMi1kYXRhc2V0LXJlZmluZW1lbnQpOiBDbGVhbi11cCBhbmQgZm9ybWF0dGluZyBpbXByb3ZlbWVudHMKICAgIC0gWzMuIEZpZWxkIFJlbWFwcGluZ10oIzMtZmllbGQtcmVtYXBwaW5nKTogTWFraW5nIGNyeXB0aWMgY29kZXMgcmVhZGFibGUKICAgIC0gWzQuIERhdGFzZXQgRGVyaXZhdGlvbl0oIzQtZGF0YXNldC1kZXJpdmF0aW9uKTogVGhlIFtEdWNrREJdKGh0dHA6Ly9kdWNrZGIub3JnKSBxdWVyeSB0aGF0IGZpbHRlcmVkIGFuZCBzaGFwZWQgdGhlIGRhdGEKICAgIC0gWzUuIFZpc3VhbGl6YXRpb25dKCM1LXZpc3VhbGl6YXRpb24pOiBUaGUgY2hhcnQgY3JlYXRlZCBieSBbRHJhY29dKGh0dHBzOi8vZ2l0aHViLmNvbS9jbXVkaWcvZHJhY28yKQogICAgIiIiCiAgICApCiAgICByZXR1cm4KCgpAYXBwLmNlbGwoY29sdW1uPTEsIGhpZGVfY29kZT1UcnVlKQpkZWYgXyhmbG93Y2hhcnQsIG1vKToKICAgIG1vLm1kKHJmIiIiCiAgICAjIDQuIERhdGFzZXQgRGVyaXZhdGlvbgoKICAgIHtmbG93Y2hhcnQoc2VsZWN0ZWQ9NCl9CiAgICAiIiIpCiAgICByZXR1cm4KCgpAYXBwLmNlbGwoaGlkZV9jb2RlPVRydWUpCmRlZiBfKGdvYWwsIG1vLCBzcWwpOgogICAgbW8ubWQocmYiIiIKICAgIEFmdGVyIHRoZSBzeXN0ZW0gYW5hbHl6ZWQgdGhlIHN0YXRpc3RpY2FsIHByb2ZpbGUgb2YgdGhlIGRhdGFzZXQgYW5kIGl0cyBzZW1hbnRpY3MsIGFuIEFJIGFnZW50IGNvbmNsdWRlZCB0aGF0IGl0IHdvdWxkIGJlIGludGVyZXN0aW5nIHRvIHB1cnN1ZSB0aGUgZm9sbG93aW5nIGFuYWx5dGljYWwgZ29hbDoKCiAgICA+IHtnb2FsfQoKICAgIFRvIHNhdGlzZnkgdGhpcyBnb2FsLCB0aGUgc3lzdGVtIHdyb3RlIHRoaXMgU1FMIHF1ZXJ5OgoKICAgIGBgYHNxbAogICAge3NxbH0KICAgIGBgYAoKICAgIFRoaXMgcXVlcnkgZ290IGV4ZWN1dGVkIGFnYWluc3QgYHJlbWFwcGVkX2RmYCwgd2hpY2ggd2FzIGJ1aWx0IGJ5OgoKICAgIDEuIFN0YXJ0aW5nIHdpdGggdGhlIFtvcmlnaW5hbCBkYXRhXSgjb3JpZ2luYWwtZGF0YXNldCkKICAgIDIuIEFwcGx5aW5nIFtkYXRhIGNsZWFuLXVwXSgjZGF0YXNldC1yZWZpbmVtZW50KQogICAgMy4gTWFraW5nIFtjcnlwdGljIGNvZGVzIHJlYWRhYmxlXSgjZmllbGQtcmVtYXBwaW5nKQogICAgIiIiKQogICAgcmV0dXJuCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhkdWNrZGIsIHJlbWFwcGVkX2RmLCBzcWwpOgogICAgcmVtYXBwZWRfZGYgICMgVGhpcyBlbnN1cmVzIHRoYXQgYnkgdGhlIHRpbWUgTWFyaW1vJ3MgZGF0YWZsb3cgZ3JhcGggcmVhY2hlcyB0aGlzIG5vZGUsIGByZW1hcHBlZF9kZmAgaXMgYXZhaWxhYmxlCiAgICBkZXJpdmVkX2RmID0gZHVja2RiLnF1ZXJ5KHNxbCkuYXJyb3coKQogICAgZGVyaXZlZF9kZgogICAgcmV0dXJuIChkZXJpdmVkX2RmLCkKCgpAYXBwLmNlbGwoaGlkZV9jb2RlPVRydWUpCmRlZiBfKElOUFVUUywgZ29hbCwgc3RyaW5nKToKICAgIHNxbCA9IHN0cmluZy5UZW1wbGF0ZShJTlBVVFNbImdvYWxzIl1bZ29hbF1bInNxbCJdKS5zdWJzdGl0dXRlKAogICAgICAgIHRhYmxlbmFtZT0icmVtYXBwZWRfZGYiCiAgICApCiAgICByZXR1cm4gKHNxbCwpCgoKQGFwcC5jZWxsKGNvbHVtbj0yLCBoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oZmxvd2NoYXJ0LCBtbyk6CiAgICBtby5tZChyZiIiIgogICAgIyAzLiBGaWVsZCBSZW1hcHBpbmcKCiAgICB7Zmxvd2NoYXJ0KHNlbGVjdGVkPTMpfQogICAgIiIiKQogICAgcmV0dXJuCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhleHBhbmRlZF9maWVsZHMsIGZpZWxkX2V4cGFuc2lvbnMsIGZpZWxkX2V4cGFuc2lvbnNfdG9fbWQsIG1vKToKICAgIG1vLm1kKAogICAgICAgIHJmIiIiCiAgICBUaGUgc3lzdGVtIGxvb2tlZCBhdCBzYW1wbGUgdmFsdWVzIGFuZCBkZWNpZGVkIHRoYXQgZmllbGRzIHsiLCAiLmpvaW4oW2YiYHtmaWVsZH1gIiBmb3IgZmllbGQgaW4gZXhwYW5kZWRfZmllbGRzXSl9IG5lZWRlZCB0byBiZSBtYWRlIG1vcmUgcmVhZGFibGUuCgogICAgSGVyZSBhcmUgdGhlIG1hcHBpbmdzIHRoYXQgd2VyZSBhcHBsaWVkIHRvIHRoZSBbY2xlYW5lZCBkYXRhXSgjZGF0YXNldC1yZWZpbmVtZW50KToKCiAgICB7ZmllbGRfZXhwYW5zaW9uc190b19tZChmaWVsZF9leHBhbnNpb25zKX0KCiAgICBUaGlzIGdhdmUgdXMgYSBkYXRhc2V0IHdoZXJlIGNyeXB0aWMgY29kZXMgYXJlIHJlcGxhY2VkIHdpdGggY2xlYXIsIGh1bWFuLXJlYWRhYmxlIGxhYmVscy4KICAgICIiIgogICAgKQogICAgcmV0dXJuCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhhcHBseV9maWVsZF9leHBhbnNpb25zX3RvX2RmLCBmaWVsZF9leHBhbnNpb25zLCByZWZpbmVkX2RmKToKICAgIHJlbWFwcGVkX2RmID0gYXBwbHlfZmllbGRfZXhwYW5zaW9uc190b19kZihyZWZpbmVkX2RmLCBmaWVsZF9leHBhbnNpb25zKQogICAgcmVtYXBwZWRfZGYKICAgIHJldHVybiAocmVtYXBwZWRfZGYsKQoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oSU5QVVRTKToKICAgICMgTWFwcGluZ3MgZ2VuZXJhdGVkIGZvciBmaWVsZHMgIHdoZXJlIGBpc19jcnlwdGljX2NvZGVgIHdhcyBzZXQgdG8gVHJ1ZSBieSBhbiB1cHN0cmVhbSBhZ2VudCByZWZpbmluZyBmaWVsZHMKICAgIGZpZWxkX2V4cGFuc2lvbnMgPSBJTlBVVFNbImZpZWxkX2V4cGFuc2lvbnMiXQogICAgcmV0dXJuIChmaWVsZF9leHBhbnNpb25zLCkKCgpAYXBwLmNlbGwoaGlkZV9jb2RlPVRydWUpCmRlZiBfKFR5cGVkRGljdCwgcGEsIHBsKToKICAgIGNsYXNzIEV4cGFuZGVkRmllbGQoVHlwZWREaWN0KToKICAgICAgICBmaWVsZDogc3RyCiAgICAgICAgbWFwcGluZzogZGljdFtzdHIsIHN0cl0KCiAgICBkZWYgcmVtYXBfbGlzdF92YWx1ZXMoCiAgICAgICAgZmllbGQ6IHBsLlNlcmllcywKICAgICAgICBtYXBwaW5nOiBkaWN0W3N0ciwgc3RyXSwKICAgICkgLT4gcGwuU2VyaWVzOgogICAgICAgIGZpZWxkbmFtZSA9IGZpZWxkLm5hbWUKICAgICAgICByZXR1cm4gKAogICAgICAgICAgICBmaWVsZC50b19mcmFtZSgpCiAgICAgICAgICAgIC53aXRoX3Jvd19pbmRleCgpCiAgICAgICAgICAgIC5leHBsb2RlKGZpZWxkbmFtZSkKICAgICAgICAgICAgLndpdGhfY29sdW1ucygKICAgICAgICAgICAgICAgIHBsLmNvbChmaWVsZG5hbWUpLnJlcGxhY2UoCiAgICAgICAgICAgICAgICAgICAgb2xkPWxpc3QobWFwcGluZy5rZXlzKCkpLAogICAgICAgICAgICAgICAgICAgIG5ldz1saXN0KG1hcHBpbmcudmFsdWVzKCkpLAogICAgICAgICAgICAgICAgKQogICAgICAgICAgICApCiAgICAgICAgICAgIC5ncm91cF9ieSgiaW5kZXgiKQogICAgICAgICAgICAuYWdnKGZpZWxkbmFtZSkKICAgICAgICAgICAgLnNlbGVjdChwbC5jb2woZmllbGRuYW1lKS5saXN0LmRyb3BfbnVsbHMoKSlbZmllbGRuYW1lXQogICAgICAgICkKCiAgICBkZWYgcmVtYXBfc2NhbGFyX3ZhbHVlcygKICAgICAgICBmaWVsZDogcGwuU2VyaWVzLAogICAgICAgIG1hcHBpbmc6IGRpY3Rbc3RyLCBzdHJdLAogICAgKSAtPiBwbC5TZXJpZXM6CiAgICAgICAgcmV0dXJuIGZpZWxkLnJlcGxhY2UoCiAgICAgICAgICAgIG9sZD1saXN0KG1hcHBpbmcua2V5cygpKSwKICAgICAgICAgICAgbmV3PWxpc3QobWFwcGluZy52YWx1ZXMoKSksCiAgICAgICAgKQoKICAgIGRlZiBfYXBwbHlfZmllbGRfZXhwYW5zaW9uc190b19kZigKICAgICAgICBkZjogcGwuRGF0YUZyYW1lLAogICAgICAgIGZpZWxkX2V4cGFuc2lvbnM6IGxpc3RbRXhwYW5kZWRGaWVsZF0sCiAgICApIC0+IHBsLkRhdGFGcmFtZToKICAgICAgICBmaW5hbF9kZiA9IGRmCiAgICAgICAgZm9yIGV4cGFuc2lvbiBpbiBmaWVsZF9leHBhbnNpb25zOgogICAgICAgICAgICBmaWVsZG5hbWUgPSBleHBhbnNpb25bImZpZWxkIl0KICAgICAgICAgICAgbWFwcGluZyA9IGV4cGFuc2lvblsibWFwcGluZyJdCiAgICAgICAgICAgIGZpZWxkID0gZGZbZmllbGRuYW1lXQogICAgICAgICAgICBpZiBmaWVsZC5kdHlwZS5iYXNlX3R5cGUoKSBpcyBwbC5MaXN0OgogICAgICAgICAgICAgICAgcmVtYXBwZWRfZmllbGQgPSByZW1hcF9saXN0X3ZhbHVlcyhmaWVsZCwgbWFwcGluZykKICAgICAgICAgICAgZWxzZToKICAgICAgICAgICAgICAgIHJlbWFwcGVkX2ZpZWxkID0gcmVtYXBfc2NhbGFyX3ZhbHVlcyhmaWVsZCwgbWFwcGluZykKCiAgICAgICAgICAgIGZpbmFsX2RmID0gZmluYWxfZGYud2l0aF9jb2x1bW5zKHJlbWFwcGVkX2ZpZWxkKQoKICAgICAgICByZXR1cm4gZmluYWxfZGYKCiAgICBkZWYgYXBwbHlfZmllbGRfZXhwYW5zaW9uc190b19kZigKICAgICAgICBkZjogcGEuVGFibGUsCiAgICAgICAgZmllbGRfZXhwYW5zaW9uczogbGlzdFtFeHBhbmRlZEZpZWxkXSwKICAgICkgLT4gcGEuVGFibGU6CiAgICAgICAgZGYgPSBfYXBwbHlfZmllbGRfZXhwYW5zaW9uc190b19kZihwbC5mcm9tX2Fycm93KGRmKSwgZmllbGRfZXhwYW5zaW9ucykKICAgICAgICByZXR1cm4gcGEuVGFibGUuZnJvbV9weWxpc3QoZGYudG9fZGljdHMoKSkKCiAgICByZXR1cm4gKGFwcGx5X2ZpZWxkX2V4cGFuc2lvbnNfdG9fZGYsKQoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oZmllbGRfZXhwYW5zaW9ucyk6CiAgICBleHBhbmRlZF9maWVsZHMgPSBbaXRlbVsiZmllbGQiXSBmb3IgaXRlbSBpbiBmaWVsZF9leHBhbnNpb25zXQoKICAgIGRlZiBmaWVsZF9leHBhbnNpb25fdG9fbWQoZmllbGQ6IHN0ciwgbWFwcGluZzogZGljdFtzdHIsIHN0cl0pIC0+IHN0cjoKICAgICAgICBsaW5lcyA9IFsKICAgICAgICAgICAgZiIqKntmaWVsZH0qKiIsCiAgICAgICAgICAgICpbZiItIHtrZXl9OiB7dmFsdWV9IiBmb3Iga2V5LCB2YWx1ZSBpbiBtYXBwaW5nLml0ZW1zKCldLAogICAgICAgIF0KCiAgICAgICAgcmV0dXJuICJcblxuIi5qb2luKGxpbmVzKQoKICAgIGRlZiBmaWVsZF9leHBhbnNpb25zX3RvX21kKGZpZWxkX2V4cGFuc2lvbnM6IGxpc3QpOgogICAgICAgIHJldHVybiAiXG5cbiIuam9pbigKICAgICAgICAgICAgWwogICAgICAgICAgICAgICAgZmllbGRfZXhwYW5zaW9uX3RvX21kKGl0ZW1bImZpZWxkIl0sIGl0ZW1bIm1hcHBpbmciXSkKICAgICAgICAgICAgICAgIGZvciBpdGVtIGluIGZpZWxkX2V4cGFuc2lvbnMKICAgICAgICAgICAgXQogICAgICAgICkKCiAgICByZXR1cm4gZXhwYW5kZWRfZmllbGRzLCBmaWVsZF9leHBhbnNpb25zX3RvX21kCgoKQGFwcC5jZWxsKGNvbHVtbj0zLCBoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oZmxvd2NoYXJ0LCBtbyk6CiAgICBtby5tZCgKICAgICAgICByZiIiIgogICAgIyAyLiBEYXRhc2V0IFJlZmluZW1lbnQKCiAgICB7Zmxvd2NoYXJ0KHNlbGVjdGVkPTIpfQoKICAgIFRoZSBzeXN0ZW0gbG9va2VkIGF0IHNhbXBsZSBkYXRhIGZyb20gZWFjaCBmaWVsZCBhbmQgbWFkZSB0aGVzZSBpbXByb3ZlbWVudHMgdG8gZml4IGZvcm1hdHRpbmcgaXNzdWVzIGFuZCBtYXRjaCBob3cgdGhlIGRhdGEgc2hvdWxkIHJlYWxseSBiZSB1c2VkLgogICAgIiIiCiAgICApCiAgICByZXR1cm4KCgpAYXBwLmNlbGwoaGlkZV9jb2RlPVRydWUpCmRlZiBfKGZpZWxkX3JlZmluZW1lbnRzLCBwYSwgcGQpOgogICAgcGEuVGFibGUuZnJvbV9wYW5kYXMocGQuRGF0YUZyYW1lKGZpZWxkX3JlZmluZW1lbnRzKS5kcm9wKCJfX21ldGFkYXRhX18iLCBheGlzPTEpKQogICAgcmV0dXJuCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhtbyk6CiAgICBtby5tZCgKICAgICAgICByIiIiQWZ0ZXIgYXBwbHlpbmcgdGhlc2UgY2hhbmdlcywgd2UgZ2V0IHRoZSBjbGVhbmVkIGRhdGFzZXQgYmVsb3csIHdoaWNoIGNvbWVzIGRpcmVjdGx5IGZyb20gdGhlIFtvcmlnaW5hbCBkYXRhXSgjb3JpZ2luYWwtZGF0YXNldCkuIiIiCiAgICApCiAgICByZXR1cm4KCgpAYXBwLmNlbGwoaGlkZV9jb2RlPVRydWUpCmRlZiBfKGFwcGx5X2ZpZWxkX3JlZmluZW1lbnRzX3RvX2RmLCBkZiwgZmllbGRfcmVmaW5lbWVudHMpOgogICAgcmVmaW5lZF9kZiA9IGFwcGx5X2ZpZWxkX3JlZmluZW1lbnRzX3RvX2RmKGRmLCBmaWVsZF9yZWZpbmVtZW50cykKICAgIHJlZmluZWRfZGYKICAgIHJldHVybiAocmVmaW5lZF9kZiwpCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhDYWxsYWJsZSwgSXRlcmFibGUsIE9wdGlvbmFsLCBUeXBlZERpY3QsIHBhLCBwbCk6CiAgICBTZW1hbnRpY1R5cGUgPSBzdHIKICAgIFNlbWFudGljU2NoZW1hID0gZGljdFtzdHIsIFNlbWFudGljVHlwZV0KCiAgICBjbGFzcyBGaWVsZFJlZmluZW1lbnQoVHlwZWREaWN0KToKICAgICAgICBmaWVsZDogc3RyCiAgICAgICAgc2VtYW50aWNfdHlwZTogc3RyCiAgICAgICAgc2VwYXJhdG9yOiBPcHRpb25hbFtzdHJdCiAgICAgICAgZGF0ZV9mb3JtYXQ6IE9wdGlvbmFsW3N0cl0KICAgICAgICBpc19jcnlwdGljX2NvZGU6IE9wdGlvbmFsW2Jvb2xdCiAgICAgICAgYm9vbGVhbl90cnV0aHlfdmFsdWU6IE9wdGlvbmFsW3N0ciB8IGludCB8IGZsb2F0XQoKICAgIGNsYXNzIFNlbWFudGljVHlwZWRFeHByKFR5cGVkRGljdCk6CiAgICAgICAgZXhwcjogcGwuRXhwcgogICAgICAgIHR5cGU6IFNlbWFudGljVHlwZQoKICAgIEZpZWxkUmVmaW5lbWVudEhhbmRsZXIgPSBDYWxsYWJsZVsKICAgICAgICBbcGwuU2VyaWVzLCBGaWVsZFJlZmluZW1lbnRdLAogICAgICAgIEl0ZXJhYmxlW1NlbWFudGljVHlwZWRFeHByXSwKICAgIF0KCiAgICBkZWYgX2hhbmRsZV9zZXBhcmF0b3IoCiAgICAgICAgXzogcGwuU2VyaWVzLCByZWZpbmVtZW50OiBGaWVsZFJlZmluZW1lbnQKICAgICkgLT4gbGlzdFtTZW1hbnRpY1R5cGVkRXhwcl06CiAgICAgICAgaWYgcmVmaW5lbWVudFsic2VwYXJhdG9yIl0gaXMgTm9uZToKICAgICAgICAgICAgcmV0dXJuIFtdCgogICAgICAgIGZpZWxkbmFtZSA9IHJlZmluZW1lbnRbImZpZWxkIl0KICAgICAgICBzZXBhcmF0b3IgPSByZWZpbmVtZW50WyJzZXBhcmF0b3IiXQogICAgICAgICMgQWNjb3VudCBmb3IgdW5zb2xpY2l0ZWQgY29tbWVudHMgaW4gdGhlIG91dHB1dCBieSBzcGxpdHRpbmcgb24gd2hpdGVzcGFjZSBhbmQgdGFraW5nIHRoZSBhY3R1YWwgc2VwYXJhdG9yCiAgICAgICAgc2VwID0gc2VwYXJhdG9yLnNwbGl0KCIgIilbMF0KICAgICAgICBsaXN0X2V4cHIgPSAoCiAgICAgICAgICAgIHBsLmNvbChmaWVsZG5hbWUpCiAgICAgICAgICAgIC5zdHIuc3BsaXQoc2VwKQogICAgICAgICAgICAuZmlsbF9udWxsKFtdKQogICAgICAgICAgICAubGlzdC5ldmFsKHBsLmVsZW1lbnQoKS5zdHIuc3RyaXBfY2hhcnMoIiAiKSkKICAgICAgICAgICAgIyAubGlzdC5maWx0ZXIocGwuZWxlbWVudCgpLnN0ci5sZW5fY2hhcnMoKSA+IDApCiAgICAgICAgKQoKICAgICAgICAjIElmIGNhdGVnb3J5LCB0aGVuIGFsc28gbm9ybWFsaXplIGNhc2luZyBvZiB0aGUgaXRlbXMKICAgICAgICBpZiByZWZpbmVtZW50WyJzZW1hbnRpY190eXBlIl0gPT0gIkNhdGVnb3J5IjoKICAgICAgICAgICAgbGlzdF9leHByID0gbGlzdF9leHByLmxpc3QuZXZhbChwbC5lbGVtZW50KCkuc3RyLnRvX2xvd2VyY2FzZSgpKQoKICAgICAgICByZXR1cm4gWwogICAgICAgICAgICB7ImV4cHIiOiBsaXN0X2V4cHIsICJ0eXBlIjogcmVmaW5lbWVudFsic2VtYW50aWNfdHlwZSJdfSwKICAgICAgICBdCgogICAgZGVmIF9oYW5kbGVfZGF0ZV9mb3JtYXQoCiAgICAgICAgc2VyaWVzOiBwbC5TZXJpZXMsIHJlZmluZW1lbnQ6IEZpZWxkUmVmaW5lbWVudAogICAgKSAtPiBsaXN0W1NlbWFudGljVHlwZWRFeHByXToKICAgICAgICBpZiByZWZpbmVtZW50WyJkYXRlX2Zvcm1hdCJdIGlzIE5vbmUgb3Igc2VyaWVzLmR0eXBlLmlzX3RlbXBvcmFsKCk6CiAgICAgICAgICAgIHJldHVybiBbXQoKICAgICAgICBmaWVsZG5hbWUgPSByZWZpbmVtZW50WyJmaWVsZCJdCiAgICAgICAgZGF0ZV9mb3JtYXQgPSByZWZpbmVtZW50WyJkYXRlX2Zvcm1hdCJdCiAgICAgICAgIyBpZiBhbnkgb2YgdGhlc2UgYXJlIHByZXNlbnQgaW4gYGRhdGVfZm9ybWF0YCB0aGVuIHdlIGhhdmUgYSBkYXRldGltZQogICAgICAgIGRhdGV0aW1lX3RlbXBsYXRlX2NoYXJzID0geyIlSCIsICIlTSIsICIlUyJ9CiAgICAgICAgaXNfZGF0ZXRpbWUgPSBhbnkoKGNoIGluIGRhdGVfZm9ybWF0IGZvciBjaCBpbiBkYXRldGltZV90ZW1wbGF0ZV9jaGFycykpCiAgICAgICAgaWYgaXNfZGF0ZXRpbWU6CiAgICAgICAgICAgIGV4cHIgPSBwbC5jb2woZmllbGRuYW1lKS5jYXN0KHBsLlN0cmluZykuc3RyLnRvX2RhdGV0aW1lKGRhdGVfZm9ybWF0KQogICAgICAgIGVsc2U6CiAgICAgICAgICAgIGV4cHIgPSBwbC5jb2woZmllbGRuYW1lKS5jYXN0KHBsLlN0cmluZykuc3RyLnRvX2RhdGUoZGF0ZV9mb3JtYXQpCgogICAgICAgIHJldHVybiBbeyJleHByIjogZXhwciwgInR5cGUiOiByZWZpbmVtZW50WyJzZW1hbnRpY190eXBlIl19XQoKICAgIGRlZiBfaGFuZGxlX2Jvb2xlYW4oCiAgICAgICAgc2VyaWVzOiBwbC5TZXJpZXMsIHJlZmluZW1lbnQ6IEZpZWxkUmVmaW5lbWVudAogICAgKSAtPiBsaXN0W1NlbWFudGljVHlwZWRFeHByXToKICAgICAgICBpZiByZWZpbmVtZW50WyJib29sZWFuX3RydXRoeV92YWx1ZSJdIGlzIE5vbmUgb3Igc2VyaWVzLmR0eXBlID09IHBsLkJvb2xlYW46CiAgICAgICAgICAgIHJldHVybiBbXQogICAgICAgIGZpZWxkbmFtZSA9IHJlZmluZW1lbnRbImZpZWxkIl0KICAgICAgICBib29sZWFuX3RydXRoeV92YWx1ZSA9IHJlZmluZW1lbnRbImJvb2xlYW5fdHJ1dGh5X3ZhbHVlIl0KICAgICAgICBleHByID0gKAogICAgICAgICAgICBwbC5jb2woZmllbGRuYW1lKQogICAgICAgICAgICAuY2FzdChwbC5TdHJpbmcpCiAgICAgICAgICAgIC5lcShwbC5saXQoc3RyKGJvb2xlYW5fdHJ1dGh5X3ZhbHVlKSkpCiAgICAgICAgICAgIC5maWxsX251bGwoRmFsc2UpCiAgICAgICAgKQogICAgICAgIHJldHVybiBbeyJleHByIjogZXhwciwgInR5cGUiOiByZWZpbmVtZW50WyJzZW1hbnRpY190eXBlIl19XQoKICAgIGRlZiBfYXBwbHlfZmllbGRfcmVmaW5lbWVudHNfdG9fZGYoCiAgICAgICAgZGY6IHBsLkRhdGFGcmFtZSwKICAgICAgICByZWZpbmVtZW50czogbGlzdFtGaWVsZFJlZmluZW1lbnRdLAogICAgKSAtPiB0dXBsZVtwbC5EYXRhRnJhbWUsIFNlbWFudGljU2NoZW1hXToKICAgICAgICByZWZpbmVtZW50X2hhbmRsZXJzID0gWwogICAgICAgICAgICBfaGFuZGxlX3NlcGFyYXRvciwKICAgICAgICAgICAgX2hhbmRsZV9kYXRlX2Zvcm1hdCwKICAgICAgICAgICAgX2hhbmRsZV9ib29sZWFuLAogICAgICAgIF0KCiAgICAgICAgIyBHZW5lcmFsLCB1bmNvbmRpdGlvbmFsIHJlZmluZW1lbnQgZXhwcmVzc2lvbnMgdG8gYXBwbHkgY29tbW9uIG5vcm1hbGl6YXRpb25zCiAgICAgICAgc3RyaXBfc3BhY2VzX3NjYWxhciA9IHBsLmNvbChwbC5TdHJpbmcpLnN0ci5zdHJpcF9jaGFycygiICIpCiAgICAgICAgc3RyaXBfc3BhY2VzX2xpc3QgPSBwbC5jb2wocGwuTGlzdChwbC5TdHJpbmcpKS5saXN0LmV2YWwoCiAgICAgICAgICAgIHBsLmVsZW1lbnQoKS5zdHIuc3RyaXBfY2hhcnMoIiAiKQogICAgICAgICkKICAgICAgICBnZW5lcmFsX3JlZmluZW1lbnRfZXhwcnM6IGxpc3RbcGwuRXhwcl0gPSBbCiAgICAgICAgICAgIHN0cmlwX3NwYWNlc19zY2FsYXIsCiAgICAgICAgICAgIHN0cmlwX3NwYWNlc19saXN0LAogICAgICAgIF0KICAgICAgICByZWZpbmVkX2RmID0gZGYud2l0aF9jb2x1bW5zKCpnZW5lcmFsX3JlZmluZW1lbnRfZXhwcnMpCiAgICAgICAgc2VtYW50aWNfc2NoZW1hOiBTZW1hbnRpY1NjaGVtYSA9IHt9CgogICAgICAgIGZvciByZWZpbmVtZW50IGluIHJlZmluZW1lbnRzOgogICAgICAgICAgICBmb3IgaGFuZGxlciBpbiByZWZpbmVtZW50X2hhbmRsZXJzOgogICAgICAgICAgICAgICAgc2VyaWVzID0gZGYuZ2V0X2NvbHVtbihyZWZpbmVtZW50WyJmaWVsZCJdKQogICAgICAgICAgICAgICAgcmVmaW5lcl9leHByZXNzaW9ucyA9IGhhbmRsZXIoc2VyaWVzLCByZWZpbmVtZW50KQogICAgICAgICAgICAgICAgZXhwcnMgPSBbCiAgICAgICAgICAgICAgICAgICAgZXhwcl93aXRoX3NlbWFudGljX3R5cGVbImV4cHIiXQogICAgICAgICAgICAgICAgICAgIGZvciBleHByX3dpdGhfc2VtYW50aWNfdHlwZSBpbiByZWZpbmVyX2V4cHJlc3Npb25zCiAgICAgICAgICAgICAgICBdCiAgICAgICAgICAgICAgICBzdWJzY2hlbWEgPSB7cmVmaW5lbWVudFsiZmllbGQiXTogcmVmaW5lbWVudFsic2VtYW50aWNfdHlwZSJdfSB8IHsKICAgICAgICAgICAgICAgICAgICBleHByX3dpdGhfc2VtYW50aWNfdHlwZVsKICAgICAgICAgICAgICAgICAgICAgICAgImV4cHIiCiAgICAgICAgICAgICAgICAgICAgXS5tZXRhLm91dHB1dF9uYW1lKCk6IGV4cHJfd2l0aF9zZW1hbnRpY190eXBlWyJ0eXBlIl0KICAgICAgICAgICAgICAgICAgICBmb3IgZXhwcl93aXRoX3NlbWFudGljX3R5cGUgaW4gcmVmaW5lcl9leHByZXNzaW9ucwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgcmVmaW5lZF9kZiA9IHJlZmluZWRfZGYud2l0aF9jb2x1bW5zKCpleHBycykKICAgICAgICAgICAgICAgIHNlbWFudGljX3NjaGVtYSA9IHNlbWFudGljX3NjaGVtYSB8IHN1YnNjaGVtYSAgIyB0eXBlOiBpZ25vcmUKCiAgICAgICAgIyBTZWxlY3QgY29sdW1ucyB0byBtYXRjaCB0aGUgb3JkZXIgb2YgdGhlIHNlbWFudGljIHNjaGVtYQogICAgICAgIHJlZmluZWRfZGYgPSByZWZpbmVkX2RmLnNlbGVjdChsaXN0KHNlbWFudGljX3NjaGVtYS5rZXlzKCkpKQoKICAgICAgICByZXR1cm4gcmVmaW5lZF9kZiwgc2VtYW50aWNfc2NoZW1hICAjIHR5cGU6IGlnbm9yZQoKICAgIGRlZiBhcHBseV9maWVsZF9yZWZpbmVtZW50c190b19kZigKICAgICAgICBkZjogcGEuVGFibGUsCiAgICAgICAgcmVmaW5lbWVudHM6IGxpc3RbRmllbGRSZWZpbmVtZW50XSwKICAgICkgLT4gcGEuVGFibGU6CiAgICAgICAgZGYsIF8gPSBfYXBwbHlfZmllbGRfcmVmaW5lbWVudHNfdG9fZGYocGwuZnJvbV9hcnJvdyhkZiksIHJlZmluZW1lbnRzKQogICAgICAgIHJldHVybiBwYS5UYWJsZS5mcm9tX3B5bGlzdChkZi50b19kaWN0cygpKQoKICAgIHJldHVybiAoYXBwbHlfZmllbGRfcmVmaW5lbWVudHNfdG9fZGYsKQoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oSU5QVVRTKToKICAgICMgUmVmaW5lbWVudHMgc3VnZ2VzdGVkIGJ5IEFJIGFnZW50IGZvciBlYWNoIGZpZWxkIHRvIGdldCBhIHJlcHJlc2VudGF0aW9uIHRoYXQgYmV0dGVyIGNhcHR1cmVzIGZpZWxkIHNlbWFudGljcwogICAgZmllbGRfcmVmaW5lbWVudHMgPSBJTlBVVFNbImZpZWxkX3JlZmluZW1lbnRzIl0KICAgIHJldHVybiAoZmllbGRfcmVmaW5lbWVudHMsKQoKCkBhcHAuY2VsbChjb2x1bW49NCwgaGlkZV9jb2RlPVRydWUpCmRlZiBfKGRhdGFzZXRfdXJpLCBmbG93Y2hhcnQsIG1vKToKICAgIG1vLm1kKAogICAgICAgIHJmIiIiCiAgICAjIDEuIE9yaWdpbmFsIERhdGFzZXQKCiAgICB7Zmxvd2NoYXJ0KHNlbGVjdGVkPTEpfQoKICAgIFRoaXMgaXMgdGhlIHJhdyBkYXRhIHdlIHN0YXJ0ZWQgd2l0aCwgbG9hZGVkIGZyb20ge2RhdGFzZXRfdXJpfS4KICAgICIiIgogICAgKQogICAgcmV0dXJuCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhkYXRhc2V0X3VyaSwgcmVhZF9kYXRhc2V0KToKICAgIGRmID0gcmVhZF9kYXRhc2V0KGRhdGFzZXRfdXJpKQogICAgZGYKICAgIHJldHVybiAoZGYsKQoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oZHVja2RiLCBwYSwgcGQpOgogICAgZGVmIHJlYWRfZGF0YXNldChkYXRhc2V0X3VyaTogc3RyKSAtPiBwYS5UYWJsZToKICAgICAgICAjIFVzaW5nIFBhbmRhcyB0byByZWFkIGRhdGFzZXQgc28gdGhhdCB3ZSBoYXZlIG5vIG5ldHdvcmtpbmcgaXNzdWVzIGluIFB5b2RpZGUtYmFzZWQgTWFyaW1vIGVudgogICAgICAgIGlmIGRhdGFzZXRfdXJpLmVuZHN3aXRoKCIuY3N2Iikgb3IgZGF0YXNldF91cmkuZW5kc3dpdGgoIi5jc3YuZ3oiKToKICAgICAgICAgICAgcGFuZGFzX2RmID0gcGQucmVhZF9jc3YoZGF0YXNldF91cmkpCiAgICAgICAgZWxpZiBkYXRhc2V0X3VyaS5lbmRzd2l0aCgiLnBhcnF1ZXQiKToKICAgICAgICAgICAgcGFuZGFzX2RmID0gcGQucmVhZF9wYXJxdWV0KGRhdGFzZXRfdXJpKQogICAgICAgIGVsaWYgZGF0YXNldF91cmkuZW5kc3dpdGgoIi5qc29uIik6CiAgICAgICAgICAgIHBhbmRhc19kZiA9IHBkLnJlYWRfanNvbihkYXRhc2V0X3VyaSkKICAgICAgICBlbHNlOgogICAgICAgICAgICByYWlzZSBOb3RJbXBsZW1lbnRlZEVycm9yKGYiTm8gc3VwcG9ydCBmb3IgcmVhZGluZyB7ZGF0YXNldF91cml9IikKCiAgICAgICAgcmV0dXJuIGR1Y2tkYi5xdWVyeSgic2VsZWN0ICogZnJvbSBwYW5kYXNfZGYiKS5hcnJvdygpCgogICAgcmV0dXJuIChyZWFkX2RhdGFzZXQsKQoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oSU5QVVRTKToKICAgICMgT3JpZ2luYWwsIHVucHJvY2Vzc2VkIGRhdGFzZXQKICAgIGRhdGFzZXRfdXJpID0gSU5QVVRTWyJkYXRhc2V0X3VyaSJdCiAgICByZXR1cm4gKGRhdGFzZXRfdXJpLCkKCgpAYXBwLmNlbGwoaGlkZV9jb2RlPVRydWUpCmRlZiBfKGh0dHB4KToKICAgICMgVGhlc2UgYXJlIHRoZSBvbmx5IGlucHV0cyBvZiB0aGUgbm90ZWJvb2sgdGVtcGxhdGUsIGFsbCBvdGhlciBjZWxscyBhcmUgZnVuY3Rpb25zIG9mIHRoZXNlCgogICAgcHJvdmVuYW5jZV9qc29uX3VybCA9ICIkcHJvdmVuYW5jZV9qc29uX3VybCIKICAgIGdvYWwgPSAiJGdvYWwiCiAgICB2bF9zcGVjID0gIiIiJHZsX3NwZWMiIiIKCiAgICBJTlBVVFMgPSBodHRweC5nZXQocHJvdmVuYW5jZV9qc29uX3VybCkuanNvbigpCiAgICByZXR1cm4gSU5QVVRTLCBnb2FsLCB2bF9zcGVjCgoKQGFwcC5jZWxsKGhpZGVfY29kZT1UcnVlKQpkZWYgXyhtbyk6CiAgICBkZWYgZmxvd2NoYXJ0KHNlbGVjdGVkOiBpbnQpOgogICAgICAgIG5vZGVzID0gWyJBIiwgIkIiLCAiQyIsICJEIiwgIkUiXQogICAgICAgIHNlbGVjdGVkX25vZGUgPSBub2Rlc1tzZWxlY3RlZCAtIDFdCiAgICAgICAgcmV0dXJuIG1vLm1lcm1haWQocmYiIiIKICAgIGZsb3djaGFydCBSTAogICAgICAgICUlIERlZmluZSBOb2RlcwogICAgICAgIEEoMVwuIE9yaWdpbmFsIERhdGFzZXQpCiAgICAgICAgQlsyXC4gRGF0YXNldCBSZWZpbmVtZW50XQogICAgICAgIENbM1wuIEZpZWxkIFJlbWFwcGluZ10KICAgICAgICBEWzRcLiBEYXRhc2V0IERlcml2YXRpb25dCiAgICAgICAgRShbNVwuIFZpc3VhbGl6YXRpb25dKQoKICAgICAgICAlJSBEZWZpbmUgQ29ubmVjdGlvbnMKICAgICAgICBBIC0tPnxDbGVhbiAmIEZvcm1hdHwgQgogICAgICAgIEIgLS0+fE1ha2UgQ29kZXMgUmVhZGFibGV8IEMKICAgICAgICBDIC0tPnxGaWx0ZXIgJiBTaGFwZSBEYXRhIHVzaW5nIER1Y2tEQnwgRAogICAgICAgIEQgLS0+fEdlbmVyYXRlIENoYXJ0IFNwZWMgdXNpbmcgRHJhY298IEUKCiAgICAgICAgJSUgRGVmaW5lIGNsaWNrYWJsZSBsaW5rcyBmb3IgZWFjaCBub2RlCiAgICAgICAgY2xpY2sgQSAiIzEtb3JpZ2luYWwtZGF0YXNldCIgIkdvIHRvIE9yaWdpbmFsIERhdGFzZXQgc2VjdGlvbiIKICAgICAgICBjbGljayBCICIjMi1kYXRhc2V0LXJlZmluZW1lbnQiICJHbyB0byBEYXRhc2V0IFJlZmluZW1lbnQgc2VjdGlvbiIKICAgICAgICBjbGljayBDICIjMy1maWVsZC1yZW1hcHBpbmciICJHbyB0byBGaWVsZCBSZW1hcHBpbmcgc2VjdGlvbiIKICAgICAgICBjbGljayBEICIjNC1kYXRhc2V0LWRlcml2YXRpb24iICJHbyB0byBEYXRhc2V0IERlcml2YXRpb24gc2VjdGlvbiIKICAgICAgICBjbGljayBFICIjNS12aXN1YWxpemF0aW9uIiAiR28gdG8gVmlzdWFsaXphdGlvbiBzZWN0aW9uIgoKICAgICAgICAlJSBTdHlsZSB0aGUgc2VsZWN0ZWQgbm9kZQogICAgICAgIGNsYXNzRGVmIHNlbGVjdGVkIGZpbGw6I2NkZTRmZixzdHJva2U6IzVhOTZkOCxzdHJva2Utd2lkdGg6M3B4CiAgICAgICAgY2xhc3Mge3NlbGVjdGVkX25vZGV9IHNlbGVjdGVkCiAgICAiIiIpCgogICAgcmV0dXJuIChmbG93Y2hhcnQsKQoKCkBhcHAuY2VsbChoaWRlX2NvZGU9VHJ1ZSkKZGVmIF8oKToKICAgIGltcG9ydCBzdHJpbmcKICAgIGZyb20gdHlwaW5nIGltcG9ydCBDYWxsYWJsZSwgSXRlcmFibGUsIE9wdGlvbmFsCgogICAgaW1wb3J0IGFsdGFpciBhcyBhbHQKICAgIGltcG9ydCBkdWNrZGIKICAgIGltcG9ydCBodHRweAogICAgaW1wb3J0IG1hcmltbyBhcyBtbwogICAgaW1wb3J0IHBhbmRhcyBhcyBwZAogICAgaW1wb3J0IHBvbGFycyBhcyBwbAogICAgaW1wb3J0IHB5YXJyb3cgYXMgcGEKICAgIGZyb20gdHlwaW5nX2V4dGVuc2lvbnMgaW1wb3J0IFR5cGVkRGljdAoKICAgIHJldHVybiAoCiAgICAgICAgQ2FsbGFibGUsCiAgICAgICAgSXRlcmFibGUsCiAgICAgICAgT3B0aW9uYWwsCiAgICAgICAgVHlwZWREaWN0LAogICAgICAgIGFsdCwKICAgICAgICBkdWNrZGIsCiAgICAgICAgaHR0cHgsCiAgICAgICAgbW8sCiAgICAgICAgcGEsCiAgICAgICAgcGQsCiAgICAgICAgcGwsCiAgICAgICAgc3RyaW5nLAogICAgKQoKCmlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgICBhcHAucnVuKCkK",
				t = atob(e);
			return {
				provenanceNotebookTemplateBase64: e,
				provenanceNotebookTemplate: t,
			};
		},
		inputs: [],
		outputs: ["provenanceNotebookTemplateBase64", "provenanceNotebookTemplate"],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
L(
	{ root: document.getElementById("cell-23"), expanded: [], variables: [] },
	{
		id: 23,
		body: (e) => ({ uiInitResult: e() }),
		inputs: ["initializeReportUI"],
		outputs: ["uiInitResult"],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
export { p as _ };
