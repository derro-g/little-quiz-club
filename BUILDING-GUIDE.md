# Little Quiz Club: step-by-step building guide

This guide is our shared map for growing the project into a quiz game inspired
by Kahoot. We will work through one milestone at a time, explain new concepts
as they come up, and update this page when a milestone is finished. You do not
need prior coding experience.

## Where we are now

- **Current milestone:** 1 — Publish the website with GitHub Pages
- **Finished:** The original five-question quiz works, and its content, styling,
  and behavior are in separate files.
- **Still to do:** Turn on GitHub Pages in the repository settings and confirm
  the published website opens.
- **Project repository:** <https://github.com/derro-g/little-quiz-club>
- **Next coding milestone:** 2 — Make the quiz easier to use and test.

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

### 2. Make the basic game sturdy

- [ ] Test the quiz on a phone-sized screen and a computer.
- [ ] Check that the quiz can be used with a keyboard as well as a mouse.
- [ ] Review question wording, answer feedback, score, and replay behavior.
- [ ] Fix any problems we find before adding more features.

**Done means:** A player can comfortably start, finish, and replay the quiz on
different screen sizes, including without a mouse.

### 3. Add a quiz library

- [ ] Represent each quiz with a title and a list of questions.
- [ ] Make a simple home screen where a player can choose a quiz.
- [ ] Keep the existing everyday quiz as the first choice.

**Done means:** Players can choose between at least two quizzes without
changing code.

### 4. Let people make and share quizzes

- [ ] Build a beginner-friendly form for adding questions and answer choices.
- [ ] Let the quiz creator mark the correct answer and preview the quiz.
- [ ] Start with saving quizzes in that browser and exporting/importing a quiz
  file, so this feature does not need a paid service or server.
- [ ] Explain that browser-saved quizzes are not automatically shared across
  devices.

**Done means:** Someone can create, preview, save, and transfer a quiz without
editing `script.js`.

### 5. Add optional game settings

- [ ] Let the player choose whether to use a question timer.
- [ ] Show the timer clearly and handle time running out.
- [ ] Add simple points and a results summary.
- [ ] Make sure the game still works when the timer is turned off.

**Done means:** Players can finish a quiz with or without a timer and see a
clear score at the end.

### 6. Explore live multiplayer

- [ ] First agree on the rules: who hosts, how players join, when questions
  appear, how answers are scored, and when a game ends.
- [ ] Compare backend services that offer a free tier and real-time updates.
- [ ] Check their current usage limits, data handling, and whether a payment
  method is required before choosing one.
- [ ] Keep private server credentials out of browser code and GitHub.
- [ ] Build a small test room before connecting it to the full quiz.

**Done means:** A host can start a room, players on separate devices can join
with a code, and their game state and final scores stay in sync during a test
game.

**Important:** GitHub Pages can serve the website files, but cannot itself run
the always-on server needed to synchronize a live game. Multiplayer needs a
separate service. We will investigate free tiers when we reach this milestone;
their prices, limits, and terms may change, so do not assume live hosting will
remain free or promise unlimited players.

### 7. Final checks and launch

- [ ] Test the complete game on a phone and computer, including a multiplayer
  session if we build one.
- [ ] Check error states, accessibility, and what happens if someone
  disconnects.
- [ ] Update the setup instructions and publish the finished version.

**Done means:** A new player can open the website and understand how to play,
and the project guide matches what the game actually does.

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
  Synchronized multiplayer needs one because separate players' browsers do not
  automatically know what each other is doing.
