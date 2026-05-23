const timerDisplay = document.querySelector('#timerDisplay');
const startPauseButton = document.querySelector('#startPauseButton');
const resetButton = document.querySelector('#resetButton');
const modeButtons = document.querySelectorAll('.mode-button');
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const taskCount = document.querySelector('#taskCount');
const conceptButtons = document.querySelectorAll('.concept-card');
const conceptDetail = document.querySelector('#conceptDetail');

const githubTopics = {
  repo: {
    title: 'Repository',
    body: 'A repository is the project folder on GitHub. It stores your files, history, settings, issues, pull requests, and Pages setup.',
    example: 'This repo is peter206815/my-training-project.'
  },
  commit: {
    title: 'Commit',
    body: 'A commit is a saved checkpoint. When a file changes, GitHub records what changed, who changed it, and when it happened.',
    example: 'Adding this guide created new commits in main.'
  },
  branch: {
    title: 'Branch',
    body: 'A branch is a separate line of work. You can experiment on a branch without changing the main version right away.',
    example: 'main is the current public version of this project.'
  },
  pullRequest: {
    title: 'Pull Request',
    body: 'A pull request is a review page for merging one branch into another. It shows the changed files and lets people discuss before merging.',
    example: 'Teams usually change code on a branch, then open a PR into main.'
  },
  pages: {
    title: 'GitHub Pages',
    body: 'GitHub Pages turns files in a repo into a public website. For this project, a workflow publishes the static site from main.',
    example: 'The live URL is usually peter206815.github.io/my-training-project.'
  },
  local: {
    title: 'Local Copy',
    body: 'A local copy is the version on your computer. You can open files, edit them, test changes, then send those changes back to GitHub.',
    example: 'Your local folder is C:/Users/User/Documents/Codex/2026-05-24/github/my-training-project.'
  }
};

let selectedMinutes = 25;
let remainingSeconds = selectedMinutes * 60;
let timerId = null;
let tasks = [];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  startPauseButton.textContent = 'Start';
}

function resetTimer(minutes = selectedMinutes) {
  stopTimer();
  selectedMinutes = minutes;
  remainingSeconds = selectedMinutes * 60;
  updateTimerDisplay();
}

function tick() {
  if (remainingSeconds <= 1) {
    remainingSeconds = 0;
    updateTimerDisplay();
    stopTimer();
    startPauseButton.textContent = 'Done';
    return;
  }

  remainingSeconds -= 1;
  updateTimerDisplay();
}

function startOrPauseTimer() {
  if (timerId) {
    stopTimer();
    return;
  }

  if (remainingSeconds === 0) {
    resetTimer();
  }

  startPauseButton.textContent = 'Pause';
  timerId = setInterval(tick, 1000);
}

function updateTaskCount() {
  const openTasks = tasks.filter((task) => !task.done).length;
  taskCount.textContent = `${openTasks} left`;
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.done ? ' done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      renderTasks();
    });

    const label = document.createElement('span');
    label.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'x';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
      renderTasks();
    });

    item.append(checkbox, label, deleteButton);
    taskList.append(item);
  });

  updateTaskCount();
}

function renderConcept(topicName) {
  const topic = githubTopics[topicName];
  conceptDetail.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.body}</p>
    <code>${topic.example}</code>
  `;
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modeButtons.forEach((modeButton) => modeButton.classList.remove('active'));
    button.classList.add('active');
    resetTimer(Number(button.dataset.minutes));
  });
});

startPauseButton.addEventListener('click', startOrPauseTimer);
resetButton.addEventListener('click', () => resetTimer());

conceptButtons.forEach((button) => {
  button.addEventListener('click', () => {
    conceptButtons.forEach((conceptButton) => conceptButton.classList.remove('active'));
    button.classList.add('active');
    renderConcept(button.dataset.topic);
  });
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    return;
  }

  tasks = [...tasks, { id: crypto.randomUUID(), text, done: false }];
  taskInput.value = '';
  renderTasks();
});

updateTimerDisplay();
renderConcept('repo');
renderTasks();
