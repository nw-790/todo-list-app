function saveTasksToStorage() {
    const allTasks = [];
    const listItems = document.querySelectorAll("#task-list  li");

    listItems.forEach(li => {
        const text = li.querySelector("span").innerText;
        const complete = li.getAttribute("data-complete") === "true";
        allTasks.push({text, complete});
    })

    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasksFromStorage() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
}


const input = document.getElementById('task-input');
const button = document.getElementById('add-task-button');
const list = document.getElementById('task-list');

button.addEventListener("click", function () {
  if (input.value.trim() === "") return;

  const taskText = input.value.trim();
  createTaskElement(taskText, false);  // false means "not completed"
  saveTasksToStorage();                // sync with localStorage
  input.value = "";                    // reset the input field
});

function createTaskElement(taskTextContent, isComplete) {
    const liElement = document.createElement('li');
    liElement.setAttribute('data-complete', isComplete.toString());

    const taskText = document.createElement('span');
    taskText.innerText = taskTextContent;
    liElement.appendChild(taskText);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    liElement.appendChild(deleteButton);
    deleteButton.addEventListener('click', function () {
        liElement.remove(); 
        saveTasksToStorage(); // sync
    });

    const editButton = document.createElement('button');
    editButton.innerText = "Edit";
    liElement.appendChild(editButton);
    editButton.addEventListener('click', function () {
        const newTask = prompt("Enter new task:");
        if (newTask !== null && newTask.trim() !== "") {
            taskText.innerText = newTask;
            saveTasksToStorage(); // sync
        }
    });

    const completeButton = document.createElement('button');
    completeButton.innerText = isComplete ? "Mark as incomplete" : "Mark as complete";
    if (isComplete) taskText.style.textDecoration = 'line-through';
    liElement.appendChild(completeButton);

    completeButton.addEventListener('click', function () {
        const complete = liElement.getAttribute('data-complete') === 'true';
        liElement.setAttribute('data-complete', (!complete).toString());

        taskText.style.textDecoration = complete ? 'none' : 'line-through';
        completeButton.innerText = complete ? "Mark as complete" : "Mark as incomplete";

        saveTasksToStorage(); // sync
    });

    list.appendChild(liElement);
} 
   

// Filter functionality

const taskAll = document.getElementById('filter-all');
const taskComplete = document.getElementById('filter-completed');
const taskIncomplete = document.getElementById('filter-incomplete');

// Event listener for the 'all' button

taskAll.addEventListener('click', function () {
    filterTasks('all');
})

// Event listener for the 'completed' button

taskComplete.addEventListener('click', function () {
    filterTasks('completed');
})

taskIncomplete.addEventListener('click', function () {
    filterTasks('incomplete');
})

//  Function to filter tasks based on completion status

function filterTasks(filter) {
    const tasks = document.querySelectorAll('li'); // Select all list items (tasks)

    tasks.forEach(function(task) {
        const taskComplete = task.getAttribute('data-complete'); // Get the task's data-complete attribute

        // Based on the selected filter, show or hide the task
        if (filter === 'all') {
            task.style.display = 'list-item'; // Show all tasks
        } else if (filter === 'completed' && taskComplete === 'true') {
            task.style.display = 'list-item'; // Show only completed tasks
        } else if (filter === 'incomplete' && taskComplete === 'false') {
            task.style.display = 'list-item'; // Show only incomplete tasks
        } else {
            task.style.display = 'none'; // Hide the task if it doesn't match the filter
        }
    });
}

document.addEventListener("DOMContentLoaded", function () { 
    const savedTasks = loadTasksFromStorage();
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.complete);
    });
});
