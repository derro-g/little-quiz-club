# Little Quiz Club: step-by-step building guide

This guide is our shared map for building a classroom quiz website. We will
work through one milestone at a time, explain new concepts as they come up,
and update this page when a milestone is finished. You do not need prior
coding experience.

## What we are building

1. A teacher signs in, creates a test, and shares its access code with students.
2. A student enters the code and their name, then takes that test on their own.
   Students do not have to wait for each other: every student has their own
   attempt and question timers.
3. Each question has a time limit and a point value. The student's result is
   calculated when they finish.
4. The student sees their result, and the teacher can see the results for
   students who took the test.

This is a classroom test flow, not a live game where everyone answers the same
question at the same moment. We'll build the simpler individual-attempt
version first.

## Where we are now

- **Current milestone:** 1 — Publish the website with GitHub Pages
- **Finished:** The original five-question quiz works, and its content, styling,
  and behavior are in separate files.
- **Frontend prototype:** Teacher test creation, shareable demo codes, student
  names, individual timers, scoring, and teacher results work in one browser.
  These are not real accounts or shared online data.
- **Product direction:** Teacher accounts, teacher-made tests, access codes,
  individually timed student attempts, scores, and teacher-visible results.
- **Still to do:** Turn on GitHub Pages in the repository settings and confirm
  the published website opens.
- **Project repository:** <https://github.com/derro-g/little-quiz-club>
- **Next milestone:** 3 — Choose how the website will store accounts, tests,
  attempts, and results.

## Our milestones

### 0. Start with a working project — done

- [x] Put the page in `index.html`, its appearance in `styles.css`, and quiz
  behavior in `script.js`.
- [x] Keep the existing quiz playable.
- [x] Add instructions for opening the project and changing a question.

**Done means:** The page loads, a complete quiz can be played, and the changes
are saved in the GitHub repository.

### 1. Publish with GitHub Pages — in progress

- [ ] In the GitHub repository, open **Settings → Pages**.
- [ ] Select **Deploy from a branch**, then choose the `main` branch and
  `/(root)` folder, and save.
- [ ] Wait for GitHub Pages to publish. Open the URL shown in the Pages
  settings and try the quiz there.
- [ ] Add the published URL to the project notes once it is available.

**Done means:** Anyone with the link can open and finish the quiz online.
GitHub Pages is suitable for the static website and has a free plan. We should
check GitHub's current plan and usage limits as the project grows.

### 2. Build and try the classroom frontend prototype — done

- [x] Let a teacher create a test with questions, four answer choices, points,
  and a timer for each question.
- [x] Give each test a demo access code and let the teacher open or close it.
- [x] Let a student join with a code and display name, take an individual
  timed attempt, and see a result.
- [x] Show saved demo results in the teacher's results page.
- [x] Keep demo information in this browser and label the prototype clearly.
- [x] Try creating a test, joining it as a pretend student, finishing it, and
  checking the teacher's results page.
- [x] Try an incorrect answer, let a question timer expire, close a test, and
  check how the prototype responds.
- [x] Confirm the layout fits a phone-sized screen and a computer viewport.

**Done means:** The classroom workflow makes sense and the screens behave as
expected. These browser-only results do not sync across devices and must not be
used for real student information.

### 3. Choose a backend for accounts and test data

- [ ] Compare free-tier services for teacher sign-in, a database, and secure
  access from the website.
- [ ] Check current costs and usage limits, data privacy terms, sign-in options,
  and whether a payment method is required.
- [ ] Plan which information to store: teacher account, test, access code,
  student display name, answers, and result. Collect as little student
  information as possible.
- [ ] Decide how long test codes stay active and who can view results.
- [ ] Keep private credentials and correct answers out of public website files.

**Done means:** We have chosen a service that fits the budget and written down
how teacher accounts, tests, access codes, student attempts, and results will
be protected. We will check the service's current terms before relying on its
free plan.

**Important:** GitHub Pages hosts the website files, but it does not provide
teacher accounts or a shared database. The website will need a separate
backend service for those features. We can keep the website on free GitHub
Pages, but must check the backend service's limits as the project grows.

### 4. Add teacher sign-in and test creation

- [ ] Let a teacher create an account and sign in.
- [ ] Build a teacher page for creating a test with a title and questions.
- [ ] For each question, let the teacher set answer choices, mark the correct
  answer, choose a time limit, and set points.
- [ ] Let the teacher review and save a test, then see their saved tests.

**Done means:** A signed-in teacher can create, save, reopen, and edit their
own test. Other teachers' tests are not exposed as theirs.

### 5. Create secure test codes and let students join

- [ ] Let a teacher open a saved test for students and generate a hard-to-guess
  access code.
- [ ] Show the code and let the teacher close the test when it is no longer
  accepting attempts.
- [ ] Let a student enter the code and a display name without creating an
  account.
- [ ] Show a clear message if a code is invalid, closed, or expired.

**Done means:** A student with a valid code can join the right test, and a
student without a valid code cannot start an attempt.

### 6. Build individually timed student attempts

- [ ] Start a student's own attempt when they choose to begin.
- [ ] Show one question at a time and start that question's timer for that
  student.
- [ ] Save answers and score correct answers using the question's point value.
- [ ] Handle skipped questions, time running out, refreshes, and attempts to
  answer after time expires.
- [ ] Calculate and save the final result reliably.

**Done means:** Students can take the same test independently, and each
student's answers, timers, and score belong to their own attempt. The backend,
not just the student's browser, must check timing and scoring.

### 7. Show results to students and teachers

- [ ] Show each student their result after they finish.
- [ ] Give the teacher a results page listing student names, scores, and
  completion status for each test.
- [ ] Make sure students can only see their own result, not other students'
  private results.
- [ ] Check that the teacher can only access results for their own tests.

**Done means:** A completed student sees their own score and the teacher can
review the test's student results without exposing results to the wrong people.

### 8. Final checks, publishing, and next improvements

- [ ] Test the complete game on a phone and computer, including separate
  student attempts.
- [ ] Check keyboard access, error states, duplicate names, and what happens if
  someone loses connection or refreshes.
- [ ] Test sign-in, test-code access, time limits, and who can view results.
- [ ] Update the setup instructions and publish the finished version.

**Done means:** A new player can open the website and understand how to play,
and the project guide matches what the game actually does.

## Not in the first version

The first version will not synchronize a live classroom game where every
student sees each question at the same time. It will not require student
accounts either: a test code and a display name are enough. We can revisit
these choices after the individual-attempt version works.

The current frontend is a prototype, not a secure test service. Correct
answers and results are visible in this browser's saved data. We must connect
and secure a backend before using real tests or student information.

## How we will work together

For each step, I will:

1. Explain the goal in plain language and keep the change small enough to
   understand.
2. Make the change in the project files and test the behavior.
3. Tell you what changed, how to try it, and what the next step is.
4. Update this guide so we can return to the right place later.

You can ask what any part of the code does, request a slower explanation, or
change the plan at any time. We will avoid adding paid services without
discussing them first.

## A few useful words

- **Website files:** HTML describes the page, CSS styles it, and JavaScript
  makes it interactive.
- **GitHub repository:** The online home for the project's files and their
  change history.
- **GitHub Pages:** GitHub's service for publishing a static website from a
  repository.
- **Backend:** A separate online service that stores or coordinates data.
  This project needs one for teacher sign-in, shared tests, test codes, and
  results. GitHub Pages only serves the website files.
