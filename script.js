const questions = [
  {
    question: "Which animal has three hearts?",
    answers: ["The blue whale", "The octopus", "The sea turtle", "The dolphin"],
    correct: 1,
    fact: "An octopus has two hearts that pump blood to its gills, and one for the rest of its body."
  },
  {
    question: "What is the largest planet in our solar system?",
    answers: ["Saturn", "Neptune", "Jupiter", "Uranus"],
    correct: 2,
    fact: "Jupiter is so large that more than 1,300 Earths could fit inside it."
  },
  {
    question: "Which plant part usually absorbs water from the soil?",
    answers: ["The petals", "The leaves", "The stem", "The roots"],
    correct: 3,
    fact: "Roots take up water and nutrients, helping anchor the plant in place."
  },
  {
    question: "How many sides does a hexagon have?",
    answers: ["Five", "Six", "Seven", "Eight"],
    correct: 1,
    fact: "The prefix “hex” means six, so a hexagon has six sides."
  },
  {
    question: "Which ocean is the largest?",
    answers: ["The Atlantic Ocean", "The Indian Ocean", "The Arctic Ocean", "The Pacific Ocean"],
    correct: 3,
    fact: "The Pacific Ocean covers more area than all of Earth's land combined."
  }
];

const welcome = document.getElementById("welcome");
const quiz = document.getElementById("quiz");
const results = document.getElementById("results");
const questionCount = document.getElementById("question-count");
const scoreCount = document.getElementById("score-count");
const progressTrack = document.querySelector(".progress-track");
const progressBar = document.getElementById("progress-bar");
const questionTitle = document.getElementById("question-title");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
let currentQuestion = 0;
let score = 0;

function showQuestion() {
  const item = questions[currentQuestion];
  questionCount.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  scoreCount.textContent = `Score: ${score}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", currentQuestion);
  questionTitle.textContent = item.question;
  feedback.textContent = "";
  feedback.classList.remove("wrong");
  nextButton.classList.add("hidden");
  answersContainer.replaceChildren();

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer}</span>`;
    button.addEventListener("click", () => selectAnswer(index));
    answersContainer.append(button);
  });
}

function selectAnswer(selectedIndex) {
  const item = questions[currentQuestion];
  const buttons = answersContainer.querySelectorAll(".answer");
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
  });

  if (selectedIndex === item.correct) {
    score++;
    feedback.textContent = `That's right! ${item.fact}`;
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    feedback.textContent = `Not quite. ${item.fact}`;
    feedback.classList.add("wrong");
  }

  scoreCount.textContent = `Score: ${score}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", currentQuestion + 1);
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See my score →" : "Next question →";
  nextButton.classList.remove("hidden");
  nextButton.focus();
}

document.getElementById("start-button").addEventListener("click", () => {
  welcome.classList.add("hidden");
  quiz.classList.remove("hidden");
  showQuestion();
  questionTitle.focus();
});

nextButton.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
    questionTitle.focus();
    return;
  }

  quiz.classList.add("hidden");
  results.classList.remove("hidden");
  document.getElementById("result-title").textContent =
    score === questions.length ? "A perfect round!" : score >= 3 ? "Nicely done!" : "Curiosity looks good on you.";
  document.getElementById("result-copy").innerHTML =
    `You got <strong>${score} out of ${questions.length}</strong> questions right. Thanks for playing!`;
  document.getElementById("restart-button").focus();
});

document.getElementById("restart-button").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  results.classList.add("hidden");
  welcome.classList.remove("hidden");
  document.getElementById("start-button").focus();
});
