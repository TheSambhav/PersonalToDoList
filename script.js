// Global array to store tasks
let taskList = [];

// Function to add a new task to the list
function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();
  const taskDate = document.getElementById('task-date').value.trim();

  if (taskText !== '') {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString();
    taskList.push({ text: taskText, date: taskDate, time: formattedTime, completed: false, completedTime: '' });
    taskInput.value = '';
    renderTasks();
    showAddedMessage();
  }
}

// Function to show a flash message saying "ADDED"
function showAddedMessage() {
  const addedMessage = document.getElementById('added-message');
  addedMessage.textContent = 'ADDED';
  addedMessage.style.display = 'block';
  setTimeout(() => {
    addedMessage.style.display = 'none';
  }, 1000); // Display the message for 1 second
}

// Function to remove a task from the list
function removeTask(index) {
  taskList.splice(index, 1);
  renderTasks();
}

// Function to edit a task
function editTask(index) {
  const updatedTask = prompt('Edit task:', taskList[index].text);
  if (updatedTask !== null && updatedTask.trim() !== '') {
    taskList[index].text = updatedTask.trim();
    renderTasks();
  }
}

// Function to toggle task completion status
function toggleTaskCompletion(index) {
  if (taskList[index].completed) {
    taskList[index].completedTime = '';
  } else {
    const currentTime = new Date();
    taskList[index].completedTime = currentTime.toLocaleString();
  }
  taskList[index].completed = !taskList[index].completed;
  renderTasks();
}

// Function to show details of a task
function showTaskDetails(index) {
  const detailsElement = document.getElementById(`task-details-${index}`);
  detailsElement.style.display = detailsElement.style.display === 'none' ? 'block' : 'none';
}

// Function to reset the task list
function resetTasks() {
  taskList = [];
  renderTasks();
}

// Function to group tasks by date and sort them in ascending order
function groupAndSortTasksByDate(tasks) {
  const groupedTasks = {};
  tasks.forEach((task, index) => {
    const taskDate = task.date || ''; // Use empty string if date is not provided
    if (!groupedTasks[taskDate]) {
      groupedTasks[taskDate] = [];
    }
    groupedTasks[taskDate].push({ ...task, index });
  });

  // Sort the groups by date in ascending order
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    if (a === '') return -1; // Sort tasks without a date at the top
    if (b === '') return 1;
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  return sortedDates.map((date) => ({ date, tasks: groupedTasks[date] }));
}

// Function to render tasks in the UI
function renderTasks() {
  const taskListContainer = document.getElementById('task-list');
  taskListContainer.innerHTML = '';

  // Group and sort tasks by date
  const groupedAndSortedTasks = groupAndSortTasksByDate(taskList);

  groupedAndSortedTasks.forEach((group) => {
    const date = group.date;
    const tasks = group.tasks;

    // Create a separate list for each date
    const dateList = document.createElement('ul');

    if (date) {
      // Create an item for the date
      const dateItem = document.createElement('li');
      dateItem.innerHTML = `<h3>${date}</h3>`;
      dateList.appendChild(dateItem);
    }

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <input class="task-list-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.index})">
          <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};">${index + 1}. ${task.text}</span>
          <button class="show-details-btn" onclick="showTaskDetails(${task.index})">Details</button>
        </div>
        <div class="task-details" id="task-details-${task.index}" style="display: none;">
          <p>Added on: ${task.time}</p>
          ${task.completed ? `<p>Completed on: ${task.completedTime}</p>` : ''}
        </div>
        <div class="task-buttons">
          <button class="delete-btn" onclick="removeTask(${task.index})">Delete</button>
          <button class="edit-btn" onclick="editTask(${task.index})">Edit</button>
        </div>
      `;
      dateList.appendChild(li);
    });

    taskListContainer.appendChild(dateList);
  });
}

// Add event listeners
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});
document.getElementById('reset-tasks').addEventListener('click', resetTasks);

// Initial rendering of tasks
renderTasks();
