#!/usr/bin/env node
// What a concept needs, what it unlocks, and what stands in the way, from the facts in this
// folder. It needs no account and sends nothing.
//
//   node tools/dependency-map.mjs "Unit rates"
//   node tools/dependency-map.mjs --list

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function readFacts(dirs = ["kb", "records"]) {
	const out = [];
	for (const d of dirs) {
		for (const f of readdirSync(join(root, d)).filter((x) => x.endsWith(".facts")).sort()) {
			for (const l of readFileSync(join(root, d, f), "utf8").split("\n")) {
				if (!l || l.startsWith("#")) continue;
				const [from, rel, to, text] = l.split(" | ");
				if (from && rel && to && text) out.push({ from, rel, to, text });
			}
		}
	}
	return out;
}

/** Everything reachable from `name` along `edges`, nearest first, with its distance. */
function reach(name, edges) {
	const seen = new Map();
	let frontier = [name];
	for (let depth = 1; frontier.length; depth++) {
		const next = [];
		for (const n of frontier) {
			for (const m of edges.get(n) ?? []) {
				if (!seen.has(m) && m !== name) {
					seen.set(m, depth);
					next.push(m);
				}
			}
		}
		frontier = next;
	}
	return [...seen].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
}

export function mapOf(facts, name) {
	const needs = new Map();
	const unlocks = new Map();
	for (const f of facts.filter((x) => x.rel === "prerequisite_of")) {
		needs.set(f.to, [...(needs.get(f.to) ?? []), f.from]);
		unlocks.set(f.from, [...(unlocks.get(f.from) ?? []), f.to]);
	}
	const known = new Set([...needs.keys(), ...unlocks.keys()]);
	const key = [...known].find((k) => k.toLowerCase() === name.toLowerCase());
	if (!key) return null;
	return {
		name: key,
		needs: reach(key, needs),
		unlocks: reach(key, unlocks),
		standard: facts.filter((f) => f.from === key && f.rel === "aligned_to" && /^(\d|MS-)/.test(f.to)).map((f) => f.to),
		lessons: facts.filter((f) => f.rel === "teaches" && f.to === key).map((f) => ({ name: f.from, text: f.text })),
		blockedBy: [...new Set(facts.filter((f) => f.rel === "blocks" && f.to === key).map((f) => f.from))],
		moves: [...new Set(facts.filter((f) => f.rel === "blocks" && f.to === key).flatMap((b) => facts.filter((r) => r.rel === "remedied_by" && r.from === b.from).map((r) => r.to)))],
	};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	const facts = readFacts();
	const arg = process.argv.slice(2).join(" ").trim();
	if (!arg || arg === "--list") {
		const names = new Set(facts.filter((f) => f.rel === "prerequisite_of").flatMap((f) => [f.from, f.to]));
		console.log([...names].sort().join("\n"));
		process.exit(arg ? 0 : 2);
	}
	const m = mapOf(facts, arg);
	if (!m) {
		console.error(`no concept called "${arg}" (try --list)`);
		process.exit(1);
	}
	const show = (title, rows) => console.log(`${title}\n${rows.length ? rows.map(([n, d]) => `  ${n}  ${d} step${d === 1 ? "" : "s"}`).join("\n") : "  nothing"}`);
	console.log(`${m.name}  ${m.standard.join(", ")}\n`);
	show("Needs (nearest first):", m.needs);
	console.log();
	show("Unlocks (nearest first):", m.unlocks);
	console.log(`\nMisconceptions that block it: ${m.blockedBy.join(", ") || "none recorded"}`);
	console.log(`Moves that remedy them: ${m.moves.join(", ") || "none recorded"}`);
	console.log(`\nLessons:\n${m.lessons.map((l) => `  ${l.name}: ${l.text}`).join("\n") || "  none"}`);
}
