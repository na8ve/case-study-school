# Case study: a school with memory (synthetic)

**Riverbend Middle School** is a made-up school, and this repository is its memory: a course
as a map of concepts that need one another, what students get wrong and why, the short moves
that fix each mistake, and the school's records. For every student that means test scores,
assignments, quizzes and flashcards, Common Core and Next Generation Science standards assessed
by the teacher and by the student, term achievement, and the teacher's notes.

Put it in an agent's memory and ask it what a teacher or a tutor would ask. The puzzle:

> Student **S-0000** scaled a recipe from 2:3 to 4:5 by adding 2 to both parts, wrote 2/5 for
> 1/2 plus 1/3, and said that a car at steady speed "goes up by the same amount every hour".
> Each of these has several explanations alone. What explains all three, what will S-0000
> struggle with next, and what should happen first?

Everything here is synthetic. No real student, teacher, class or school is described.

## Run it

You need Node.js 22.19 or newer, git, and na8ve agent signed in to your account.

**With na8ve agent**

```bash
git clone https://github.com/na8ve/case-study-school
cd case-study-school
na8ve-agent          # then: /login (once), and /demo school
```

`/demo school` seeds this folder into a space of its own (you confirm first), switches to it,
and asks the first question. Started in this folder, the agent also finds the two skills in
`.agents/skills/`.

**Without an account**, `node tools/dependency-map.mjs "Unit rates"` prints what a concept needs and
what it unlocks, from the facts in this folder, and `npm test` checks the facts.

## The questions

1. **The puzzle.** *What explains S-0000's three errors, what will they struggle with next, and what
   should happen first?*
2. **The lesson that has to wait.** *S-0007 has asked for the next lesson on unit rates. What should I
   give them?*
3. **The hint.** *S-0012 is working on the speed problem: a car travels 150 miles in 2.5 hours, how
   fast? Give a hint that fits what they know, without the answer.*
4. **The record.** *Show me S-0007's record against the ratio standards: tests, assignments, quizzes,
   and what the teacher and the student each say.*
5. **The hurdle ahead.** *Which students are about to run into trouble in force and motion, and why?*
6. **The gap.** *Which students rate themselves higher than their teacher does on the ratio
   standards, and how should I raise it with them?*
7. **A change of state.** *S-0007 has just done five ratio tables correctly after the double number
   line. Update what you know. What changes about their next lesson?*
8. **A withdrawal.** *S-0033 has left the school, and a guardian has asked for their records to be
   deleted. Withdraw them.*

## What a good answer does

- **The puzzle:** lists the three findings, says which explanations each suggests alone, and names the
  one they share (additive reasoning). Says what it blocks next (ratio tables, unit rates, proportional
  relationships, speed, and adding fractions), and gives the first move: the double number line, about a
  minute, before any new lesson. Cites the facts it used.
- **The lesson that has to wait:** does not hand over the unit-rates lesson that looks closest. Ratio
  tables, which unit rates needs, is not secure for this student. It offers the double number line,
  then a ratio-tables lesson that needs no audio, because this student cannot use audio at school, and
  only then unit rates.
- **The hint:** starts with a question, from what the student already reads well (ratio tables), and
  points at the unit ("per what?") for the way they divided last time. It uses a picture, because they
  learn best with visuals. It does not give the answer, and it does not mention another student.
- **The record:** reads the facts as they are: each test, assignment, quiz and flashcard result, the
  teacher's level and the student's own for each standard, and the term grade. It says what the
  record does not show.
- **The hurdle ahead:** names the concepts whose struggle goes with force and motion in this
  cohort, gives the rate and the count and not a certainty, and lists the students who are
  struggling with those now. It notes where the curriculum does not link two concepts that the
  cohort shows going together.
- **The gap:** lists the students whose own level is above the teacher's, with both levels, and treats
  it as a conversation to have and not a judgement.
- **A change of state:** says what changed, keeps the new state so that it replaces the old, leaves the
  earlier results in the record, and says what the new state does to the next lesson.
- **A withdrawal:** asks to confirm first, withdraws only that student's memories and note, says what
  it withdrew, and says that it cannot be undone.

## What is here

| | |
|---|---|
| `kb/` | the course: concepts and what each needs, lessons, flashcard decks, classrooms, what students get wrong and why, the moves that fix it, and what this cohort shows about which struggles go together |
| `records/` | the standards (Common Core and Next Generation Science codes, with short descriptions), and the tests, assignments and quizzes that are aligned to them |
| `students/` | one file per student: classroom, what they have mastered and what they struggle with, errors and learner traits, test, assignment and quiz results, flashcards, standards assessed by the teacher and by the student, and term achievement |
| `notes/` | the teacher's notes |
| `docs/` | **how memory works here** (`how-memory-works.md`), the records and what each means (`the-school-records.md`), the rules a tutor keeps (`curricular-guardrails.md`), and the course map (`the-course.md`) |
| `.agents/skills/` | `socratic-tutor`, for a student's hint or next lesson, and `teacher-insight`, for a class |
| `tools/dependency-map.mjs` | what a concept needs and unlocks, without an account |

## Notices

Synthetic data for a demonstration. It is **not** a record of real students and it is not for decisions
about real children. If you use this approach with real student records, seed only what you are
permitted to share, and see `docs/how-memory-works.md`.

Standard codes follow the Common Core State Standards for Mathematics and the Next Generation Science
Standards, with descriptions in our own words: see [`NOTICE.md`](NOTICE.md).

## Licence

Apache-2.0.
