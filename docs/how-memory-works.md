# How memory works in this case study

This is a guide for a teacher, a tutor or a developer using this repository with an agent that has
memory. It explains what the agent holds, how it uses it, and how to keep it true.

*Everything here is synthetic. If you use the same approach with real student records, read
section 7 first.*

## 1. What is in memory

Seeding a copy of this folder gives the agent four kinds of memory.

| kind | where it comes from | what it holds |
|---|---|---|
| **the course** | `kb/` | concepts and what each needs first, lessons and flashcard decks, classrooms, what students get wrong and why, and the short moves that fix each mistake |
| **the records** | `records/`, `students/` | the standards, the tests, assignments and quizzes aligned to them, and for each student: results, what they have mastered and struggle with, errors and learner traits, standards assessed by the teacher and by the student, and term achievement |
| **the cohort** | `kb/cohort.facts` | which struggles go together across this year's students, as counts and rates |
| **the teacher's notes** | `notes/` | what a teacher wrote, in words |

Each fact connects two things (`from | relation | to | sentence`). Two facts that share a thing are
connected through it, so the agent can follow a chain: from a student's errors, to the explanation
they suggest, to what that explanation blocks, to the move that fixes it.
[`the-school-records.md`](the-school-records.md) says what each relation means.

## 2. How the agent uses it

For a question about one student, the agent should:

1. **Read the student's record first**, by their id: what they have mastered, what they struggle with,
   the errors they have shown, how they learn, what they are working on now.
2. **Ask why**, for a *why* question that names two or more findings (`cortex_explain`). The agent asks
   memory to resolve the findings together, and reads back the explanation they point to and what
   follows from it: what it blocks, and the move that remedies it.
3. **Check the prerequisites** of whatever it is about to offer. A lesson is offered only when every
   concept it needs is secure. If one is not, the agent offers the short move for the cause, then the
   prerequisite lesson, then the lesson that was asked for.
4. **Fit the lesson to the learner.** A student who cannot use audio at school is offered lessons that
   say they need none.
5. **Cite what it used.** Every fact carries a reference the agent names.

For a question about a class, the agent reads the cohort findings and the records of the students
in that class, and reports counts and rates, not certainties.

## 3. Keeping what the agent knows true

A student's state changes: they master a concept, a misconception is resolved, an assignment is
handed in. The agent keeps the new state with `cortex_remember` and a **subject key** such as
`S-0007|Ratio tables|status`. A later fact on the same key **replaces** the earlier one, so the agent
reads the newest state and not the history of states.

What the agent does not do is withdraw the earlier records because the state moved on. A test score
from last month happened. It stays in the record, and the newer state is added beside it.

## 4. When a student improves

If a short move works, the student's state changes from struggling to secure. Memory keeps both: the
move that was tried and what followed it, and the new state. The next time the agent plans a lesson,
it reads the new state, and the earlier error stays as history that the agent can cite.

## 5. Withdrawing a student's records

`cortex_retract` withdraws one memory for good: it can never be retrieved again, and it cannot be
undone. The agent asks you to confirm every time. Use it for a record that must go, such as a
guardian's request to delete a student's records, and not for a record that is merely out of date.

To withdraw a student, the agent finds that student's memories by their id, shows you what it found,
and withdraws them after you confirm. It does not touch another student's records.

## 6. What leaves your machine

- `/demo` and a seed send this folder's text files: the `.facts` files and the `.md` and `.txt`
  files. The README and the licences are not sent.
- Anything shaped like a credential is removed before it is sent.
- `tools/dependency-map.mjs` and `npm test` send nothing.

## 7. Using this on a real school

This case study is made up. Before you put a real class in an agent's memory:

- **Seed only what you are permitted to share.** Student records are protected in most places. Check
  the rules that apply to your school and your agent's provider before any real record leaves the
  school's own systems.
- **Prefer ids to names**, as this case study does, and keep the key to the ids somewhere else.
- **A withdrawal is permanent.** Decide who may request one.
- **A model's explanation is a hypothesis.** An error pattern is evidence for an explanation, not a
  diagnosis, and a cohort rate is a rate. See [`curricular-guardrails.md`](curricular-guardrails.md).

## 8. Glossary

| term | meaning |
|---|---|
| concept | one thing a student learns, such as ratio tables |
| prerequisite | a concept that has to be secure before another |
| misconception | a wrong idea that produces a family of errors, such as additive reasoning |
| error pattern | something a student did that is evidence of an explanation |
| move | a short intervention, about a minute, that targets one misconception |
| standard | a published learning standard, referred to by its code |
| subject key | a name for something that has one current value, so a newer fact replaces the older |
| withdraw | remove a memory for good |
