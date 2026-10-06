# The school's records

What a record holds, what each relation in this repository means, and how a result becomes a level.
Every record is synthetic.

## Records, by kind

| record | id looks like | what a student's record says |
|---|---|---|
| **test** | `T-602` | the percentage scored, and whether it is at or above the meeting level |
| **assignment** | `HW-603` | the score out of ten and whether it was handed in on time, late or not at all; or that the student is working on it and has no score yet |
| **interactive quiz** | `Q-61` | the score out of ten and the minutes it took |
| **flashcard deck** | `F-211` | how many times the student reviewed it this term, and the share of cards recalled |
| **standard** | `6.RP.A.3`, `MS-PS2-2` | the **teacher's** level and the **student's own**, side by side, for the standards the grade focuses on |
| **term achievement** | `Mathematics, term 1` | the letter and the average, with the level of expectations it meets |
| **mastery** | a concept | the concept is secure, with a mastery score and last term's |
| **struggle** | a concept or a misconception | what the student is struggling with now, including a misconception that is not yet resolved |
| **error pattern** | a short phrase | something the student did, in words |
| **learner trait** | a short phrase | how the student learns: with audio or with visuals, for how long, how they handle word problems, whether they can use audio at school |
| **teacher's note** | a student's id | the teacher's own words, with what is on record |

## Levels

Both the teacher and the student rate a standard on four levels: **Beginning**, **Approaching**,
**Meeting**, **Exceeding**. Test and assignment results map to a level the same way: below 60% is
Beginning, 60% to 69% Approaching, 70% to 89% Meeting, 90% and above Exceeding. Term achievement is a
letter on the same scale: A, B, C, D, F.

When the student rates themselves differently from the teacher, the record says so, and which way.
A student who rates themselves higher is not misbehaving: it is the most useful thing the record can
say about what they have not noticed yet.

## What each relation means

| relation | reads as |
|---|---|
| `prerequisite_of` | the first concept has to be secure before the second |
| `aligned_to` | a concept, lesson, flashcard deck, test, assignment, quiz or item is aligned to a standard or to a concept |
| `teaches` | a lesson teaches a concept |
| `suggests` | an error pattern is evidence for an explanation |
| `blocks` | a misconception stops a student from taking a step a concept needs |
| `remedied_by` | the short move that fixes a misconception |
| `predicts` | in this cohort, struggling with the first concept goes with struggling with the second |
| `enrolled_in` | a student is in a classroom |
| `mastered` | a student has a concept secure |
| `struggles_with` | a student is struggling with a concept or a misconception |
| `shows` | a student did something, or learns a certain way |
| `responded_to` | a student tried a move, and what followed |
| `scored` | a student's result on a test, assignment, quiz, flashcard deck or term, or the work they are on now |
| `assessed` | the teacher's and the student's own level on a standard |
| `is_a` | what kind of thing something is: a subject, a classroom, a misconception, a standard, a learner trait |

## What a record cannot show

- **Why** a result is what it is. A low score is evidence, and the explanation is a hypothesis.
- **What happened between records.** The record holds results, not a student's week.
- **Anything about a student who has no record.** Absence is not good news.
