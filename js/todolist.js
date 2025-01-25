document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskDate = document.getElementById('task-date');
    const newTaskStartTime = document.getElementById('task-start-time');
    const newTaskEndTime = document.getElementById('task-end-time');
    const newTaskActivity = document.getElementById('task-activity');
    const taskList = document.getElementById('task-list');
    const dashboardTaskTableBody = document.querySelector('#dashboard-task-table tbody');
    const notificationList = document.getElementById('notification-list');
    const dashboardNotificationList = document.getElementById('dashboard-notification-list');
    const notificationDetails = document.getElementById('notification-details');
    const notificationMessage = document.getElementById('notification-message');
    const settingsForm = document.querySelector('#settings form');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const settings = JSON.parse(localStorage.getItem('settings')) || {
        notificationFrequency: 'immediate',
        theme: 'light',
        language: 'en'
    };

    // Function to display sections
    function showSection(sectionId) {
        document.querySelectorAll('.content section').forEach(section => section.classList.add('hidden'));
        document.getElementById(sectionId).classList.remove('hidden');
        
        if (sectionId === 'dashboard') {
            loadTasksForDashboard();
            displayNotifications();
        }
    }

    // Event listener for navigation
    document.querySelectorAll('.sidebar a, .topnav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSection = e.target.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });

    // Event listener for adding tasks
    addTaskBtn.addEventListener('click', () => {
        const taskDate = newTaskDate.value.trim();
        const taskStartTime = newTaskStartTime.value.trim();
        const taskEndTime = newTaskEndTime.value.trim();
        const taskActivity = newTaskActivity.value.trim();
        if (taskDate && taskStartTime && taskEndTime && taskActivity) {
            addTask(taskDate, taskStartTime, taskEndTime, taskActivity);
            newTaskDate.value = '';
            newTaskStartTime.value = '';
            newTaskEndTime.value = '';
            newTaskActivity.value = '';
            saveTasks();
        }
    });

    // Function to add tasks
    function addTask(date, startTime, endTime, activity) {
        const task = { date, startTime, endTime, activity };
        tasks.push(task);
        saveTasks();
        const taskItem = createTaskItem(task);
        taskList.appendChild(taskItem);
        addNotification(`New task '${activity}' added.`, notificationList);
    }

    // Function to create task items
    function createTaskItem(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span>${task.date} ${task.startTime} - ${task.endTime}: ${task.activity}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            taskList.removeChild(taskItem);
            tasks.splice(tasks.indexOf(task), 1);
            saveTasks();
            loadTasksForDashboard();
            displayNotifications();
        });

        taskItem.querySelector('.edit-btn').addEventListener('click', () => {
            newTaskDate.value = task.date;
            newTaskStartTime.value = task.startTime;
            newTaskEndTime.value = task.endTime;
            newTaskActivity.value = task.activity;
            taskList.removeChild(taskItem);
            tasks.splice(tasks.indexOf(task), 1);
            saveTasks();
            loadTasksForDashboard();
            displayNotifications();
        });

        return taskItem;
    }

    // Function to save tasks
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks
    function loadTasks() {
        tasks.forEach(task => {
            const taskItem = createTaskItem(task);
            taskList.appendChild(taskItem);
        });
    }

    // Function to load tasks for dashboard
    function loadTasksForDashboard() {
        dashboardTaskTableBody.innerHTML = '';
        tasks.forEach(task => {
            const taskRow = document.createElement('tr');
            taskRow.innerHTML = `
                <td>${task.date}</td>
                <td>${task.startTime}</td>
                <td>${task.endTime}</td>
                <td>${task.activity}</td>
            `;
            dashboardTaskTableBody.appendChild(taskRow);
        });
    }

    // Function to add notifications
    function addNotification(message, list) {
        const li = document.createElement('li');
        li.textContent = message;
        li.addEventListener('click', () => displayNotificationDetails(message)); // Event listener for displaying notification details
        list.appendChild(li);
    }

    // Function to display notification details
    function displayNotificationDetails(message) {
        notificationMessage.textContent = message;
        notificationDetails.classList.remove('hidden');
    }

    // Function to display notifications
    function displayNotifications() {
        dashboardNotificationList.innerHTML = '';
        const now = new Date();
        tasks.forEach(task => {
            const taskEndDate = new Date(`${task.date} ${task.endTime}`);
            if (taskEndDate > now) {
                addNotification(`Task '${task.activity}' is due on ${task.date} at ${task.endTime}.`, dashboardNotificationList);
            }
        });
    }

    // Event listener for settings form
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        settings.notificationFrequency = document.getElementById('notification-frequency').value;
        settings.theme = document.getElementById('theme').value;
        settings.language = document.getElementById('language').value;
        saveSettings();
    });

    // Function to save settings
    function saveSettings() {
        localStorage.setItem('settings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    }

    // Function to load settings
    function loadSettings() {
        document.getElementById('notification-frequency').value = settings.notificationFrequency;
        document.getElementById('theme').value = settings.theme;
        document.getElementById('language').value = settings.language;
    }

    // Function to display current date
    function displayCurrentDate() {
        const currentDate = new Date().toLocaleDateString();
        document.getElementById('current-date').textContent = currentDate;
    }

    loadTasks();
    loadSettings();
    displayCurrentDate();
    showSection('features');

    // Initial notifications
    addNotification("Task 'Finish project report' is due tomorrow.", notificationList);
    addNotification("New feature 'Team collaboration' is now available.", notificationList);
});
