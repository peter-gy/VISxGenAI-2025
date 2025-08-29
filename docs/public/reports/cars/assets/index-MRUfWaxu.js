const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f || (m.f = ["./inputs-DoHVubAa.js", "./inputs-Cuu9vI3M.css"]),
) => i.map((i) => d[i]);
(function () {
	const t = document.createElement("link").relList;
	if (t && t.supports && t.supports("modulepreload")) return;
	for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
	new MutationObserver((o) => {
		for (const r of o)
			if (r.type === "childList")
				for (const l of r.addedNodes)
					l.tagName === "LINK" && l.rel === "modulepreload" && n(l);
	}).observe(document, { childList: !0, subtree: !0 });
	function i(o) {
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
	function n(o) {
		if (o.ep) return;
		o.ep = !0;
		const r = i(o);
		fetch(o.href, r);
	}
})();
const ut = "modulepreload",
	gt = function (e, t) {
		return new URL(e, t).href;
	},
	Fe = {},
	C = function (t, i, n) {
		let o = Promise.resolve();
		if (i && i.length > 0) {
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
			const l = document.getElementsByTagName("link"),
				a = document.querySelector("meta[property=csp-nonce]"),
				c = a?.nonce || a?.getAttribute("nonce");
			o = s(
				i.map((d) => {
					if (((d = gt(d, n)), d in Fe)) return;
					Fe[d] = !0;
					const u = d.endsWith(".css"),
						g = u ? '[rel="stylesheet"]' : "";
					if (!!n)
						for (let G = l.length - 1; G >= 0; G--) {
							const _ = l[G];
							if (_.href === d && (!u || _.rel === "stylesheet")) return;
						}
					else if (document.querySelector(`link[href="${d}"]${g}`)) return;
					const I = document.createElement("link");
					if (
						((I.rel = u ? "stylesheet" : ut),
						u || (I.as = "script"),
						(I.crossOrigin = ""),
						(I.href = d),
						c && I.setAttribute("nonce", c),
						document.head.appendChild(I),
						u)
					)
						return new Promise((G, _) => {
							I.addEventListener("load", G),
								I.addEventListener("error", () =>
									_(new Error(`Unable to preload CSS for ${d}`)),
								);
						});
				}),
			);
		}
		function r(l) {
			const a = new Event("vite:preloadError", { cancelable: !0 });
			if (((a.payload = l), window.dispatchEvent(a), !a.defaultPrevented))
				throw l;
		}
		return o.then((l) => {
			for (const a of l || []) a.status === "rejected" && r(a.reason);
			return t().catch(r);
		});
	};
function le(e, t, i) {
	i = i || {};
	var n = e.ownerDocument,
		o = n.defaultView.CustomEvent;
	typeof o == "function"
		? (o = new o(t, { detail: i }))
		: ((o = n.createEvent("Event")), o.initEvent(t, !1, !1), (o.detail = i)),
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
function ze(e) {
	return e === (e | 0) + "";
}
function B(e) {
	const t = document.createElement("span");
	return (
		(t.className = "observablehq--cellname"), (t.textContent = `${e} = `), t
	);
}
const It = Symbol.prototype.toString;
function z(e) {
	return It.call(e);
}
const {
		getOwnPropertySymbols: mt,
		prototype: { hasOwnProperty: pt },
	} = Object,
	{ toStringTag: Ct } = Symbol,
	Le = {},
	q = mt;
function ge(e, t) {
	return pt.call(e, t);
}
function fe(e) {
	return e[Ct] || (e.constructor && e.constructor.name) || "Object";
}
function W(e, t) {
	try {
		const i = e[t];
		return i && i.constructor, i;
	} catch {
		return Le;
	}
}
const ft = [
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
		let t = ft.filter(({ symbol: l }) => e[l] === !0);
		if (!t.length) return;
		const i = t.find((l) => !l.modifier),
			n = i.name === "Map" && t.find((l) => l.modifier && l.prefix),
			o = t.some((l) => l.arrayish),
			r = t.some((l) => l.setish);
		return {
			name: `${n ? n.name : ""}${i.name}`,
			symbols: t,
			arrayish: o && !r,
			setish: r,
		};
	} catch {
		return null;
	}
}
const { getPrototypeOf: _e, getOwnPropertyDescriptors: bt } = Object,
	Oe = _e({});
function Pe(e, t, i, n) {
	let o = Te(e),
		r,
		l,
		a,
		c;
	e instanceof Map
		? e instanceof e.constructor
			? ((r = `Map(${e.size})`), (l = ht))
			: ((r = "Map()"), (l = M))
		: e instanceof Set
			? e instanceof e.constructor
				? ((r = `Set(${e.size})`), (l = At))
				: ((r = "Set()"), (l = M))
			: o
				? ((r = `${e.constructor.name}(${e.length})`), (l = _t))
				: (c = je(e))
					? ((r = `Immutable.${c.name}${c.name === "Record" ? "" : `(${e.size})`}`),
						(o = c.arrayish),
						(l = c.arrayish ? yt : c.setish ? Zt : wt))
					: n
						? ((r = fe(e)), (l = Gt))
						: ((r = fe(e)), (l = M));
	const s = document.createElement("span");
	(s.className = "observablehq--expanded"), i && s.appendChild(B(i));
	const d = s.appendChild(document.createElement("a"));
	(d.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M4 7L0 1h8z' fill='currentColor' />
  </svg>`),
		d.appendChild(document.createTextNode(`${r}${o ? " [" : " {"}`)),
		d.addEventListener("mouseup", function (u) {
			u.stopPropagation(), se(s, ye(e, null, i, n));
		}),
		(l = l(e));
	for (let u = 0; !(a = l.next()).done && u < 20; ++u) s.appendChild(a.value);
	if (!a.done) {
		const u = s.appendChild(document.createElement("a"));
		(u.className = "observablehq--field"),
			(u.style.display = "block"),
			u.appendChild(document.createTextNode("  … more")),
			u.addEventListener("mouseup", function (g) {
				g.stopPropagation(),
					s.insertBefore(a.value, s.lastChild.previousSibling);
				for (let f = 0; !(a = l.next()).done && f < 19; ++f)
					s.insertBefore(a.value, s.lastChild.previousSibling);
				a.done && s.removeChild(s.lastChild.previousSibling), le(s, "load");
			});
	}
	return s.appendChild(document.createTextNode(o ? "]" : "}")), s;
}
function* ht(e) {
	for (const [t, i] of e) yield Wt(t, i);
	yield* M(e);
}
function* At(e) {
	for (const t of e) yield Qe(t);
	yield* M(e);
}
function* Zt(e) {
	for (const t of e) yield Qe(t);
}
function* _t(e) {
	for (let t = 0, i = e.length; t < i; ++t)
		t in e && (yield R(t, W(e, t), "observablehq--index"));
	for (const t in e)
		!ze(t) && ge(e, t) && (yield R(t, W(e, t), "observablehq--key"));
	for (const t of q(e)) yield R(z(t), W(e, t), "observablehq--symbol");
}
function* yt(e) {
	let t = 0;
	for (const i = e.size; t < i; ++t) yield R(t, e.get(t), !0);
}
function* Gt(e) {
	for (const i in bt(e)) yield R(i, W(e, i), "observablehq--key");
	for (const i of q(e)) yield R(z(i), W(e, i), "observablehq--symbol");
	const t = _e(e);
	t && t !== Oe && (yield Me(t));
}
function* M(e) {
	for (const i in e) ge(e, i) && (yield R(i, W(e, i), "observablehq--key"));
	for (const i of q(e)) yield R(z(i), W(e, i), "observablehq--symbol");
	const t = _e(e);
	t && t !== Oe && (yield Me(t));
}
function* wt(e) {
	for (const [t, i] of e) yield R(t, i, "observablehq--key");
}
function Me(e) {
	const t = document.createElement("div"),
		i = t.appendChild(document.createElement("span"));
	return (
		(t.className = "observablehq--field"),
		(i.className = "observablehq--prototype-key"),
		(i.textContent = "  <prototype>"),
		t.appendChild(document.createTextNode(": ")),
		t.appendChild(w(e, void 0, void 0, void 0, !0)),
		t
	);
}
function R(e, t, i) {
	const n = document.createElement("div"),
		o = n.appendChild(document.createElement("span"));
	return (
		(n.className = "observablehq--field"),
		(o.className = i),
		(o.textContent = `  ${e}`),
		n.appendChild(document.createTextNode(": ")),
		n.appendChild(w(t)),
		n
	);
}
function Wt(e, t) {
	const i = document.createElement("div");
	return (
		(i.className = "observablehq--field"),
		i.appendChild(document.createTextNode("  ")),
		i.appendChild(w(e)),
		i.appendChild(document.createTextNode(" => ")),
		i.appendChild(w(t)),
		i
	);
}
function Qe(e) {
	const t = document.createElement("div");
	return (
		(t.className = "observablehq--field"),
		t.appendChild(document.createTextNode("  ")),
		t.appendChild(w(e)),
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
function ye(e, t, i, n) {
	let o = Te(e),
		r,
		l,
		a,
		c;
	if (
		(e instanceof Map
			? e instanceof e.constructor
				? ((r = `Map(${e.size})`), (l = vt))
				: ((r = "Map()"), (l = Q))
			: e instanceof Set
				? e instanceof e.constructor
					? ((r = `Set(${e.size})`), (l = Vt))
					: ((r = "Set()"), (l = Q))
				: o
					? ((r = `${e.constructor.name}(${e.length})`), (l = Rt))
					: (c = je(e))
						? ((r = `Immutable.${c.name}${c.name === "Record" ? "" : `(${e.size})`}`),
							(o = c.arrayish),
							(l = c.arrayish ? Xt : c.setish ? Bt : Yt))
						: ((r = fe(e)), (l = Q)),
		t)
	) {
		const u = document.createElement("span");
		return (
			(u.className = "observablehq--shallow"),
			i && u.appendChild(B(i)),
			u.appendChild(document.createTextNode(r)),
			u.addEventListener("mouseup", function (g) {
				Ne(u) || (g.stopPropagation(), se(u, ye(e)));
			}),
			u
		);
	}
	const s = document.createElement("span");
	(s.className = "observablehq--collapsed"), i && s.appendChild(B(i));
	const d = s.appendChild(document.createElement("a"));
	(d.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`),
		d.appendChild(document.createTextNode(`${r}${o ? " [" : " {"}`)),
		s.addEventListener(
			"mouseup",
			function (u) {
				Ne(s) || (u.stopPropagation(), se(s, Pe(e, null, i, n)));
			},
			!0,
		),
		(l = l(e));
	for (let u = 0; !(a = l.next()).done && u < 20; ++u)
		u > 0 && s.appendChild(document.createTextNode(", ")),
			s.appendChild(a.value);
	return (
		a.done || s.appendChild(document.createTextNode(", …")),
		s.appendChild(document.createTextNode(o ? "]" : "}")),
		s
	);
}
function* vt(e) {
	for (const [t, i] of e) yield Ft(t, i);
	yield* Q(e);
}
function* Vt(e) {
	for (const t of e) yield w(t, !0);
	yield* Q(e);
}
function* Bt(e) {
	for (const t of e) yield w(t, !0);
}
function* Xt(e) {
	let t = -1,
		i = 0;
	for (const n = e.size; i < n; ++i)
		i > t + 1 && (yield ae(i - t - 1)), yield w(e.get(i), !0), (t = i);
	i > t + 1 && (yield ae(i - t - 1));
}
function* Rt(e) {
	let t = -1,
		i = 0;
	for (const n = e.length; i < n; ++i)
		i in e &&
			(i > t + 1 && (yield ae(i - t - 1)), yield w(W(e, i), !0), (t = i));
	i > t + 1 && (yield ae(i - t - 1));
	for (const n in e)
		!ze(n) && ge(e, n) && (yield D(n, W(e, n), "observablehq--key"));
	for (const n of q(e)) yield D(z(n), W(e, n), "observablehq--symbol");
}
function* Q(e) {
	for (const t in e) ge(e, t) && (yield D(t, W(e, t), "observablehq--key"));
	for (const t of q(e)) yield D(z(t), W(e, t), "observablehq--symbol");
}
function* Yt(e) {
	for (const [t, i] of e) yield D(t, i, "observablehq--key");
}
function ae(e) {
	const t = document.createElement("span");
	return (
		(t.className = "observablehq--empty"),
		(t.textContent = e === 1 ? "empty" : `empty × ${e}`),
		t
	);
}
function D(e, t, i) {
	const n = document.createDocumentFragment(),
		o = n.appendChild(document.createElement("span"));
	return (
		(o.className = i),
		(o.textContent = e),
		n.appendChild(document.createTextNode(": ")),
		n.appendChild(w(t, !0)),
		n
	);
}
function Ft(e, t) {
	const i = document.createDocumentFragment();
	return (
		i.appendChild(w(e, !0)),
		i.appendChild(document.createTextNode(" => ")),
		i.appendChild(w(t, !0)),
		i
	);
}
function Nt(e, t) {
	if ((e instanceof Date || (e = new Date(+e)), isNaN(e)))
		return typeof t == "function" ? t(e) : t;
	const i = e.getUTCHours(),
		n = e.getUTCMinutes(),
		o = e.getUTCSeconds(),
		r = e.getUTCMilliseconds();
	return `${kt(e.getUTCFullYear())}-${X(e.getUTCMonth() + 1, 2)}-${X(e.getUTCDate(), 2)}${i || n || o || r ? `T${X(i, 2)}:${X(n, 2)}${o || r ? `:${X(o, 2)}${r ? `.${X(r, 3)}` : ""}` : ""}Z` : ""}`;
}
function kt(e) {
	return e < 0 ? `-${X(-e, 6)}` : e > 9999 ? `+${X(e, 6)}` : X(e, 4);
}
function X(e, t) {
	return `${e}`.padStart(t, "0");
}
function Ht(e) {
	return Nt(e, "Invalid Date");
}
var Et = Error.prototype.toString;
function Kt(e) {
	return e.stack || Et.call(e);
}
var St = RegExp.prototype.toString;
function xt(e) {
	return St.call(e);
}
const pe = 20;
function Jt(e, t, i, n) {
	if (t === !1) {
		if (He(e, /["\n]/g) <= He(e, /`|\${/g)) {
			const s = document.createElement("span");
			n && s.appendChild(B(n));
			const d = s.appendChild(document.createElement("span"));
			return (
				(d.className = "observablehq--string"),
				(d.textContent = JSON.stringify(e)),
				s
			);
		}
		const l = e.split(`
`);
		if (l.length > pe && !i) {
			const s = document.createElement("div");
			n && s.appendChild(B(n));
			const d = s.appendChild(document.createElement("span"));
			(d.className = "observablehq--string"),
				(d.textContent =
					"`" +
					ke(
						l.slice(0, pe).join(`
`),
					));
			const u = s.appendChild(document.createElement("span")),
				g = l.length - pe;
			return (
				(u.textContent = `Show ${g} truncated line${g > 1 ? "s" : ""}`),
				(u.className = "observablehq--string-expand"),
				u.addEventListener("mouseup", function (f) {
					f.stopPropagation(), se(s, w(e, t, !0, n));
				}),
				s
			);
		}
		const a = document.createElement("span");
		n && a.appendChild(B(n));
		const c = a.appendChild(document.createElement("span"));
		return (
			(c.className = `observablehq--string${i ? " observablehq--expanded" : ""}`),
			(c.textContent = "`" + ke(e) + "`"),
			a
		);
	}
	const o = document.createElement("span");
	n && o.appendChild(B(n));
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
	for (var i = 0; t.exec(e); ) ++i;
	return i;
}
var zt = Function.prototype.toString,
	Lt = { prefix: "async ƒ" },
	jt = { prefix: "async ƒ*" },
	Ee = { prefix: "class" },
	Ot = { prefix: "ƒ" },
	Pt = { prefix: "ƒ*" };
function Mt(e, t) {
	var i,
		n,
		o = zt.call(e);
	switch (e.constructor && e.constructor.name) {
		case "AsyncFunction":
			i = Lt;
			break;
		case "AsyncGeneratorFunction":
			i = jt;
			break;
		case "GeneratorFunction":
			i = Pt;
			break;
		default:
			i = /^class\b/.test(o) ? Ee : Ot;
			break;
	}
	return i === Ee
		? P(i, "", t)
		: (n = /^(?:async\s*)?(\w+)\s*=>/.exec(o))
			? P(i, "(" + n[1] + ")", t)
			: (n = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(o))
				? P(i, n[1] ? "(" + n[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t)
				: (n =
							/^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(
								o,
							))
					? P(i, n[1] ? "(" + n[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t)
					: P(i, "(…)", t);
}
function P(e, t, i) {
	var n = document.createElement("span");
	(n.className = "observablehq--function"), i && n.appendChild(B(i));
	var o = n.appendChild(document.createElement("span"));
	return (
		(o.className = "observablehq--keyword"),
		(o.textContent = e.prefix),
		n.appendChild(document.createTextNode(t)),
		n
	);
}
const {
	prototype: { toString: Qt },
} = Object;
function w(e, t, i, n, o) {
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
			e = z(e);
			break;
		}
		case "function":
			return Mt(e, n);
		case "string":
			return Jt(e, t, i, n);
		default: {
			if (e === null) {
				(r = null), (e = "null");
				break;
			}
			if (e instanceof Date) {
				(r = "date"), (e = Ht(e));
				break;
			}
			if (e === Le) {
				(r = "forbidden"), (e = "[forbidden]");
				break;
			}
			switch (Qt.call(e)) {
				case "[object RegExp]": {
					(r = "regexp"), (e = xt(e));
					break;
				}
				case "[object Error]":
				case "[object DOMException]": {
					(r = "error"), (e = Kt(e));
					break;
				}
				default:
					return (i ? Pe : ye)(e, t, n, o);
			}
			break;
		}
	}
	const l = document.createElement("span");
	n && l.appendChild(B(n));
	const a = l.appendChild(document.createElement("span"));
	return (a.className = `observablehq--${r}`), (a.textContent = e), l;
}
function se(e, t) {
	e.classList.contains("observablehq--inspect") &&
		t.classList.add("observablehq--inspect"),
		e.parentNode.replaceChild(t, e),
		le(t, "load");
}
const Ut = /\s+\(\d+:\d+\)$/m;
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
	fulfilled(t, i) {
		const { _node: n } = this;
		if (
			((!Dt(t) || (t.parentNode && t.parentNode !== n)) &&
				((t = w(
					t,
					!1,
					n.firstChild &&
						n.firstChild.classList &&
						n.firstChild.classList.contains("observablehq--expanded"),
					i,
				)),
				t.classList.add("observablehq--inspect")),
			n.classList.remove("observablehq--running", "observablehq--error"),
			n.firstChild !== t)
		)
			if (n.firstChild) {
				for (; n.lastChild !== n.firstChild; ) n.removeChild(n.lastChild);
				n.replaceChild(t, n.firstChild);
			} else n.appendChild(t);
		le(n, "update");
	}
	rejected(t, i) {
		const { _node: n } = this;
		for (
			n.classList.remove("observablehq--running"),
				n.classList.add("observablehq--error");
			n.lastChild;
		)
			n.removeChild(n.lastChild);
		var o = document.createElement("div");
		(o.className = "observablehq--inspect"),
			i && o.appendChild(B(i)),
			o.appendChild(document.createTextNode((t + "").replace(Ut, ""))),
			n.appendChild(o),
			le(n, "error", { error: t });
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
	const i = document.createElement("div");
	if ((new ce(i).fulfilled(e), t))
		for (const n of t) {
			let o = i;
			for (const r of n) o = o?.childNodes[r];
			o?.dispatchEvent(new Event("mouseup"));
		}
	return i;
}
function qt(e) {
	const t = document.createElement("div");
	return new ce(t).rejected(e), t;
}
function ei(e) {
	if (!ii(e)) return;
	const t = e.querySelectorAll(".observablehq--expanded");
	if (t.length) return Array.from(t, (i) => ni(e, i));
}
function ti(e) {
	return e.nodeType === 1;
}
function ii(e) {
	return ti(e) && e.classList.contains("observablehq");
}
function ni(e, t) {
	const i = [];
	for (; t !== e; ) i.push(oi(t)), (t = t.parentNode);
	return i.reverse();
}
function oi(e) {
	return Array.prototype.indexOf.call(e.parentNode.childNodes, e);
}
const ri = [
		"audio source[src]",
		"audio[src]",
		"img[src]",
		"picture source[src]",
		"video source[src]",
		"video[src]",
	].join(),
	li = ["img[srcset]", "picture source[srcset]"].join(),
	ai = ["a[href][download]", "link[href]"].join(),
	si = [
		[ri, "src"],
		[li, "srcset"],
		[ai, "href"],
	];
function ci(e, t) {
	const i = (n) => t.get(gi(n)) ?? n;
	for (const [n, o] of si)
		for (const r of e.querySelectorAll(n)) {
			if (di(r)) continue;
			const l = decodeURI(r.getAttribute(o));
			o === "srcset" ? r.setAttribute(o, mi(l, i)) : r.setAttribute(o, i(l));
		}
}
function di(e) {
	return /(?:^|\s)external(?:\s|$)/i.test(e.getAttribute("rel") ?? "");
}
function ui(e) {
	const t = e.indexOf("?"),
		i = e.indexOf("#"),
		n = t >= 0 && i >= 0 ? Math.min(t, i) : t >= 0 ? t : i;
	return n >= 0 ? e.slice(0, n) : e;
}
function gi(e) {
	const t = ui(e);
	return Ii(t) ? t : `./${t}`;
}
function Ii(e) {
	return ["./", "../", "/"].some((t) => e.startsWith(t));
}
function mi(e, t) {
	return e
		.trim()
		.split(/\s*,\s*/)
		.filter((i) => i)
		.map((i) => {
			const n = i.split(/\s+/),
				o = t(n[0]);
			return o && (n[0] = encodeURI(o)), n.join(" ");
		})
		.join(", ");
}
function Ue(e, t) {
	const { root: i, expanded: n } = e,
		o = Ci(t, i) ? t : $t(t, n[i.childNodes.length]);
	De(e, o);
}
function De(e, t) {
	if (t.nodeType === 11) {
		let i;
		for (; (i = t.firstChild); ) e.root.appendChild(i);
	} else e.root.appendChild(t);
}
function pi(e, t) {
	De(e, qt(t));
}
function Ci(e, t) {
	return (
		(e instanceof Element || e instanceof Text) &&
		e instanceof e.constructor &&
		(!e.parentNode || t.contains(e))
	);
}
function U(e) {
	for (e.expanded = Array.from(e.root.childNodes, ei); e.root.lastChild; )
		e.root.lastChild.remove();
}
function fi(e, { autodisplay: t, assets: i }) {
	return {
		_error: !1,
		_node: e.root,
		pending() {
			this._error && ((this._error = !1), U(e));
		},
		fulfilled(n) {
			t && (U(e), i && n instanceof Element && ci(n, i), Ue(e, n));
		},
		rejected(n) {
			console.error(n), (this._error = !0), U(e), pi(e, n);
		},
	};
}
class Y extends Error {
	constructor(t, i) {
		super(t), (this.input = i);
	}
}
Y.prototype.name = "RuntimeError";
function bi(e) {
	return e && typeof e.next == "function" && typeof e.return == "function";
}
function be(e) {
	return () => e;
}
function de(e) {
	return e;
}
function hi(e) {
	return () => {
		throw e;
	};
}
const Ai = Array.prototype,
	Zi = Ai.map;
function N() {}
const Ge = 1,
	ee = 2,
	oe = 3,
	$ = Symbol("no-observer"),
	_i = Promise.resolve();
function H(e, t, i, n) {
	i || (i = $),
		Object.defineProperties(this, {
			_observer: { value: i, writable: !0 },
			_definition: { value: we, writable: !0 },
			_duplicate: { value: void 0, writable: !0 },
			_duplicates: { value: void 0, writable: !0 },
			_indegree: { value: NaN, writable: !0 },
			_inputs: { value: [], writable: !0 },
			_invalidate: { value: N, writable: !0 },
			_module: { value: t },
			_name: { value: null, writable: !0 },
			_outputs: { value: new Set(), writable: !0 },
			_promise: { value: _i, writable: !0 },
			_reachable: { value: i !== $, writable: !0 },
			_rejector: { value: Wi(this) },
			_shadow: { value: yi(t, n) },
			_type: { value: e },
			_value: { value: void 0, writable: !0 },
			_version: { value: 0, writable: !0 },
		});
}
Object.defineProperties(H.prototype, {
	_pending: { value: Ri, writable: !0, configurable: !0 },
	_fulfilled: { value: Yi, writable: !0, configurable: !0 },
	_rejected: { value: Fi, writable: !0, configurable: !0 },
	_resolve: { value: Vi, writable: !0, configurable: !0 },
	define: { value: vi, writable: !0, configurable: !0 },
	delete: { value: Xi, writable: !0, configurable: !0 },
	import: { value: Bi, writable: !0, configurable: !0 },
});
function yi(e, t) {
	return t?.shadow
		? new Map(
				Object.entries(t.shadow).map(([i, n]) => [
					i,
					new H(ee, e).define([], n),
				]),
			)
		: null;
}
function Gi(e) {
	e._module._runtime._dirty.add(e), e._outputs.add(this);
}
function wi(e) {
	e._module._runtime._dirty.add(e), e._outputs.delete(this);
}
function we() {
	throw we;
}
function F() {
	throw F;
}
function Wi(e) {
	return (t) => {
		throw t === F
			? t
			: t === we
				? new Y(`${e._name} is not defined`, e._name)
				: t instanceof Error && t.message
					? new Y(t.message, e._name)
					: new Y(`${e._name} could not be resolved`, e._name);
	};
}
function Ke(e) {
	return () => {
		throw new Y(`${e} is defined more than once`);
	};
}
function vi(e, t, i) {
	switch (arguments.length) {
		case 1: {
			(i = e), (e = t = null);
			break;
		}
		case 2: {
			(i = t), typeof e == "string" ? (t = null) : ((t = e), (e = null));
			break;
		}
	}
	return We.call(
		this,
		e == null ? null : String(e),
		t == null ? [] : Zi.call(t, this._resolve, this),
		typeof i == "function" ? i : be(i),
	);
}
function Vi(e) {
	return this._shadow?.get(e) ?? this._module._resolve(e);
}
function We(e, t, i) {
	const n = this._module._scope,
		o = this._module._runtime;
	if (
		(this._inputs.forEach(wi, this),
		t.forEach(Gi, this),
		(this._inputs = t),
		(this._definition = i),
		(this._value = void 0),
		i === N ? o._variables.delete(this) : o._variables.add(this),
		e !== this._name || n.get(e) !== this)
	) {
		let r, l;
		if (this._name)
			if (this._outputs.size)
				n.delete(this._name),
					(l = this._module._resolve(this._name)),
					(l._outputs = this._outputs),
					(this._outputs = new Set()),
					l._outputs.forEach(function (a) {
						a._inputs[a._inputs.indexOf(this)] = l;
					}, this),
					l._outputs.forEach(o._updates.add, o._updates),
					o._dirty.add(l).add(this),
					n.set(this._name, l);
			else if ((l = n.get(this._name)) === this) n.delete(this._name);
			else if (l._type === oe)
				l._duplicates.delete(this),
					(this._duplicate = void 0),
					l._duplicates.size === 1 &&
						((l = l._duplicates.keys().next().value),
						(r = n.get(this._name)),
						(l._outputs = r._outputs),
						(r._outputs = new Set()),
						l._outputs.forEach(function (a) {
							a._inputs[a._inputs.indexOf(r)] = l;
						}),
						(l._definition = l._duplicate),
						(l._duplicate = void 0),
						o._dirty.add(r).add(l),
						o._updates.add(l),
						n.set(this._name, l));
			else throw new Error();
		if (this._outputs.size) throw new Error();
		e &&
			((l = n.get(e))
				? l._type === oe
					? ((this._definition = Ke(e)),
						(this._duplicate = i),
						l._duplicates.add(this))
					: l._type === ee
						? ((this._outputs = l._outputs),
							(l._outputs = new Set()),
							this._outputs.forEach(function (a) {
								a._inputs[a._inputs.indexOf(l)] = this;
							}, this),
							o._dirty.add(l).add(this),
							n.set(e, this))
						: ((l._duplicate = l._definition),
							(this._duplicate = i),
							(r = new H(oe, this._module)),
							(r._name = e),
							(r._definition = this._definition = l._definition = Ke(e)),
							(r._outputs = l._outputs),
							(l._outputs = new Set()),
							r._outputs.forEach(function (a) {
								a._inputs[a._inputs.indexOf(l)] = r;
							}),
							(r._duplicates = new Set([this, l])),
							o._dirty.add(l).add(r),
							o._updates.add(l).add(r),
							n.set(e, r))
				: n.set(e, this)),
			(this._name = e);
	}
	return (
		this._version > 0 && ++this._version,
		o._updates.add(this),
		o._compute(),
		this
	);
}
function Bi(e, t, i) {
	return (
		arguments.length < 3 && ((i = t), (t = e)),
		We.call(this, String(t), [i._resolve(String(e))], de)
	);
}
function Xi() {
	return We.call(this, null, [], N);
}
function Ri() {
	this._observer.pending && this._observer.pending();
}
function Yi(e) {
	this._observer.fulfilled && this._observer.fulfilled(e, this._name);
}
function Fi(e) {
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
	_resolve: { value: xi, writable: !0, configurable: !0 },
	redefine: { value: Ni, writable: !0, configurable: !0 },
	define: { value: ki, writable: !0, configurable: !0 },
	derive: { value: Si, writable: !0, configurable: !0 },
	import: { value: Hi, writable: !0, configurable: !0 },
	value: { value: Ki, writable: !0, configurable: !0 },
	variable: { value: Ei, writable: !0, configurable: !0 },
	builtin: { value: Ji, writable: !0, configurable: !0 },
});
function Ni(e) {
	const t = this._scope.get(e);
	if (!t) throw new Y(`${e} is not defined`);
	if (t._type === oe) throw new Y(`${e} is defined more than once`);
	return t.define.apply(t, arguments);
}
function ki() {
	const e = new H(Ge, this);
	return e.define.apply(e, arguments);
}
function Hi() {
	const e = new H(Ge, this);
	return e.import.apply(e, arguments);
}
function Ei(e, t) {
	return new H(Ge, this, e, t);
}
async function Ki(e) {
	let t = this._scope.get(e);
	if (!t) throw new Y(`${e} is not defined`);
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
	} catch (i) {
		if (i === F) return he(e, t);
		throw i;
	}
}
function Si(e, t) {
	const i = new Map(),
		n = new Set(),
		o = [];
	function r(a) {
		let c = i.get(a);
		return (
			c ||
			((c = new ue(a._runtime, a._builtins)),
			(c._source = a),
			i.set(a, c),
			o.push([c, a]),
			n.add(a),
			c)
		);
	}
	const l = r(this);
	for (const a of e) {
		const { alias: c, name: s } = typeof a == "object" ? a : { name: a };
		l.import(s, c ?? s, t);
	}
	for (const a of n)
		for (const [c, s] of a._scope)
			if (s._definition === de) {
				if (a === this && l._scope.has(c)) continue;
				const d = s._inputs[0]._module;
				d._source && r(d);
			}
	for (const [a, c] of o)
		for (const [s, d] of c._scope) {
			const u = a._scope.get(s);
			if (!(u && u._type !== ee))
				if (d._definition === de) {
					const g = d._inputs[0],
						f = g._module;
					a.import(g._name, s, i.get(f) || f);
				} else a.define(s, d._inputs.map(Ti), d._definition);
		}
	return l;
}
function xi(e) {
	let t = this._scope.get(e),
		i;
	if (!t)
		if (((t = new H(ee, this)), this._builtins.has(e)))
			t.define(e, be(this._builtins.get(e)));
		else if (this._runtime._builtin._scope.has(e))
			t.import(e, this._runtime._builtin);
		else {
			try {
				i = this._runtime._global(e);
			} catch (n) {
				return t.define(e, hi(n));
			}
			i === void 0 ? this._scope.set((t._name = e), t) : t.define(e, be(i));
		}
	return t;
}
function Ji(e, t) {
	this._builtins.set(e, t);
}
function Ti(e) {
	return e._name;
}
const zi =
	typeof requestAnimationFrame == "function"
		? requestAnimationFrame
		: typeof setImmediate == "function"
			? setImmediate
			: (e) => setTimeout(e, 0);
function tt(e, t = sn) {
	const i = this.module();
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
			_builtin: { value: i },
			_global: { value: t },
		}),
		e)
	)
		for (const n in e) new H(ee, i).define(n, [], e[n]);
}
Object.defineProperties(tt.prototype, {
	_precompute: { value: Oi, writable: !0, configurable: !0 },
	_compute: { value: Pi, writable: !0, configurable: !0 },
	_computeSoon: { value: Mi, writable: !0, configurable: !0 },
	_computeNow: { value: Qi, writable: !0, configurable: !0 },
	dispose: { value: Li, writable: !0, configurable: !0 },
	module: { value: ji, writable: !0, configurable: !0 },
});
function Li() {
	(this._computing = Promise.resolve()),
		(this._disposed = !0),
		this._variables.forEach((e) => {
			e._invalidate(), (e._version = NaN);
		});
}
function ji(e, t = N) {
	let i;
	if (e === void 0)
		return (i = this._init) ? ((this._init = null), i) : new ue(this);
	if (((i = this._modules.get(e)), i)) return i;
	(this._init = i = new ue(this)), this._modules.set(e, i);
	try {
		e(this, t);
	} finally {
		this._init = null;
	}
	return i;
}
function Oi(e) {
	this._precomputes.push(e), this._compute();
}
function Pi() {
	return this._computing || (this._computing = this._computeSoon());
}
function Mi() {
	return new Promise(zi).then(() =>
		this._disposed ? void 0 : this._computeNow(),
	);
}
async function Qi() {
	let e = [],
		t,
		i,
		n = this._precomputes;
	if (n.length) {
		this._precomputes = [];
		for (const r of n) r();
		await Ui(3);
	}
	(t = new Set(this._dirty)),
		t.forEach(function (r) {
			r._inputs.forEach(t.add, t);
			const l = an(r);
			l > r._reachable
				? this._updates.add(r)
				: l < r._reachable && r._invalidate(),
				(r._reachable = l);
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
			r._outputs.forEach($i);
		});
	do {
		for (
			t.forEach(function (r) {
				r._indegree === 0 && e.push(r);
			});
			(i = e.pop());
		)
			nn(i), i._outputs.forEach(o), t.delete(i);
		t.forEach(function (r) {
			Di(r) &&
				(rn(r, new Y("circular definition")),
				r._outputs.forEach(qi),
				t.delete(r));
		});
	} while (t.size);
	function o(r) {
		--r._indegree === 0 && e.push(r);
	}
}
function Ui(e = 0) {
	let t = Promise.resolve();
	for (let i = 0; i < e; ++i) t = t.then(() => {});
	return t;
}
function Di(e) {
	const t = new Set(e._inputs);
	for (const i of t) {
		if (i === e) return !0;
		i._inputs.forEach(t.add, t);
	}
	return !1;
}
function $i(e) {
	++e._indegree;
}
function qi(e) {
	--e._indegree;
}
function en(e) {
	return e._promise.catch(e._rejector);
}
function Ce(e) {
	return new Promise(function (t) {
		e._invalidate = t;
	});
}
function tn(e, t) {
	let i =
			typeof IntersectionObserver == "function" &&
			t._observer &&
			t._observer._node,
		n = !i,
		o = N,
		r = N,
		l,
		a;
	return (
		i &&
			((a = new IntersectionObserver(
				([c]) => (n = c.isIntersecting) && ((l = null), o()),
			)),
			a.observe(i),
			e.then(() => (a.disconnect(), (a = null), r()))),
		function (c) {
			return n
				? Promise.resolve(c)
				: a
					? (l || (l = new Promise((s, d) => ((o = s), (r = d)))),
						l.then(() => c))
					: Promise.reject();
		}
	);
}
function nn(e) {
	e._invalidate(), (e._invalidate = N), e._pending();
	const t = e._value,
		i = ++e._version,
		n = e._inputs,
		o = e._definition;
	let r = null;
	const l = (e._promise = e._promise.then(a, a).then(c).then(s));
	function a() {
		return Promise.all(n.map(en));
	}
	function c(d) {
		if (e._version !== i) throw F;
		for (let u = 0, g = d.length; u < g; ++u)
			switch (d[u]) {
				case qe: {
					d[u] = r = Ce(e);
					break;
				}
				case et: {
					r || (r = Ce(e)), (d[u] = tn(r, e));
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
		if (e._version !== i) throw F;
		return bi(d) ? ((r || Ce(e)).then(ln(d)), on(e, i, d)) : d;
	}
	l.then(
		(d) => {
			(e._value = d), e._fulfilled(d);
		},
		(d) => {
			d === F || e._version !== i || ((e._value = void 0), e._rejected(d));
		},
	);
}
function on(e, t, i) {
	const n = e._module._runtime;
	let o;
	function r(c) {
		return new Promise((s) => s(i.next(o))).then(({ done: s, value: d }) =>
			s ? void 0 : Promise.resolve(d).then(c),
		);
	}
	function l() {
		const c = r((s) => {
			if (e._version !== t) throw F;
			return (o = s), a(s, c).then(() => n._precompute(l)), e._fulfilled(s), s;
		});
		c.catch((s) => {
			s === F || e._version !== t || (a(void 0, c), e._rejected(s));
		});
	}
	function a(c, s) {
		return (
			(e._value = c),
			(e._promise = s),
			e._outputs.forEach(n._updates.add, n._updates),
			n._compute()
		);
	}
	return r((c) => {
		if (e._version !== t) throw F;
		return (o = c), n._precompute(l), c;
	});
}
function rn(e, t) {
	e._invalidate(),
		(e._invalidate = N),
		e._pending(),
		++e._version,
		(e._indegree = NaN),
		(e._promise = Promise.reject(t)).catch(N),
		(e._value = void 0),
		e._rejected(t);
}
function ln(e) {
	return function () {
		e.return();
	};
}
function an(e) {
	if (e._observer !== $) return !0;
	const t = new Set(e._outputs);
	for (const i of t) {
		if (i._observer !== $) return !0;
		i._outputs.forEach(t.add, t);
	}
	return !1;
}
function sn(e) {
	return globalThis[e];
}
const Se = new Map();
function it(e, t = document.baseURI) {
	if (new.target !== void 0)
		throw new TypeError("FileAttachment is not a constructor");
	const i = new URL(e, t).href;
	let n = Se.get(i);
	return n || ((n = new T(i, e.split("/").pop())), Se.set(i, n)), n;
}
async function J(e) {
	const t = await fetch(e.href);
	if (!t.ok) throw new Error(`Unable to load file: ${e.name}`);
	return t;
}
class cn {
	constructor(t, i = dn(t), n, o) {
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
				mimeType: { value: `${i}`, enumerable: !0 },
				lastModified: { value: n === void 0 ? void 0 : +n, enumerable: !0 },
				size: { value: o === void 0 ? void 0 : +o, enumerable: !0 },
			});
	}
	async url() {
		return this.href;
	}
	async blob() {
		return (await J(this)).blob();
	}
	async arrayBuffer() {
		return (await J(this)).arrayBuffer();
	}
	async text(t) {
		return t === void 0
			? (await J(this)).text()
			: new TextDecoder(t).decode(await this.arrayBuffer());
	}
	async json() {
		return (await J(this)).json();
	}
	async stream() {
		return (await J(this)).body;
	}
	async dsv({ delimiter: t = ",", array: i = !1, typed: n = !1 } = {}) {
		const [o, r] = await Promise.all([
				this.text(),
				C(
					() => import("https://cdn.jsdelivr.net/npm/d3-dsv/+esm"),
					[],
					import.meta.url,
				),
			]),
			l = r.dsvFormat(t);
		return (i ? l.parseRows : l.parse)(o, n && r.autoType);
	}
	async csv(t) {
		return this.dsv({ ...t, delimiter: "," });
	}
	async tsv(t) {
		return this.dsv({ ...t, delimiter: "	" });
	}
	async image(t) {
		const i = await this.url();
		return new Promise((n, o) => {
			const r = new Image();
			new URL(i, document.baseURI).origin !== location.origin &&
				(r.crossOrigin = "anonymous"),
				Object.assign(r, t),
				(r.onload = () => n(r)),
				(r.onerror = () => o(new Error(`Unable to load file: ${this.name}`))),
				(r.src = i);
		});
	}
	async arrow() {
		const [t, i] = await Promise.all([
			C(
				() => import("https://cdn.jsdelivr.net/npm/apache-arrow/+esm"),
				[],
				import.meta.url,
			),
			J(this),
		]);
		return t.tableFromIPC(i);
	}
	async arquero(t) {
		let i, n;
		switch (this.mimeType) {
			case "application/json":
				(i = this.text()), (n = "fromJSON");
				break;
			case "text/tab-separated-values":
				t?.delimiter === void 0 && (t = { ...t, delimiter: "	" });
			case "text/csv":
				(i = this.text()), (n = "fromCSV");
				break;
			default:
				if (/\.arrow$/i.test(this.name)) (i = this.arrow()), (n = "fromArrow");
				else if (/\.parquet$/i.test(this.name))
					(i = this.parquet()), (n = "fromArrow");
				else
					throw new Error(`unable to determine Arquero loader: ${this.name}`);
				break;
		}
		const [o, r] = await Promise.all([
			C(
				() => import("https://cdn.jsdelivr.net/npm/arquero/+esm"),
				[],
				import.meta.url,
			),
			i,
		]);
		return o[n](r, t);
	}
	async parquet() {
		const [t, i, n] = await Promise.all([
			C(
				() => import("https://cdn.jsdelivr.net/npm/apache-arrow/+esm"),
				[],
				import.meta.url,
			),
			C(
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
		return t.tableFromIPC(i.readParquet(new Uint8Array(n)).intoIPCStream());
	}
	async xml(t = "application/xml") {
		return new DOMParser().parseFromString(await this.text(), t);
	}
	async html() {
		return this.xml("text/html");
	}
}
function dn(e) {
	const t = e.lastIndexOf("."),
		i = e.lastIndexOf("/");
	switch (t > 0 && (i < 0 || t > i) ? e.slice(t).toLowerCase() : "") {
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
class T extends cn {
	constructor(t, i, n, o, r) {
		super(i, n, o, r),
			Object.defineProperty(this, "href", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0,
			}),
			Object.defineProperty(this, "href", { value: t });
	}
}
Object.defineProperty(T, "name", { value: "FileAttachment" });
it.prototype = T.prototype;
function un(e) {
	function t(i) {
		const n = e((i += ""));
		if (n == null) throw new Error(`File not found: ${i}`);
		if (typeof n == "object" && "url" in n) {
			const { url: o, mimeType: r } = n;
			return new T(o, i, r);
		}
		return new T(n, i);
	}
	return (t.prototype = T.prototype), t;
}
async function* Ie(e) {
	let t,
		i,
		n = !1;
	const o = e((r) => ((i = r), t ? (t(r), (t = void 0)) : (n = !0), r));
	if (o != null && typeof o != "function")
		throw new Error(
			typeof o == "object" && "then" in o && typeof o.then == "function"
				? "async initializers are not supported"
				: "initializer returned something, but not a dispose function",
		);
	try {
		for (;;) yield n ? ((n = !1), i) : new Promise((r) => (t = r));
	} finally {
		o?.();
	}
}
function nt(e) {
	let t;
	return Object.defineProperty(
		Ie((i) => {
			(t = i), e !== void 0 && t(e);
		}),
		"value",
		{ get: () => e, set: (i) => ((e = i), void t?.(e)) },
	);
}
function gn(e) {
	const t = nt(e);
	return [
		t,
		{
			get value() {
				return t.value;
			},
			set value(i) {
				t.value = i;
			},
		},
	];
}
function Ae(e) {
	return Ie((t) => {
		const i = In(e),
			n = xe(e),
			o = () => t(xe(e));
		return (
			e.addEventListener(i, o),
			n !== void 0 && t(n),
			() => e.removeEventListener(i, o)
		);
	});
}
function xe(e) {
	const t = e,
		i = e;
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
				return Array.from(i.selectedOptions, (n) => n.value);
		}
	return t.value;
}
function In(e) {
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
async function* mn(e) {
	let t;
	const i = [],
		n = e((o) => (i.push(o), t && (t(i.shift()), (t = void 0)), o));
	if (n != null && typeof n != "function")
		throw new Error(
			typeof n == "object" && "then" in n && typeof n.then == "function"
				? "async initializers are not supported"
				: "initializer returned something, but not a dispose function",
		);
	try {
		for (;;) yield i.length ? i.shift() : new Promise((o) => (t = o));
	} finally {
		n?.();
	}
}
function rt(e, t) {
	return Ie((i) => {
		let n;
		const o = new ResizeObserver(([r]) => {
			const l = r.contentRect.width;
			l !== n && i((n = l));
		});
		return o.observe(e, t), () => o.disconnect();
	});
}
const pn = Object.freeze(
	Object.defineProperty(
		{ __proto__: null, input: Ae, now: ot, observe: Ie, queue: mn, width: rt },
		Symbol.toStringTag,
		{ value: "Module" },
	),
);
function Cn(e, t) {
	const i = document.createElement("canvas");
	return (i.width = e), (i.height = t), i;
}
function fn(e, t, i = devicePixelRatio) {
	const n = document.createElement("canvas");
	(n.width = e * i), (n.height = t * i), (n.style.width = `${e}px`);
	const o = n.getContext("2d");
	return o.scale(i, i), o;
}
function bn(e, t) {
	const i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	return (
		i.setAttribute("viewBox", `0 0 ${e} ${t}`),
		i.setAttribute("width", `${e}`),
		i.setAttribute("height", `${t}`),
		i
	);
}
function hn(e) {
	return document.createTextNode(e);
}
let An = 0;
function Zn(e) {
	return new _n(`O-${e == null ? "" : `${e}-`}${++An}`);
}
class _n {
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
const yn = Object.freeze(
	Object.defineProperty(
		{ __proto__: null, canvas: Cn, context2d: fn, svg: bn, text: hn, uid: Zn },
		Symbol.toStringTag,
		{ value: "Module" },
	),
);
var Gn = function (e, t, i, n) {
		if (i === "a" && !n)
			throw new TypeError("Private accessor was defined without a getter");
		if (typeof t == "function" ? e !== t || !n : !t.has(e))
			throw new TypeError(
				"Cannot read private member from an object whose class did not declare it",
			);
		return i === "m" ? n : i === "a" ? n.call(e) : n ? n.value : t.get(e);
	},
	wn = function (e, t, i, n, o) {
		if (n === "m") throw new TypeError("Private method is not writable");
		if (n === "a" && !o)
			throw new TypeError("Private accessor was defined without a setter");
		if (typeof t == "function" ? e !== t || !o : !t.has(e))
			throw new TypeError(
				"Cannot write private member to an object whose class did not declare it",
			);
		return n === "a" ? o.call(e, i) : o ? (o.value = i) : t.set(e, i), i;
	},
	re;
class Wn {
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
		const t = await Gn(this, re, "f");
		return (
			wn(
				this,
				re,
				new Promise((i, n) => ((this.fulfilled = i), (this.rejected = n))),
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
const vn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/lodash/+esm"),
			[],
			import.meta.url,
		).then((e) => e.default),
	Vn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/arquero/+esm"),
			[],
			import.meta.url,
		),
	Bn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/apache-arrow/+esm"),
			[],
			import.meta.url,
		),
	Xn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/d3/+esm"),
			[],
			import.meta.url,
		),
	Rn = () =>
		C(() => import("./dot-DSyh6hFx.js"), [], import.meta.url).then(
			(e) => e.dot,
		),
	Yn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm/+esm"),
			[],
			import.meta.url,
		),
	Fn = () =>
		C(() => import("./duckdb-vOY2a31M.js"), [], import.meta.url).then(
			(e) => e.DuckDBClient,
		),
	Nn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/echarts/+esm"),
			[],
			import.meta.url,
		),
	kn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/htl/+esm"),
			[],
			import.meta.url,
		),
	Hn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/htl/+esm"),
			[],
			import.meta.url,
		).then((e) => e.html),
	En = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/htl/+esm"),
			[],
			import.meta.url,
		).then((e) => e.svg),
	Kn = () =>
		C(
			() => import("./inputs-DoHVubAa.js"),
			__vite__mapDeps([0, 1]),
			import.meta.url,
		),
	Sn = () => C(() => import("./leaflet-D54mqpIu.js"), [], import.meta.url),
	xn = () =>
		C(() => import("./mapboxgl-C94UFoDx.js"), [], import.meta.url).then(
			(e) => e.default,
		),
	Jn = () =>
		C(() => import("./md-Nx1Zdssn.js"), [], import.meta.url).then((e) => e.md),
	Tn = () =>
		C(() => import("./mermaid-CWCaPgOr.js"), [], import.meta.url).then(
			(e) => e.mermaid,
		),
	zn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/@observablehq/plot/+esm"),
			[],
			import.meta.url,
		),
	Ln = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/react/+esm"),
			[],
			import.meta.url,
		),
	jn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/react-dom/+esm"),
			[],
			import.meta.url,
		),
	On = () =>
		C(() => import("./tex-BE43Lb2g.js"), [], import.meta.url).then(
			(e) => e.tex,
		),
	Pn = () =>
		C(
			() => import("https://cdn.jsdelivr.net/npm/topojson-client/+esm"),
			[],
			import.meta.url,
		),
	Mn = () =>
		C(() => import("./vega-lite-ClQwpDTB.js"), [], import.meta.url).then(
			(e) => e.vl,
		),
	Qn = Object.freeze(
		Object.defineProperty(
			{
				__proto__: null,
				Arrow: Bn,
				DuckDBClient: Fn,
				Inputs: Kn,
				L: Sn,
				Plot: zn,
				React: Ln,
				ReactDOM: jn,
				_: vn,
				aq: Vn,
				d3: Xn,
				dot: Rn,
				duckdb: Yn,
				echarts: Nn,
				htl: kn,
				html: Hn,
				mapboxgl: xn,
				md: Jn,
				mermaid: Tn,
				svg: En,
				tex: On,
				topojson: Pn,
				vl: Mn,
			},
			Symbol.toStringTag,
			{ value: "Module" },
		),
	);
