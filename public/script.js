const API_URL = '/api/tasks';
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = [];

// Initialize
document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id}, ${task.completed})"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.title}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

async function toggleTask(id, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        });

        if (response.ok) {
            const updatedTask = await response.json();
            tasks = tasks.map(t => t.id === id ? updatedTask : t);
            renderTasks();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function updateStats() {
    const activeTasks = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

clearCompletedBtn.addEventListener('click', async () => {
    const completedTasks = tasks.filter(t => t.completed);
    
    for (const task of completedTasks) {
        await deleteTask(task.id);
    }
});
