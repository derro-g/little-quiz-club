const STORAGE_KEY = "little-quiz-club-demo-v2";
const ACTIVE_ATTEMPT_KEY = "little-quiz-club-active-attempt";

const exampleQuestions = [
  {
    question: "Which animal has three hearts?",
    answers: ["The blue whale", "The octopus", "The sea turtle", "The dolphin"],
    correct: 1,
    seconds: 20,
    points: 100
  },
  {
    question: "What is the largest planet in our solar system?",
    answers: ["Saturn", "Neptune", "Jupiter", "Uranus"],
    correct: 2,
    seconds: 20,
    points: 100
  },
  {
    question: "Which plant part usually absorbs water from the soil?",
    answers: ["The petals", "The leaves", "The stem", "The roots"],
    correct: 3,
    seconds: 20,
    points: 100
  },
  {
    question: "How many sides does a hexagon have?",
    answers: ["Five", "Six", "Seven", "Eight"],
    correct: 1,
    seconds: 20,
    points: 100
  },
  {
    question: "Which ocean is the largest?",
    answers: ["The Atlantic Ocean", "The Indian Ocean", "The Arctic Ocean", "The Pacific Ocean"],
    correct: 3,
    seconds: 20,
    points: 100
  }
];

const exampleTest = {
  id: "example-test",
  title: "Everyday Science & Nature",
  code: "QUIZ42",
  isOpen: true,
  isExample: true,
  createdAt: new Date().toISOString(),
  questions: exampleQuestions
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.tests) && Array.isArray(parsed.attempts)) return parsed;
    }

    const initialData = { tests: [exampleTest], attempts: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    showAppMessage("Browser storage is unavailable. The demo can be viewed, but your changes may not be saved.");
    return { tests: [exampleTest], attempts: [] };
  }
}

let data = loadData();
let activeTestId = null;
let activeAttempt = null;
let timerInterval = null;
let reportTestId = null;

const $ = (selector, root = document) => root.querySelector(selector);
const teacherView = $("#teacher-view");
const studentView = $("#student-view");
const teacherDashboard = $("#teacher-dashboard");
const testEditor = $("#test-editor");
const teacherResults = $("#teacher-results");
const studentJoin = $("#student-join");
const studentReady = $("#student-ready");
const studentQuiz = $("#student-quiz");
const studentResult = $("#student-result");
const appMessage = $("#app-message");
const joinMessage = $("#join-message");
const questionEditorList = $("#question-editor-list");

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    showAppMessage("Could not save this change in browser storage. Check your browser settings or available storage.");
    return false;
  }
}

function showAppMessage(message) {
  const element = $("#app-message");
  if (!element) return;
  element.textContent = message;
  element.classList.remove("hidden");
}

