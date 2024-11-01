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

// Function to add a new task
function addTask(taskName) {
    const tasks = loadTasks();
    tasks.push({ task: taskName, status: "To Do" });
    saveTasks(tasks);
    console.log(`Task "${taskName}" added!`);
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

    filteredTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.task} - ${task.status}`);
    });
}

// Function to update task status
function updateTask(taskNumber, newStatus) {
    const tasks = loadTasks();
    if (taskNumber > 0 && taskNumber <= tasks.length) {
        tasks[taskNumber - 1].status = newStatus;
        saveTasks(tasks);
        console.log(`Task ${taskNumber} updated to "${newStatus}"`);
    } else {
        console.log("Invalid task number.");
    }
}

// Function to delete a task
function deleteTask(taskNumber) {
    const tasks = loadTasks();
    if (taskNumber > 0 && taskNumber <= tasks.length) {
        const removedTask = tasks.splice(taskNumber - 1, 1);
        saveTasks(tasks);
        console.log(`Task "${removedTask[0].task}" removed!`);
    } else {
        console.log("Invalid task number.");
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
