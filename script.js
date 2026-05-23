const timerDisplay = document.querySelector('#timerDisplay');
const startPauseButton = document.querySelector('#startPauseButton');
const resetButton = document.querySelector('#resetButton');
const modeButtons = document.querySelectorAll('.mode-button');
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const taskCount = document.querySelector('#taskCount');

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
    deleteButton.textContent = '×';
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

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modeButtons.forEach((modeButton) => modeButton.classList.remove('active'));
    button.classList.add('active');
    resetTimer(Number(button.dataset.minutes));
  });
});

startPauseButton.addEventListener('click', startOrPauseTimer);
resetButton.addEventListener('click', () => resetTimer());

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
renderTasks();
