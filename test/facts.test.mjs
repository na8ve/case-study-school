// The facts in this folder are well formed, say only what the course holds, and the
// concept map has no loop.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { mapOf, readFacts } from "../tools/dependency-map.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const course = readFacts(["kb", "records"]);
const students = readdirSync(join(root, "students")).filter((f) => f.endsWith(".facts"));

const isA = (...kinds) => new Set(course.filter((f) => f.rel === "is_a" && kinds.includes(f.to)).map((f) => f.from));
const concepts = isA("Mathematics", "Physical science");
const causes = isA("Misconception", "Non-conceptual cause");
const traits = isA("Learner trait");
const standards = new Set(course.filter((f) => f.rel === "is_a" && /standard$/i.test(f.to)).map((f) => f.from));
const classrooms = isA("Classroom");
const patterns = new Set(course.filter((f) => f.rel === "suggests" && !traits.has(f.from)).map((f) => f.from));
const moves = new Set(course.filter((f) => f.rel === "remedied_by").map((f) => f.to));
const work = (name) => /^(T|HW|Q|F)-\d+ /.test(name) || /, term \d$/.test(name);

function* lines(path) {
	for (const l of readFileSync(path, "utf8").split("\n")) {
		if (l && !l.startsWith("#")) yield l;
	}
}

test("every fact is four non-empty parts", () => {
	for (const d of ["kb", "records", "students"]) {
		for (const f of readdirSync(join(root, d)).filter((x) => x.endsWith(".facts"))) {
			for (const l of lines(join(root, d, f))) {
				const parts = l.split(" | ");
				assert.equal(parts.length, 4, `${d}/${f}: ${l}`);
				assert.ok(parts.every((p) => p.trim()), `${d}/${f}: ${l}`);
			}
		}
	}
});

test("the relation vocabulary stays at or under fifteen labels", () => {
	const all = new Set(course.map((f) => f.rel));
	for (const f of students) for (const l of lines(join(root, "students", f))) all.add(l.split(" | ")[1]);
	assert.ok(all.size <= 15, `${all.size} labels: ${[...all]}`);
});

test("the concept map has no loop, and every need is a concept", () => {
	const needs = new Map();
	for (const f of course.filter((x) => x.rel === "prerequisite_of")) {
		assert.ok(concepts.has(f.from) && concepts.has(f.to), `${f.from} -> ${f.to}`);
		needs.set(f.to, [...(needs.get(f.to) ?? []), f.from]);
	}
	const state = new Map();
	const visit = (n) => {
		assert.notEqual(state.get(n), 1, `a loop through ${n}`);
		if (state.get(n) === 2) return;
		state.set(n, 1);
		for (const m of needs.get(n) ?? []) visit(m);
		state.set(n, 2);
	};
	for (const c of concepts) visit(c);
});

test("a student's facts point at things the course holds", () => {
	assert.ok(students.length > 50, `a cohort (${students.length} students)`);
	for (const f of students) {
		const id = f.replace(".facts", "");
		let enrolled = 0;
		for (const l of lines(join(root, "students", f))) {
			const [from, rel, to] = l.split(" | ");
			assert.equal(from, id, `${f}: a fact about someone else: ${l}`);
			if (rel === "enrolled_in") {
				enrolled++;
				assert.ok(classrooms.has(to), `${f}: ${to} is not a classroom`);
			} else if (rel === "mastered") assert.ok(concepts.has(to), `${f}: ${to}`);
			else if (rel === "struggles_with") assert.ok(concepts.has(to) || causes.has(to), `${f}: ${to}`);
			else if (rel === "shows") assert.ok(patterns.has(to) || traits.has(to), `${f}: ${to}`);
			else if (rel === "responded_to") assert.ok(moves.has(to), `${f}: ${to}`);
			else if (rel === "assessed") assert.ok(standards.has(to), `${f}: ${to}`);
			else if (rel === "scored") assert.ok(work(to), `${f}: ${to}`);
			else assert.fail(`${f}: unexpected relation ${rel}`);
		}
		assert.equal(enrolled, 1, `${f} is in exactly one classroom`);
	}
});

test("every concept has a standard, a lesson and a flashcard deck", () => {
	for (const c of concepts) {
		assert.ok(course.some((f) => f.from === c && f.rel === "aligned_to" && standards.has(f.to)), `${c} has a standard`);
		assert.ok(course.some((f) => f.rel === "teaches" && f.to === c), `${c} has a lesson`);
		assert.ok(course.some((f) => f.rel === "aligned_to" && f.to === c && f.from.startsWith("F-")), `${c} has a flashcard deck`);
	}
});

test("what a concept needs and unlocks, from the tool", () => {
	const m = mapOf(readFacts(), "unit rates");
	assert.equal(m.name, "Unit rates");
	assert.deepEqual(m.needs.filter(([, d]) => d === 1).map(([n]) => n).sort(), ["Division as sharing", "Ratio tables"]);
	assert.ok(m.needs.some(([n]) => n === "Equivalent fractions"), "far back it needs equivalent fractions");
	assert.ok(m.unlocks.some(([n]) => n === "Force and motion"), "far on it unlocks force and motion");
	assert.ok(m.blockedBy.includes("Additive reasoning") && m.moves.includes("Double number line"));
	const out = execFileSync(process.execPath, [join(root, "tools", "dependency-map.mjs"), "Unit rates"], { encoding: "utf8" });
	assert.match(out, /Needs \(nearest first\)/);
	assert.equal(mapOf(readFacts(), "no such concept"), null);
});
