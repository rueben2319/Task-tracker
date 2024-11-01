const fs = require('fs');
const tasksFile = 'tasks.json';

// Function to load tasks from the file
function loadTasks() {
    if (fs.existsSync(tasksFile)) {
        const data = fs.readFileSync(tasksFile, 'utf8');
        try {
            return JSON.parse(data);
        } catch (e) {
            console.log("Invalid JSON format. Initializing an empty tasks list.");
            return [];
        }
    }
    return [];
}

// Function to save tasks to the file
function saveTasks(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// Function to generate a unique ID for each task
function generateId(tasks) {
    return tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
}

// Function to add a new task
function addTask(description) {
    const tasks = loadTasks();
    const newTask = {
        id: generateId(tasks),
        description: description,
        status: "To Do",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task "${description}" added with ID ${newTask.id}!`);
}

// Function to view all tasks with optional filter
function viewTasks(filter = null) {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log("No tasks found!");
        return;
    }

    const filteredTasks = filter
        ? tasks.filter(task => task.status === filter)
        : tasks;

    filteredTasks.forEach(task => {
        console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
    });
}

// Function to update task status
function updateTask(taskId, newStatus) {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        tasks[taskIndex].updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} updated to "${newStatus}"`);
    } else {
        console.log("Task ID not found.");
    }
}

// Function to delete a task
function deleteTask(taskId) {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        const removedTask = tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        console.log(`Task "${removedTask[0].description}" with ID ${taskId} removed!`);
    } else {
        console.log("Task ID not found.");
    }
}

// Command-line interface for the task tracker
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

switch (command) {
    case 'add':
        addTask(arg1);
        break;
    case 'view':
        viewTasks();  // List all tasks
        break;
    case 'view-done':
        viewTasks("Done");  // List tasks marked as "Done"
        break;
    case 'view-not-done':
        viewTasks("To Do");  // List tasks that are "To Do"
        break;
    case 'view-in-progress':
        viewTasks("In Progress");  // List tasks marked as "In Progress"
        break;
    case 'update':
        updateTask(parseInt(arg1), arg2);  // Mark task as "To Do", "In Progress", or "Done"
        break;
    case 'delete':
        deleteTask(parseInt(arg1));
        break;
    default:
        console.log("Invalid command. Use 'add', 'view', 'view-done', 'view-not-done', 'view-in-progress', 'update', or 'delete'.");
}