ve.resolve = lt;
function ve(...e) {
	return e.length === 1
		? import(lt(e[0]))
		: Promise.all(e.map((t) => ve(t))).then((t) => Object.assign({}, ...t));
}
function Un(e) {
	const t = e.split("/"),
		i = e.startsWith("@") ? [t.shift(), t.shift()].join("/") : t.shift(),
		n = i.indexOf("@", 1),
		o = n > 0 ? i.slice(0, n) : i,
		r = n > 0 ? i.slice(n) : "",
		l = t.length > 0 ? `/${t.join("/")}` : "";
	return { name: o, range: r, path: l };
}
function lt(e) {
	const t = String(e);
	if (Dn(t) || $n(t)) return t;
	const { name: i, range: n, path: o } = Un(t);
	return `https://cdn.jsdelivr.net/npm/${i}${n}${o + (qn(o) || eo(o) ? "" : "/+esm")}`;
}
function Dn(e) {
	return /^\w+:/.test(e);
}
function $n(e) {
	return /^(\.\/|\.\.\/|\/)/.test(e);
}
function qn(e) {
	return /(\.\w*)$/.test(e);
}
function eo(e) {
	return /(\/)$/.test(e);
}
const to = () => V(v("aapl.csv")),
	io = () => V(v("alphabet.csv")),
	no = () => V(v("cars.csv")),
	oo = () => V(v("citywages.csv")),
	ro = () => V(v("diamonds.csv")),
	lo = () => V(v("flare.csv")),
	ao = () => V(v("industries.csv")),
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
	const [i, n] = await Promise.all([
		po(e),
		C(
			() => import("https://cdn.jsdelivr.net/npm/d3-dsv/+esm"),
			[],
			import.meta.url,
		),
	]);
	return n.csvParse(i, n.autoType);
}
const Co = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			aapl: to,
			alphabet: io,
			cars: no,
			citywages: oo,
			diamonds: ro,
			flare: lo,
			industries: ao,
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
function fo(e, t) {
	return (i, ...n) => e.sql.call(e, i, ...n).then(t);
}
const bo = document.querySelector("main") ?? document.body,
	ho = {
		now: () => ot(),
		width: () => rt(bo),
		FileAttachment: () => it,
		Generators: () => pn,
		Mutable: () => nt,
		DOM: () => yn,
		require: () => ve,
		__sql: () => fo,
		__ojs_observer: () => () => new Wn(),
		...Qn,
		...Co,
	},
	Ze = Object.assign(new tt({ ...ho, __ojs_runtime: () => Ze }), {
		fileAttachments: un,
	}),
	K = (Ze.main = Ze.module());