function clearAppMessage() {
  appMessage.textContent = "";
  appMessage.classList.add("hidden");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function makeId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code;
  do {
    code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (data.tests.some((test) => test.code === code));
  return code;
}

function getTest(testId) {
  return data.tests.find((test) => test.id === testId);
}

function showTeacherSection(section) {
  teacherDashboard.classList.toggle("hidden", section !== "dashboard");
  testEditor.classList.toggle("hidden", section !== "editor");
  teacherResults.classList.toggle("hidden", section !== "results");
}

function showStudentSection(section) {
  studentJoin.classList.toggle("hidden", section !== "join");
  studentReady.classList.toggle("hidden", section !== "ready");
  studentQuiz.classList.toggle("hidden", section !== "quiz");
  studentResult.classList.toggle("hidden", section !== "result");
}

function setRole(role) {
  clearAppMessage();
  const isTeacher = role === "teacher";
  teacherView.classList.toggle("hidden", !isTeacher);
  studentView.classList.toggle("hidden", isTeacher);
  $("#teacher-tab").classList.toggle("active", isTeacher);
  $("#student-tab").classList.toggle("active", !isTeacher);
  $("#teacher-tab").setAttribute("aria-pressed", String(isTeacher));
  $("#student-tab").setAttribute("aria-pressed", String(!isTeacher));
  if (isTeacher) {
    stopTimer();
    showTeacherSection("dashboard");
    renderTests();
  } else if (activeAttempt && activeAttempt.status === "in-progress") {
    showStudentSection("quiz");
    renderStudentQuestion();
  } else {
    showStudentSection("join");
  }
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderTests() {
  const list = $("#test-list");
  if (data.tests.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">✎</div><h3>Your first test starts here</h3><p>Create a test and its code will appear here for you to share.</p><button class="primary-button" type="button" data-action="create">Create a test</button></div>`;
    return;
  }

  list.innerHTML = data.tests.map((test) => {
    const attempts = data.attempts.filter((attempt) => attempt.testId === test.id);
    return `
      <article class="test-card">
        <div class="test-card-main">
          <div class="test-card-icon" aria-hidden="true">${test.isExample ? "✦" : "▤"}</div>
          <div class="test-card-title">
            <div class="test-title-line"><h3>${escapeHTML(test.title)}</h3>${test.isExample ? '<span class="sample-badge">Sample</span>' : ""}</div>
            <p>${test.questions.length} questions <span aria-hidden="true">·</span> Created ${formatDate(test.createdAt)}</p>
          </div>
          <span class="open-status ${test.isOpen ? "is-open" : ""}"><span></span>${test.isOpen ? "Open" : "Closed"}</span>
        </div>
        <div class="test-card-bottom">
          <div class="share-code"><span>TEST CODE</span><strong>${escapeHTML(test.code)}</strong></div>
          <div class="test-meta">${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"}</div>
          <div class="test-actions">
            <button class="secondary-button small-button" type="button" data-action="copy" data-test-id="${escapeHTML(test.id)}" aria-label="Copy code ${escapeHTML(test.code)}">Copy code</button>
            <button class="text-button" type="button" data-action="report" data-test-id="${escapeHTML(test.id)}">Results <span aria-hidden="true">→</span></button>
            <button class="text-button status-action" type="button" data-action="toggle" data-test-id="${escapeHTML(test.id)}">${test.isOpen ? "Close test" : "Reopen test"}</button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function questionEditorTemplate(index, question = {}) {
  const answers = question.answers || ["", "", "", ""];
  const correct = Number.isInteger(question.correct) ? question.correct : 0;
  return `
    <fieldset class="question-editor" data-question-index="${index}">
      <div class="question-editor-top">
        <legend>Question ${index + 1}</legend>
        ${index > 0 ? `<button class="remove-question" type="button" data-action="remove-question" aria-label="Remove question ${index + 1}">Remove</button>` : ""}
      </div>
      <label class="field-label" for="question-${index}">Question text</label>
      <input id="question-${index}" name="question" type="text" maxlength="240" value="${escapeHTML(question.question || "")}" placeholder="Write your question" required>
      <span class="field-label answer-instruction">Answer choices <span>Choose the correct answer</span></span>
      <div class="answer-editor-grid">
        ${answers.map((answer, answerIndex) => `
          <label class="answer-editor-option">
            <input type="radio" name="correct-${index}" value="${answerIndex}" ${correct === answerIndex ? "checked" : ""} aria-label="Mark answer ${answerIndex + 1} as correct">
            <input name="answer" type="text" maxlength="120" value="${escapeHTML(answer)}" placeholder="Answer ${answerIndex + 1}" aria-label="Answer ${answerIndex + 1}" required>
          </label>`).join("")}
      </div>
      <div class="question-settings">
        <label><span>Time limit</span><span class="input-with-suffix"><input name="seconds" type="number" min="5" max="300" value="${question.seconds || 20}" required><span>sec</span></span></label>
        <label><span>Points</span><span class="input-with-suffix"><input name="points" type="number" min="1" max="1000" value="${question.points || 100}" required><span>pts</span></span></label>
      </div>
    </fieldset>`;
}

function readEditorDraft() {
  const form = $("#test-form");
  return [...questionEditorList.querySelectorAll(".question-editor")].map((card) => {
    const index = Number(card.dataset.questionIndex);
    return {
      question: card.querySelector('[name="question"]').value,
      answers: [...card.querySelectorAll('[name="answer"]')].map((input) => input.value),
      correct: Number(card.querySelector(`[name="correct-${index}"]:checked`)?.value || 0),
      seconds: Number(card.querySelector('[name="seconds"]').value),
      points: Number(card.querySelector('[name="points"]').value)
    };
  });
}

function updateQuestionCount() {
  const count = questionEditorList.querySelectorAll(".question-editor").length;
  $("#editor-question-count").textContent = `${count} ${count === 1 ? "question" : "questions"}`;
}

function openEditor() {
  $("#test-form").reset();
  $("#test-title").value = "";
  questionEditorList.innerHTML = questionEditorTemplate(0);
  updateQuestionCount();
  showTeacherSection("editor");
  $("#test-title").focus();
}

function showReport(testId) {
  const test = getTest(testId);
  if (!test) return;
  reportTestId = testId;
  const attempts = data.attempts
    .filter((attempt) => attempt.testId === testId && attempt.status === "complete")
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  $("#report-title").textContent = test.title;
  $("#report-summary").textContent = `${test.questions.length} questions · ${attempts.length} completed ${attempts.length === 1 ? "attempt" : "attempts"}`;
  $("#report-empty").classList.toggle("hidden", attempts.length > 0);
  $(".results-table-wrap").classList.toggle("hidden", attempts.length === 0);
  $("#report-rows").innerHTML = attempts.map((attempt) => `
    <tr>
      <td><span class="student-avatar">${escapeHTML(attempt.studentName.trim().charAt(0).toUpperCase())}</span>${escapeHTML(attempt.studentName)}</td>
      <td><strong>${attempt.score} / ${attempt.maxScore}</strong><span class="score-percent">${attempt.maxScore ? Math.round((attempt.score / attempt.maxScore) * 100) : 0}%</span></td>
      <td>${formatDate(attempt.completedAt)}</td>
    </tr>`).join("");
  showTeacherSection("results");
}

function showJoinMessage(message) {
  joinMessage.textContent = message;
  joinMessage.classList.remove("hidden");
}

function startAttempt(test, studentName) {
  setRole("student");
  activeTestId = test.id;
  activeAttempt = {
    id: makeId(),
    testId: test.id,
    studentName: studentName.trim(),
    status: "in-progress",
    score: 0,
    maxScore: test.questions.reduce((total, question) => total + question.points, 0),
    answers: [],
    questionIndex: 0,
    questionDeadline: null,
    startedAt: new Date().toISOString()
  };
  data.attempts.push(activeAttempt);
  if (!saveData()) {
    data.attempts = data.attempts.filter((attempt) => attempt.id !== activeAttempt.id);
    activeAttempt = null;
    return;
  }
  try {
    sessionStorage.setItem(ACTIVE_ATTEMPT_KEY, activeAttempt.id);
  } catch (error) {
    showAppMessage("This browser cannot remember an in-progress test if the page is refreshed.");
  }
  showStudentSection("ready");
  $("#ready-title").textContent = `Ready, ${studentName.trim()}?`;
  $("#ready-details").textContent = test.title;
  $("#ready-pills").innerHTML = `
    <span class="detail">✦ ${test.questions.length} questions</span>
    <span class="detail">◷ ${test.questions.reduce((total, question) => total + question.seconds, 0)} seconds total</span>
    <span class="detail">★ Up to ${activeAttempt.maxScore} points</span>`;
}

function getActiveTest() {
  return getTest(activeTestId);
}

function renderStudentQuestion() {
  const test = getActiveTest();
  if (!test || !activeAttempt) return;
  const index = activeAttempt.questionIndex;
  const question = test.questions[index];
  if (!question) {
    finishAttempt();
    return;
  }

  const previousAnswer = activeAttempt.answers[index];
  if (!previousAnswer && !activeAttempt.questionDeadline) {
    activeAttempt.questionDeadline = Date.now() + question.seconds * 1000;
    if (!saveData()) return;
  }

  stopTimer();
  showStudentSection("quiz");
  $("#student-question-count").textContent = `Question ${index + 1} of ${test.questions.length}`;
  $("#student-score").textContent = `${activeAttempt.score} points`;
  $("#student-progress-track").setAttribute("aria-valuemax", String(test.questions.length));
  $("#student-progress-track").setAttribute("aria-valuenow", String(index));
  $("#student-progress-bar").style.width = `${(index / test.questions.length) * 100}%`;
  $("#student-question-title").textContent = question.question;
  $("#student-feedback").textContent = "";
  $("#student-feedback").classList.remove("wrong");
  $("#student-next-button").classList.add("hidden");
  $("#student-next-button").textContent = index === test.questions.length - 1 ? "See my result →" : "Next question →";
  $("#student-answers").innerHTML = question.answers.map((answer, answerIndex) => `
    <button class="answer ${previousAnswer?.selectedIndex === answerIndex ? (previousAnswer.correct ? "correct" : "incorrect") : ""}" type="button" data-answer-index="${answerIndex}" ${previousAnswer ? "disabled" : ""}>
      <span class="answer-letter">${String.fromCharCode(65 + answerIndex)}</span><span>${escapeHTML(answer)}</span>
    </button>`).join("");
  if (previousAnswer) {
    $("#timer-value").textContent = previousAnswer.timedOut ? "Time’s up" : "Answered";
    $("#timer-bar").style.width = previousAnswer.timedOut ? "0%" : "100%";
    $("#student-feedback").textContent = previousAnswer.timedOut
      ? "Time’s up! No points for this question."
      : previousAnswer.correct
        ? `Correct! +${previousAnswer.pointsEarned} points`
        : "Answer saved. Let’s keep going.";
    $("#student-feedback").classList.toggle("wrong", previousAnswer.timedOut);
    $("#student-next-button").classList.remove("hidden");
  } else {
    updateTimer();
    timerInterval = window.setInterval(updateTimer, 200);
  }
  $("#student-question-title").focus();
}

function stopTimer() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  if (!activeAttempt || activeAttempt.status !== "in-progress") {
    stopTimer();
    return;
  }
  const test = getActiveTest();
  const question = test?.questions[activeAttempt.questionIndex];
  if (!question) {
    stopTimer();
    return;
  }

  const remaining = Math.max(0, activeAttempt.questionDeadline - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  $("#timer-value").textContent = `${seconds}s`;
  $("#timer-bar").style.width = `${(remaining / (question.seconds * 1000)) * 100}%`;
  $("#timer-bar").classList.toggle("timer-warning", seconds <= 5);
  $("#timer-value").classList.toggle("timer-warning-text", seconds <= 5);
  if (remaining <= 0) recordAnswer(null, true);
}

function recordAnswer(selectedIndex, timedOut = false) {
  if (!activeAttempt || activeAttempt.status !== "in-progress" || activeAttempt.answers[activeAttempt.questionIndex]) return;
  stopTimer();
  const test = getActiveTest();
  const index = activeAttempt.questionIndex;
  const question = test.questions[index];
  const answeredInTime = Date.now() <= activeAttempt.questionDeadline;
  const correct = selectedIndex !== null && selectedIndex === question.correct && answeredInTime;
  const pointsEarned = correct ? question.points : 0;
  activeAttempt.answers[index] = {
    selectedIndex,
    correct,
    pointsEarned,
    timedOut: timedOut || !answeredInTime
  };
  activeAttempt.score += pointsEarned;
  $("#student-answers").querySelectorAll(".answer").forEach((button) => {
    button.disabled = true;
    if (Number(button.dataset.answerIndex) === selectedIndex) {
      button.classList.add(correct ? "correct" : "incorrect");
    }
  });
  $("#student-score").textContent = `${activeAttempt.score} points`;
  $("#student-progress-track").setAttribute("aria-valuenow", String(index + 1));
  $("#student-progress-bar").style.width = `${((index + 1) / test.questions.length) * 100}%`;
  if (timedOut || !answeredInTime) {
    $("#student-feedback").textContent = "Time’s up! No points for this question.";
    $("#student-feedback").classList.add("wrong");
  } else if (correct) {
    $("#student-feedback").textContent = `Correct! +${pointsEarned} points`;
  } else {
    $("#student-feedback").textContent = "Answer saved. Let’s keep going.";
  }
  $("#student-next-button").classList.remove("hidden");
  saveData();
}

function finishAttempt() {
  stopTimer();
  activeAttempt.status = "complete";
  activeAttempt.completedAt = new Date().toISOString();
  activeAttempt.questionDeadline = null;
  if (!saveData()) {
    activeAttempt.status = "in-progress";
    return;
  }
  try {
    sessionStorage.removeItem(ACTIVE_ATTEMPT_KEY);
  } catch (error) {
    showAppMessage("The test is complete, but this browser could not clear its saved progress.");
  }
  showStudentSection("result");
  $("#student-result-title").textContent = activeAttempt.score === activeAttempt.maxScore ? "A perfect score!" : "Nice work!";
  const percentage = activeAttempt.maxScore ? Math.round((activeAttempt.score / activeAttempt.maxScore) * 100) : 0;
  $("#student-result-copy").innerHTML = `You scored <strong>${activeAttempt.score} out of ${activeAttempt.maxScore}</strong> points.`;
  $("#student-result-details").innerHTML = `
    <div><strong>${percentage}%</strong><span>Overall score</span></div>
    <div><strong>${activeAttempt.answers.filter((answer) => answer?.correct).length} / ${activeAttempt.answers.length}</strong><span>Correct answers</span></div>`;
  $("#student-done-button").focus();
}

function restoreActiveAttempt() {
  try {
    const attemptId = sessionStorage.getItem(ACTIVE_ATTEMPT_KEY);
    if (!attemptId) return false;
    const attempt = data.attempts.find((item) => item.id === attemptId && item.status === "in-progress");
    if (!attempt || !getTest(attempt.testId)) {
      sessionStorage.removeItem(ACTIVE_ATTEMPT_KEY);
      return false;
    }
    activeAttempt = attempt;
    activeTestId = attempt.testId;
    setRole("student");
    showStudentSection("quiz");
    renderStudentQuestion();
    return true;
  } catch (error) {
    showAppMessage("Could not restore your in-progress demo test. Please join the test again.");
    return false;
  }
}

$("#teacher-tab").addEventListener("click", () => setRole("teacher"));
$("#student-tab").addEventListener("click", () => setRole("student"));
$("#home-link").addEventListener("click", (event) => {
  event.preventDefault();
  setRole("teacher");
});
$("#create-test-button").addEventListener("click", openEditor);
$("#reset-demo-button").addEventListener("click", () => {
  if (!window.confirm("Remove locally saved demo tests and student results from this browser?")) return;
  stopTimer();
  data = { tests: [{ ...exampleTest, questions: exampleQuestions }], attempts: [] };
  activeTestId = null;
  activeAttempt = null;
  try {
    sessionStorage.removeItem(ACTIVE_ATTEMPT_KEY);
  } catch (error) {
    showAppMessage("Demo data was reset, but this browser could not clear its saved attempt marker.");
  }
  if (saveData()) {
    clearAppMessage();
    showTeacherSection("dashboard");
    renderTests();
  }
});
$("#editor-back-button").addEventListener("click", () => {
  showTeacherSection("dashboard");
  renderTests();
});
$("#cancel-test-button").addEventListener("click", () => {
  showTeacherSection("dashboard");
  renderTests();
});
$("#add-question-button").addEventListener("click", () => {
  const draft = readEditorDraft();
  if (draft.length >= 20) {
    showAppMessage("A test can have up to 20 questions in this prototype.");
    return;
  }
  draft.push({});
  questionEditorList.innerHTML = draft.map((question, index) => questionEditorTemplate(index, question)).join("");
  updateQuestionCount();
  questionEditorList.lastElementChild.querySelector('[name="question"]').focus();
});

questionEditorList.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="remove-question"]');
  if (!button) return;
  const draft = readEditorDraft();
  const card = button.closest(".question-editor");
  draft.splice(Number(card.dataset.questionIndex), 1);
  questionEditorList.innerHTML = draft.map((question, index) => questionEditorTemplate(index, question)).join("");
  updateQuestionCount();
});

$("#test-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = $("#test-title").value.trim();
  const questions = readEditorDraft().map((question) => ({
    ...question,
    question: question.question.trim(),
    answers: question.answers.map((answer) => answer.trim())
  }));
  if (!title || questions.length === 0 || questions.some((question) =>
    !question.question || question.answers.length !== 4 || question.answers.some((answer) => !answer) ||
    question.seconds < 5 || question.seconds > 300 || question.points < 1 || question.points > 1000
  )) {
    showAppMessage("Please complete every question, answer choice, timer, and point value before saving.");
    return;
  }

  const test = {
    id: makeId(),
    title,
    code: makeCode(),
    isOpen: true,
    isExample: false,
    createdAt: new Date().toISOString(),
    questions
  };
  data.tests.unshift(test);
  if (!saveData()) {
    data.tests = data.tests.filter((item) => item.id !== test.id);
    return;
  }
  clearAppMessage();
  showTeacherSection("dashboard");
  renderTests();
});

$("#test-list").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const test = getTest(button.dataset.testId);
  if (!test) return;

  if (button.dataset.action === "report") {
    showReport(test.id);
  } else if (button.dataset.action === "toggle") {
    test.isOpen = !test.isOpen;
    if (saveData()) renderTests();
  } else if (button.dataset.action === "copy") {
    try {
      await navigator.clipboard.writeText(test.code);
      button.textContent = "Copied!";
      window.setTimeout(() => { button.textContent = "Copy code"; }, 1600);
    } catch (error) {
      showAppMessage(`Copying is not available here. Share the code ${test.code} manually.`);
    }
  } else if (button.dataset.action === "create") {
    openEditor();
  }
});

$("#results-back-button").addEventListener("click", () => {
  showTeacherSection("dashboard");
  renderTests();
  if (reportTestId) {
    const card = $("#test-list").querySelector(`[data-test-id="${CSS.escape(reportTestId)}"]`);
    card?.focus();
  }
});

$("#join-form").addEventListener("submit", (event) => {
  event.preventDefault();
  joinMessage.classList.add("hidden");
  const code = $("#join-code").value.trim().toUpperCase().replace(/\s+/g, "");
  const studentName = $("#student-name").value.trim();
  if (studentName.length < 2) {
    showJoinMessage("Please enter a name with at least two characters.");
    return;
  }
  const test = data.tests.find((item) => item.code === code);
  if (!test) {
    showJoinMessage("We couldn’t find that code. Check it with your teacher and try again.");
    return;
  }
  if (!test.isOpen) {
    showJoinMessage("This test is closed. Ask your teacher if they can reopen it.");
    return;
  }
  startAttempt(test, studentName);
});

$("#begin-test-button").addEventListener("click", () => {
  if (!activeAttempt) return;
  activeAttempt.questionIndex = 0;
  renderStudentQuestion();
});

$("#student-answers").addEventListener("click", (event) => {
  const button = event.target.closest("[data-answer-index]");
  if (button && !button.disabled) recordAnswer(Number(button.dataset.answerIndex));
});

$("#student-next-button").addEventListener("click", () => {
  if (!activeAttempt) return;
  activeAttempt.questionIndex++;
  activeAttempt.questionDeadline = null;
  if (activeAttempt.questionIndex >= getActiveTest().questions.length) {
    finishAttempt();
    return;
  }
  saveData();
  renderStudentQuestion();
});

$("#student-done-button").addEventListener("click", () => {
  activeAttempt = null;
  activeTestId = null;
  $("#join-form").reset();
  showStudentSection("join");
});

renderTests();
showTeacherSection("dashboard");
showStudentSection("join");
restoreActiveAttempt();
