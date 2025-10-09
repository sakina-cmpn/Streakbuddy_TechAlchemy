const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const habitList = document.getElementById("habitList");
const quote = document.getElementById("quote");
const newQuote = document.getElementById("newQuote");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const streakCount = document.getElementById("streakCount");
const themeToggle = document.getElementById("themeToggle");

const quotes = [
  "“Discipline is the bridge between goals and accomplishment.”",
  "“Don’t break the chain – keep your streak alive!”",
  "“Habits are the compound interest of self-improvement.”",
  "“Success is the sum of small efforts repeated daily.”",
  "“A little progress each day adds up to big results.”"
];

// Save and load habits
function saveHabits() {
  const habits = [];
  document.querySelectorAll("li").forEach((li) => {
    habits.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("habits", JSON.stringify(habits));
  updateProgress();
}

function loadHabits() {
  const saved = JSON.parse(localStorage.getItem("habits") || "[]");
  saved.forEach((habit) => addHabit(habit.text, habit.completed));
  updateProgress();
}

// Add habit
function addHabit(text, completed = false) {
  if (!text) return;
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text;
  li.appendChild(span);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete";
  li.appendChild(delBtn);

  if (completed) li.classList.add("completed");

  li.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;
    li.classList.toggle("completed");
    saveHabits();
  });

  delBtn.addEventListener("click", () => {
    li.remove();
    saveHabits();
  });

  habitList.appendChild(li);
  habitInput.value = "";
  saveHabits();
}

addBtn.addEventListener("click", () => addHabit(habitInput.value));
habitInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addHabit(habitInput.value);
});

newQuote.addEventListener("click", () => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quote.textContent = random;
});

// Progress and streaks
function updateProgress() {
  const total = document.querySelectorAll("li").length;
  const completed = document.querySelectorAll("li.completed").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;

  updateStreak(completed, total);
}

function updateStreak(completed, total) {
  let streak = parseInt(localStorage.getItem("streak") || "0");
  const lastDate = localStorage.getItem("lastDate");
  const today = new Date().toDateString();

  if (lastDate !== today && completed === total && total > 0) {
    streak += 1;
    localStorage.setItem("lastDate", today);
    localStorage.setItem("streak", streak);
  } else if (lastDate !== today && completed < total) {
    streak = 0;
    localStorage.setItem("streak", 0);
    localStorage.setItem("lastDate", today);
  }

  streakCount.textContent = streak;
}

// 🌙 Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  themeToggle.textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("darkMode", darkMode);
});

// Load theme preference
function loadTheme() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
}

loadHabits();
loadTheme();
updateProgress();
