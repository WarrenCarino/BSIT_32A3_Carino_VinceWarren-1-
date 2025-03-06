document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const sortButton = document.getElementById('sortButton');
    
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    sortButton.addEventListener('click', sortTasks);

    function addTask() {
        const task = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (task && dueDate) {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center ${priority}-priority`;
            listItem.innerHTML = `
                <span>${task} (Due: ${dueDate})</span>
                <div>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                </div>
            `;

            if (new Date(dueDate) < new Date()) {
                listItem.classList.add('overdue');
            }

            taskList.appendChild(listItem);
            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'low';

            saveTasks();
        } else {
            alert("Please fill in both the task and the due date.");
        }
    }

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const listItem = e.target.parentElement.parentElement;
            taskList.removeChild(listItem);
            saveTasks();
        }
        if (e.target.classList.contains('done-button')) {
            const listItem = e.target.parentElement.parentElement;
            listItem.classList.toggle('list-group-item-success');
            saveTasks();
        }
        if (e.target.classList.contains('edit-button')) {
            const listItem = e.target.parentElement.parentElement;
            const taskText = listItem.querySelector('span').textContent.split(" (Due: ")[0];
            const dueDate = listItem.querySelector('span').textContent.split(" (Due: ")[1].replace(')', '');
            taskInput.value = taskText;
            dueDateInput.value = dueDate;
            taskList.removeChild(listItem);
            saveTasks();
        }
    });

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(item => {
            const taskText = item.querySelector('span').textContent.split(" (Due: ")[0];
            const dueDate = item.querySelector('span').textContent.split(" (Due: ")[1].replace(')', '');
            const priority = item.classList.contains('high-priority') ? 'high' : 
                             item.classList.contains('medium-priority') ? 'medium' : 'low';
            tasks.push({ taskText, dueDate, priority });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center ${task.priority}-priority`;
            listItem.innerHTML = `
                <span>${task.taskText} (Due: ${task.dueDate})</span>
                <div>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                </div>
            `;

            // Add overdue class if the task is overdue
            if (new Date(task.dueDate) < new Date()) {
                listItem.classList.add('overdue');
            }

            taskList.appendChild(listItem);
        });
    }

    function sortTasks() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            const priorityA = a.classList.contains('high-priority') ? 'high' :
                              a.classList.contains('medium-priority') ? 'medium' : 'low';
            const priorityB = b.classList.contains('high-priority') ? 'high' :
                              b.classList.contains('medium-priority') ? 'medium' : 'low';
            return priorityOrder[priorityB] - priorityOrder[priorityA];
        });
        taskList.innerHTML = '';
        tasks.forEach(task => taskList.appendChild(task));
    }
});