K.constructor.prototype.defines = function (e) {
	return (
		this._scope.has(e) ||
		this._builtins.has(e) ||
		this._runtime._builtin._scope.has(e)
	);
};
function S(e, t, i = fi) {
	const {
			id: n,
			body: o,
			inputs: r = [],
			outputs: l = [],
			output: a,
			autodisplay: c,
			autoview: s,
			automutable: d,
		} = t,
		u = e.variables,
		g = K.variable(i(e, t), { shadow: {} }),
		f = a ?? (l.length ? `cell ${n}` : null);
	if (r.includes("display") || r.includes("view")) {
		let I = -1;
		const G = new g.constructor(2, g._module);
		if (
			(G.define(
				r.filter((_) => _ !== "display" && _ !== "view"),
				() => {
					const _ = g._version;
					return (E) => {
						if (_ < I) throw new Error("stale display");
						if (e.variables[0] !== g) throw new Error("stale display");
						return _ > I && U(e), (I = _), Ue(e, E), E;
					};
				},
			),
			g._shadow.set("display", G),
			r.includes("view"))
		) {
			const _ = new g.constructor(2, g._module, null, { shadow: {} });
			_._shadow.set("display", G),
				_.define(["display"], (E) => (L) => Ae(E(L))),
				g._shadow.set("view", _);
		}
	} else c || U(e);
	if ((u.push(g.define(f, r, o)), a != null)) {
		if (s) {
			const I = Je(a, "viewof$");
			u.push(K.define(I, [a], Ae));
		} else if (d) {
			const I = Je(a, "mutable "),
				G = `cell ${n}`;
			g.define(I, [G], ([_]) => _),
				u.push(
					K.define(a, r, o),
					K.define(G, [a], gn),
					K.define(`mutable$${I}`, [G], ([, _]) => _),
				);
		}
	} else for (const I of l) u.push(K.variable(!0).define(I, [f], (G) => G[I]));
}
function Je(e, t) {
	if (!e.startsWith(t)) throw new Error(`expected ${t}: ${e}`);
	return e.slice(t.length);
}
S(
	{ root: document.getElementById("cell-8"), expanded: [], variables: [] },
	{
		id: 8,
		body: async (e, t, i, n, o, r, l, a) => {
			const c = {
					goal: "Track the median Miles_per_Gallon over Year, segmented by Origin, to understand how fuel efficiency has evolved across different manufacturing regions.",
					summary:
						"A time-series analysis showing the median fuel efficiency (Miles per Gallon) of vehicles, tracked annually and segmented by their region of origin.",
					fields: [
						{
							name: "year",
							label: "Year",
							description: "Original field [Year] used without modification.",
							semantic_type: "DateTime",
							role: "primary",
						},
						{
							name: "origin",
							label: "Origin",
							description: "Original field [Origin] used without modification.",
							semantic_type: "Category",
							role: "segment",
						},
						{
							name: "median_miles_per_gallon",
							label: "Median Miles per Gallon",
							description:
								"Derived from [Miles_per_Gallon]: Median of Miles_per_Gallon, aggregated by Year and Origin. NULL values were excluded from the calculation.",
							semantic_type: "Numeric",
							role: "primary",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_01" },
					mark: { type: "line", point: !0 },
					encoding: {
						color: { field: "origin", title: "Origin", type: "nominal" },
						tooltip: [
							{ field: "year", title: "Year", type: "temporal" },
							{ field: "origin", title: "Origin", type: "nominal" },
							{
								field: "median_miles_per_gallon",
								title: "Median Miles per Gallon",
								type: "quantitative",
							},
						],
						x: {
							field: "year",
							scale: { type: "linear", zero: !0 },
							timeUnit: "year",
							title: "Year",
							type: "temporal",
						},
						y: {
							field: "median_miles_per_gallon",
							scale: { type: "linear", zero: !0 },
							title: "Median Miles per Gallon",
							type: "quantitative",
						},
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_01 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_01");
			d && d.setAttribute("href", t(i, c.goal, s));
			const u = "dataset_01",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/flickering-eater-snatch-reassuringly/artifacts/datasets.parquet";
			await n(o, u, g);
			const f = await r({ table: u, spec: s, metadata: c, coordinator: l });
			a(f.viewClient.node()), a(f.tableClient.node());
			const I = document.getElementById("loading-skeleton-dataset_01");
			return (
				I && I.remove(),
				{
					dataset_01_metadata: c,
					dataset_01_vegalite: s,
					dataset_01_provenance_nb_link: d,
					dataset_01_table: u,
					dataset_01_url: g,
					dataset_01_clients: f,
					dataset_01_loading_skeleton: I,
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
S(
	{ root: document.getElementById("cell-14"), expanded: [], variables: [] },
	{
		id: 14,
		body: async (e, t, i, n, o, r, l, a) => {
			const c = {
					goal: "Analyze the correlation between individual Horsepower and Weight_in_lbs, colored by Origin and faceted by a derived Cylinders_Tier (e.g., 'low', 'medium', 'high' based on Cylinders count), to explore the power-to-weight relationship across vehicle types and origins.",
					summary:
						"A detailed view of individual vehicles, showing the correlation between horsepower and weight. Data is segmented by origin and categorized into cylinder tiers, with additional vehicle specifications provided for rich, interactive cross-filtering and tooltips.",
					fields: [
						{
							name: "name",
							label: "Name",
							description: "Original field Name used without modification.",
							semantic_type: "Name",
							role: "detail",
						},
						{
							name: "horsepower",
							label: "Horsepower",
							description:
								"Original field Horsepower used without modification.",
							semantic_type: "Numeric",
							role: "primary",
						},
						{
							name: "weight_in_lbs",
							label: "Weight (lbs)",
							description:
								"Original field Weight_in_lbs used without modification.",
							semantic_type: "Numeric",
							role: "primary",
						},
						{
							name: "origin",
							label: "Origin",
							description: "Original field Origin used without modification.",
							semantic_type: "Category",
							role: "segment",
						},
						{
							name: "cylinders_tier",
							label: "Cylinders Tier",
							description:
								"Derived from Cylinders: Categorized into 'Low (3-4)', 'Medium (5-6)', and 'High (8+)' tiers based on the number of cylinders.",
							semantic_type: "Ordinal",
							role: "facet",
						},
						{
							name: "year",
							label: "Year",
							description: "Original field Year used without modification.",
							semantic_type: "DateTime",
							role: "detail",
						},
						{
							name: "cylinders",
							label: "Cylinders",
							description:
								"Original field Cylinders used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "displacement",
							label: "Displacement",
							description:
								"Original field Displacement used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "acceleration",
							label: "Acceleration",
							description:
								"Original field Acceleration used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "miles_per_gallon",
							label: "Miles per Gallon",
							description:
								"Original field Miles_per_Gallon used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_02" },
					facet: {
						column: { field: "origin", title: "Origin", type: "nominal" },
						row: {
							field: "cylinders_tier",
							title: "Cylinders Tier",
							type: "nominal",
						},
					},
					spec: {
						mark: { type: "point" },
						encoding: {
							tooltip: [
								{ field: "name", title: "Name", type: "nominal" },
								{
									field: "horsepower",
									title: "Horsepower",
									type: "quantitative",
								},
								{
									field: "weight_in_lbs",
									title: "Weight (lbs)",
									type: "quantitative",
								},
								{ field: "origin", title: "Origin", type: "nominal" },
								{
									field: "cylinders_tier",
									title: "Cylinders Tier",
									type: "nominal",
								},
								{ field: "year", title: "Year", type: "temporal" },
								{
									field: "cylinders",
									title: "Cylinders",
									type: "quantitative",
								},
								{
									field: "displacement",
									title: "Displacement",
									type: "quantitative",
								},
								{
									field: "acceleration",
									title: "Acceleration",
									type: "quantitative",
								},
								{
									field: "miles_per_gallon",
									title: "Miles per Gallon",
									type: "quantitative",
								},
							],
							x: {
								field: "weight_in_lbs",
								scale: { type: "linear", zero: !0 },
								title: "Weight (lbs)",
								type: "quantitative",
							},
							y: {
								field: "horsepower",
								scale: { type: "linear", zero: !0 },
								title: "Horsepower",
								type: "quantitative",
							},
						},
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_02 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_02");
			d && d.setAttribute("href", t(i, c.goal, s));
			const u = "dataset_02",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/flickering-eater-snatch-reassuringly/artifacts/datasets.parquet";
			await n(o, u, g);
			const f = await r({ table: u, spec: s, metadata: c, coordinator: l });
			a(f.viewClient.node()), a(f.tableClient.node());
			const I = document.getElementById("loading-skeleton-dataset_02");
			return (
				I && I.remove(),
				{
					dataset_02_metadata: c,
					dataset_02_vegalite: s,
					dataset_02_provenance_nb_link: d,
					dataset_02_table: u,
					dataset_02_url: g,
					dataset_02_clients: f,
					dataset_02_loading_skeleton: I,
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
			"dataset_02_metadata",
			"dataset_02_vegalite",
			"dataset_02_provenance_nb_link",
			"dataset_02_table",
			"dataset_02_url",
			"dataset_02_clients",
			"dataset_02_loading_skeleton",
		],
		output: void 0,
		assets: void 0,
		autodisplay: !1,
		autoview: void 0,
		automutable: void 0,
	},
);
S(
	{ root: document.getElementById("cell-18"), expanded: [], variables: [] },
	{
		id: 18,
		body: async (e, t, i, n, o, r, l, a) => {
			const c = {
					goal: "Examine the distribution of individual Acceleration values across different Origin categories, using Displacement as a size or color encoding, to highlight regional differences in vehicle quickness and engine volume.",
					summary:
						"A detailed list of individual vehicles, showing their acceleration, engine displacement, and origin, supplemented with other performance metrics for contextual analysis.",
					fields: [
						{
							name: "vehicle_name",
							label: "Vehicle Name",
							description: "Original field Name used without modification.",
							semantic_type: "Name",
							role: "detail",
						},
						{
							name: "acceleration",
							label: "Acceleration",
							description:
								"Original field Acceleration used without modification.",
							semantic_type: "Numeric",
							role: "primary",
						},
						{
							name: "displacement",
							label: "Displacement",
							description:
								"Original field Displacement used without modification.",
							semantic_type: "Numeric",
							role: "primary",
						},
						{
							name: "origin",
							label: "Origin",
							description: "Original field Origin used without modification.",
							semantic_type: "Category",
							role: "segment",
						},
						{
							name: "miles_per_gallon",
							label: "Miles per Gallon",
							description:
								"Original field Miles_per_Gallon used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "cylinders",
							label: "Cylinders",
							description:
								"Original field Cylinders used without modification.",
							semantic_type: "Ordinal",
							role: "detail",
						},
						{
							name: "horsepower",
							label: "Horsepower",
							description:
								"Original field Horsepower used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "weight_in_lbs",
							label: "Weight (lbs)",
							description:
								"Original field Weight_in_lbs used without modification.",
							semantic_type: "Numeric",
							role: "detail",
						},
						{
							name: "model_year",
							label: "Model Year",
							description: "Original field Year used without modification.",
							semantic_type: "DateTime",
							role: "detail",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_03" },
					facet: {
						column: { field: "origin", title: "Origin", type: "nominal" },
					},
					spec: {
						mark: { type: "point" },
						encoding: {
							tooltip: [
								{
									field: "vehicle_name",
									title: "Vehicle Name",
									type: "nominal",
								},
								{
									field: "acceleration",
									title: "Acceleration",
									type: "quantitative",
								},
								{
									field: "displacement",
									title: "Displacement",
									type: "quantitative",
								},
								{ field: "origin", title: "Origin", type: "nominal" },
								{
									field: "miles_per_gallon",
									title: "Miles per Gallon",
									type: "quantitative",
								},
								{
									field: "cylinders",
									title: "Cylinders",
									type: "quantitative",
								},
								{
									field: "horsepower",
									title: "Horsepower",
									type: "quantitative",
								},
								{
									field: "weight_in_lbs",
									title: "Weight (lbs)",
									type: "quantitative",
								},
								{ field: "model_year", title: "Model Year", type: "temporal" },
							],
							x: {
								field: "displacement",
								scale: { type: "linear", zero: !0 },
								title: "Displacement",
								type: "quantitative",
							},
							y: {
								field: "acceleration",
								scale: { type: "linear", zero: !0 },
								title: "Acceleration",
								type: "quantitative",
							},
						},
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_03 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_03");
			d && d.setAttribute("href", t(i, c.goal, s));
			const u = "dataset_03",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/flickering-eater-snatch-reassuringly/artifacts/datasets.parquet";
			await n(o, u, g);
			const f = await r({ table: u, spec: s, metadata: c, coordinator: l });
			a(f.viewClient.node()), a(f.tableClient.node());
			const I = document.getElementById("loading-skeleton-dataset_03");
			return (
				I && I.remove(),
				{
					dataset_03_metadata: c,
					dataset_03_vegalite: s,
					dataset_03_provenance_nb_link: d,
					dataset_03_table: u,
					dataset_03_url: g,
					dataset_03_clients: f,
					dataset_03_loading_skeleton: I,
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
S(
	{ root: document.getElementById("cell-24"), expanded: [], variables: [] },
	{
		id: 24,
		body: async (e, t, i, n, o, r, l, a) => {
			const c = {
					goal: "Rank Origins by their average derived MPG_per_Weight_Ratio (Miles_per_Gallon / Weight_in_lbs) to identify which regions produce vehicles with the best fuel efficiency relative to their mass.",
					summary:
						"A ranking of vehicle manufacturing origins by their average fuel efficiency to weight ratio, highlighting regions that produce the most mass-efficient vehicles.",
					fields: [
						{
							name: "origin",
							label: "Origin",
							description: "Original field Origin used without modification.",
							semantic_type: "Category",
							role: "primary",
						},
						{
							name: "avg_mpg_per_weight_ratio",
							label: "Avg MPG per Weight Ratio",
							description:
								"Derived from Miles_per_Gallon and Weight_in_lbs: Average of the ratio of Miles_per_Gallon to Weight_in_lbs, grouped by Origin. Records with null values for Miles_per_Gallon or Weight_in_lbs were excluded from the calculation.",
							semantic_type: "Numeric",
							role: "primary",
						},
					],
				},
				s = {
					config: { view: { continuousWidth: 300, continuousHeight: 300 } },
					data: { name: "dataset_04" },
					mark: { type: "bar" },
					encoding: {
						tooltip: [
							{ field: "origin", title: "Origin", type: "nominal" },
							{
								field: "avg_mpg_per_weight_ratio",
								title: "Avg MPG per Weight Ratio",
								type: "quantitative",
							},
						],
						x: {
							field: "avg_mpg_per_weight_ratio",
							scale: { type: "linear", zero: !0 },
							title: "Avg MPG per Weight Ratio",
							type: "quantitative",
						},
						y: {
							field: "origin",
							sort: "-x",
							title: "Origin",
							type: "ordinal",
						},
					},
					$schema: "https://vega.github.io/schema/vega-lite/v6.1.0.json",
				};
			e(
				document.querySelectorAll("#subsection-dataset_04 .data-field"),
				c.fields,
			);
			const d = document.getElementById("provenance-nb-link-dataset_04");
			d && d.setAttribute("href", t(i, c.goal, s));
			const u = "dataset_04",
				g =
					"https://visxgenai-cdn.peter.gy/sessions/flickering-eater-snatch-reassuringly/artifacts/datasets.parquet";
			await n(o, u, g);
			const f = await r({ table: u, spec: s, metadata: c, coordinator: l });
			a(f.viewClient.node()), a(f.tableClient.node());
			const I = document.getElementById("loading-skeleton-dataset_04");
			return (
				I && I.remove(),
				{
					dataset_04_metadata: c,
					dataset_04_vegalite: s,
					dataset_04_provenance_nb_link: d,
					dataset_04_table: u,
					dataset_04_url: g,
					dataset_04_clients: f,
					dataset_04_loading_skeleton: I,
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
S(
	{ root: document.getElementById("cell-27"), expanded: [], variables: [] },
	{
		id: 27,
		body: async (e, t, i, n) => {
			const [
					{ datatable: o },
					r,
					{ default: l },
					{ default: a },
					{ default: c },
					s,
					d,
					{ default: u },
					{ default: g },
				] = await Promise.all([
					C(
						() =>
							import("https://visxgenai-cdn.peter.gy/npm/quak/DataTable.js"),
						[],
						import.meta.url,
					).then((m) => {
						if (!("datatable" in m))
							throw new SyntaxError("export 'datatable' not found");
						return m;
					}),
					C(
						() => import("https://cdn.jsdelivr.net/npm/@uwdata/vgplot/+esm"),
						[],
						import.meta.url,
					),
					C(
						() => import("https://cdn.jsdelivr.net/npm/anchor-js/+esm"),
						[],
						import.meta.url,
					).then((m) => {
						if (!("default" in m))
							throw new SyntaxError("export 'default' not found");
						return m;
					}),
					C(
						() => import("https://cdn.jsdelivr.net/npm/lz-string/+esm"),
						[],
						import.meta.url,
					).then((m) => {
						if (!("default" in m))
							throw new SyntaxError("export 'default' not found");
						return m;
					}),
					C(
						() => import("https://cdn.jsdelivr.net/npm/tippy.js/+esm"),
						[],
						import.meta.url,
					).then((m) => {
						if (!("default" in m))
							throw new SyntaxError("export 'default' not found");
						return m;
					}),
					C(
						() => import("https://cdn.jsdelivr.net/npm/tocbot/+esm"),
						[],
						import.meta.url,
					),
					C(
						() => import("https://cdn.jsdelivr.net/npm/vega/+esm"),
						[],
						import.meta.url,
					),
					C(
						() => import("https://cdn.jsdelivr.net/npm/vega-embed/+esm"),
						[],
						import.meta.url,
					).then((m) => {
						if (!("default" in m))
							throw new SyntaxError("export 'default' not found");
						return m;
					}),
					C(
						() => import("https://cdn.jsdelivr.net/npm/vega-loader-arrow/+esm"),
						[],
						import.meta.url,
					).then((m) => {
						if (!("default" in m))
							throw new SyntaxError("export 'default' not found");
						return m;
					}),
				]),
				f = {
					info: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWluZm8taWNvbiBsdWNpZGUtaW5mbyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgMTZ2LTQiLz48cGF0aCBkPSJNMTIgOGguMDEiLz48L3N2Zz4=",
					chevronDown:
						"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93bi1pY29uIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==",
				},
				I = await e.of(),
				G = new r.Coordinator();
			G.databaseConnector(r.wasmConnector({ duckdb: I._db }));
			function _(m, p, A) {
				const b = `SELECT UNNEST("${p}", max_depth := 2) FROM '${A}'`;
				return m.query(`CREATE TABLE IF NOT EXISTS "${p}" AS ${b}`);
			}
			d.formats("arrow", g);
			function E(m, p = "#677389", A = "gray", b = 0.125, Z = "__selected__") {
				const h = JSON.parse(JSON.stringify(m));
				let y,
					te = !1;
				if (h.spec && typeof h.spec == "object") (y = h.spec), (te = !0);
				else if (
					h.encoding ||
					h.mark ||
					h.layer ||
					h.concat ||
					h.facet ||
					h.repeat
				)
					y = h;
				else throw new Error("Invalid input: could not find Vega-Lite spec");
				y.encoding || (y.encoding = {});
				function j(O, k, x) {
					if (y.encoding[O]) {
						const ie = y.encoding[O];
						y.encoding[O] = {
							condition: { test: `datum.${Z}`, ...ie },
							value: x,
						};
					}
				}
				return (
					y.encoding?.color
						? j("color", null, A)
						: (y.encoding.color = {
								condition: { test: `datum.${Z}`, value: p },
								value: A,
							}),
					y.encoding?.opacity
						? j("opacity", null, b)
						: (y.encoding.opacity = {
								condition: { test: `datum.${Z}`, value: 1 },
								value: b,
							}),
					te ? h : y
				);
			}
			const L = {
				theme: "light",
				animation: "fade",
				duration: [0, 100],
				maxWidth: 500,
				placement: "top",
				arrow: !1,
				offset: [0, 8],
			};
			function me(m, p) {
				c(m, { content: p, ...L });
			}
			function at(m, p) {
				const A = (b) => p.find((Z) => Z.label === b);
				for (const b of m) {
					const Z =
							b.getAttribute("data-field")?.trim() || b.textContent.trim(),
						h = A(Z);
					if (h) {
						const y = h.description;
						me(b, y);
					} else
						console.warn(`Field "${Z}" not found in metadata.`),
							b.classList.remove("data-field");
				}
			}
			class Ve extends r.MosaicClient {
				#i;
				#t;
				#n = t.html`<div style="width: 100%; max-width: 100%; overflow-x: auto; overflow-y: hidden;">`;
				#e;
				constructor(p) {
					super(p.filterBy), (this.#i = p.table), (this.#t = E(p.spec));
				}
				async initView() {
					const p = {
							...this.#t,
							width: "container",
							padding: { top: 20, bottom: 20, left: 10, right: 10 },
							config: { view: { continuousWidth: 250, continuousHeight: 250 } },
							autosize: { type: "fit", contains: "padding" },
						},
						{ view: A } = await u(this.#n, p, {
							renderer: "canvas",
							actions: !1,
							scaleFactor: 1,
						});
					this.#e = A;
					const b = (this.#t.params || []).map((Z) => Z.name);
					for (const Z of b) A.addSignalListener(Z, (h, y) => this.#o(h, y));
				}
				#o(p, A) {}
				query(p = []) {
					return r.Query.from(this.#i).select("*", {
						__selected__: p.length ? r.and(p) : !0,
					});
				}
				queryResult(p) {
					const A = this.#t.data.name;
					return (
						this.#e
							.change(
								A,
								d
									.changeset()
									.remove(() => !0)
									.insert(d.format.arrow(p)),
							)
							.run(),
						this.#e.resize(),
						this.#e.run(),
						window.dispatchEvent(new i("resize")),
						this
					);
				}
				get vegaView() {
					return this.#e;
				}
				node() {
					return this.#n;
				}
			}
			async function Be(m, p) {
				const { coordinator: A, table: b, filterBy: Z } = p,
					h = new Ve({ spec: m, table: b, filterBy: Z });
				return await h.initView(), A.connect(h), h;
			}
			async function st(m) {
				const {
						table: p,
						metadata: A,
						spec: b,
						coordinator: Z,
						tableHeight: h = 225,
					} = m,
					y = (k) => A.fields.filter((x) => x.name === k)[0]?.label || k;
				function te(k) {
					const x = A.fields.find((ne) => ne.name === k.name),
						ie = x?.label ?? k.name,
						Ye = x?.description ?? "";
					if (Ye) {
						const ne = n`<img
        src="${f.info}"
        alt="info"
        style="width: 14px; height: 14px; margin-left: 4px; cursor: help; margin-bottom: -2px;"
      />`;
						return (
							me(ne, Ye),
							n`
        <span>
          <span class="data-field">${ie}</span>
          ${ne}
        </span>
      `
						);
					} else return n`<span class="data-field">${ie}</span>`;
				}
				const j = await o(p, {
						coordinator: Z,
						height: h,
						getColumnLabel: te,
						getColumnWidth: (k) => Math.max(125, y(k.name).length * 10 + 24),
					}),
					O = await Be(b, { coordinator: Z, table: p, filterBy: j.filterBy });
				return { tableClient: j, viewClient: O };
			}
			function Xe(m) {
				const { code: p, baseUrl: A = "https://marimo.app" } = m,
					b = new URL(A);
				if (p) {
					const Z = a.compressToEncodedURIComponent(p);
					b.hash = `#code/${Z}`;
				}
				return b.href;
			}
			function Re(m, p) {
				let A = m;
				for (const [b, Z] of Object.entries(p))
					A = A.replace(new RegExp("\\$" + b, "g"), Z);
				return A;
			}
			function ct(m, p, A) {
				const Z = {
						provenance_json_url:
							document.getElementById("provenance-json").href,
						goal: p,
						vl_spec: JSON.stringify(A),
					},
					h = Re(m, Z);
				return Xe({ code: h });
			}
			function dt() {
				c("[data-tippy-content]", L);
				const m = document.getElementById("full-report-link");
				window && m?.href === window.location.href && m.remove();
				const p = document.querySelector(".js-toc");
				if (p) {
					const b = document.createElement("div");
					b.className = "js-toc-header";
					const Z = document.createElement("span");
					(Z.className = "js-toc-title"), (Z.textContent = "Contents");
					const h = document.createElement("img");
					(h.className = "js-toc-toggle"),
						(h.src = f.chevronDown),
						(h.alt = "Toggle table of contents"),
						b.appendChild(Z),
						b.appendChild(h);
					const y = document.createElement("div");
					(y.className = "js-toc-content"),
						p.appendChild(b),
						p.appendChild(y),
						b.addEventListener("click", () => {
							p.classList.toggle("collapsed");
						});
				}
				const A = new l({
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
				AnchorJS: l,
				lzString: a,
				tippy: c,
				tocbot: s,
				vega: d,
				vegaEmbed: u,
				arrow: g,
				Icons: f,
				db: I,
				coordinator: G,
				registerDataset: _,
				specWithSelectionConditioning: E,
				TIPPY_CONFIG_DEFAULT: L,
				registerTooltipOnFieldSpan: me,
				registerDataFieldTooltips: at,
				VegaView: Ve,
				vegaview: Be,
				datatableWithView: st,
				createMarimoWASMLink: Xe,
				renderProvenanceNotebookTemplate: Re,
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
S(
	{ root: document.getElementById("cell-28"), expanded: [], variables: [] },
	{
		id: 28,
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
S(
	{ root: document.getElementById("cell-29"), expanded: [], variables: [] },
	{
		id: 29,
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
export { C as _ };
