// TaskFlow – Smart To‑Do Manager
// ---------------------------------------------------
// Centralized state
const STORAGE_KEY = 'taskflow_tasks';
const THEME_KEY = 'taskflow_theme';
let tasks = [];
let currentFilter = 'all';
let searchTerm = '';

// DOM Elements
const taskListEl = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const totalCountEl = document.getElementById('total-count');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterAllCount = document.getElementById('filter-all-count');
const filterActiveCount = document.getElementById('filter-active-count');
const filterCompletedCount = document.getElementById('filter-completed-count');
const searchInput = document.getElementById('search-input');
const clearCompletedBtn = document.getElementById('clear-completed');
const emptyStateEl = document.getElementById('empty-state');
const themeToggle = document.getElementById('theme-toggle');
const currentDateEl = document.getElementById('current-date');
const todayDateEl = document.getElementById('today-date');
const greetingEl = document.getElementById('greeting');

// -------------------------------------------------------------------
// Utility functions
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks', e);
    }
}

function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) return data;
    } catch (e) {
        console.error('Invalid task data in storage', e);
    }
    return [];
}

function generateId() {
    // Simple unique ID based on timestamp + random suffix
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(date) {
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// -------------------------------------------------------------------
// Theme handling (re‑use same logic as portfolio for consistency)
function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    updateThemeToggleUI(theme);
}

function updateThemeToggleUI(theme) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    const icon = themeToggle.querySelector('.icon');
    const text = themeToggle.querySelector('.text');
    if (icon) icon.textContent = isDark ? '☀' : '☾';
    if (text) text.textContent = isDark ? 'Light mode' : 'Dark mode';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme !== 'dark';
    const newTheme = isDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeToggleUI(newTheme);
});

// -------------------------------------------------------------------
// Rendering
function renderTasks() {
    // Filter and search
    const filtered = tasks.filter(t => {
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'active' && !t.completed) ||
            (currentFilter === 'completed' && t.completed);
        const matchesSearch =
            t.title.toLowerCase().includes(searchTerm) ||
            (t.description && t.description.toLowerCase().includes(searchTerm));
        return matchesFilter && matchesSearch;
    });

    // Clear list
    taskListEl.innerHTML = '';
    if (filtered.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');
        filtered.forEach(task => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.dataset.id = task.id;

            const header = document.createElement('div');
            header.className = 'task-header';

            const title = document.createElement('span');
            title.className = 'task-title' + (task.completed ? ' completed' : '');
            title.textContent = task.title;
            header.appendChild(title);

            const actions = document.createElement('div');
            actions.className = 'task-actions';
            // Completion toggle
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'toggle';
            toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
            actions.appendChild(toggleBtn);
            // Edit
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'edit';
            editBtn.textContent = 'Edit';
            actions.appendChild(editBtn);
            // Delete
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'delete';
            delBtn.textContent = 'Delete';
            actions.appendChild(delBtn);

            header.appendChild(actions);
            card.appendChild(header);

            if (task.description) {
                const desc = document.createElement('p');
                desc.className = 'task-desc';
                desc.textContent = task.description;
                card.appendChild(desc);
            }
            taskListEl.appendChild(card);
        });
    }
    updateStats();
    updateFilterCounts();
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = total - active;
    totalCountEl.textContent = `Total: ${total}`;
    activeCountEl.textContent = `Active: ${active}`;
    completedCountEl.textContent = `Completed: ${completed}`;
}

function updateFilterCounts() {
    filterAllCount.textContent = tasks.length;
    filterActiveCount.textContent = tasks.filter(t => !t.completed).length;
    filterCompletedCount.textContent = tasks.filter(t => t.completed).length;
}

// -------------------------------------------------------------------
// CRUD Operations
function addTask(title, description) {
    const newTask = {
        id: generateId(),
        title: title.trim(),
        description: description.trim() || '',
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(id, newTitle, newDesc) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = newTitle.trim();
        task.description = newDesc.trim();
        saveTasks();
        renderTasks();
    }
}

function clearCompleted() {
    if (!confirm('Delete all completed tasks?')) return;
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

// -------------------------------------------------------------------
// Event Listeners
// Form submission (Enter key works automatically because we use <form>)
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleInput.value;
    const desc = descInput.value;
    if (!title.trim()) {
        alert('Task title cannot be empty');
        return;
    }
    addTask(title, desc);
    titleInput.value = '';
    descInput.value = '';
});

// Filter buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Search input (live)
searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks();
});

// Clear completed button
clearCompletedBtn.addEventListener('click', clearCompleted);

// Event delegation for task actions
taskListEl.addEventListener('click', e => {
    const card = e.target.closest('.task-card');
    if (!card) return;
    const taskId = card.dataset.id;
    if (e.target.matches('.delete')) {
        if (confirm('Delete this task?')) deleteTask(taskId);
    } else if (e.target.matches('.toggle')) {
        toggleTask(taskId);
    } else if (e.target.matches('.edit')) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        const newTitle = prompt('Edit title', task.title);
        if (newTitle === null) return; // cancelled
        if (!newTitle.trim()) {
            alert('Title cannot be empty');
            return;
        }
        const newDesc = prompt('Edit description (optional)', task.description);
        editTask(taskId, newTitle, newDesc ?? '');
    }
});

// -------------------------------------------------------------------
// Initialization
function initApp() {
    // Load tasks
    tasks = loadTasks();
    // Render UI
    renderTasks();
    // Populate date / greeting
    const now = new Date();
    currentDateEl.textContent = formatDate(now);
    todayDateEl.textContent = formatDate(now);
    const hour = now.getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    greetingEl.textContent = `${greet}, ${'Hemalatha'}!`;
    // Theme
    initTheme();
}

initApp();
