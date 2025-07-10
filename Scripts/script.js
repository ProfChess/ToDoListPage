const ScreenWidth = window.innerWidth;
document.getElementById("taskTextField").maxLength = GetMaxCharacterLimit();

//BUTTONS
//Add Button
document.getElementById("addButton").addEventListener("click", () => AddButtonFunc());
document.getElementById("clearButton").addEventListener("click", () => ClearAllTasks());
document.getElementById("pageUpButton").addEventListener("click", () => PageUp());
document.getElementById("pageDownButton").addEventListener("click", () => PageDown());


function AddButtonFunc() {
    let enteredText = document.getElementById("taskTextField"); //Get Text
    let trimmedText = enteredText.value.trim(); //Trim text value for check
    if (trimmedText == "") { //skip function if user entered nothing
        return;
    }
    //Create Task
    const task = CreateTask();
    task.id = Date.now();

    //Create CheckBox and Delete Button
    //Checkbox
    const checkbox = CreateCheckbox(task.id);

    //Delete Button
    const deleteButton = CreateDeleteButton(task.id);

    //Create Text
    const taskText = document.createElement('span');
    taskText.textContent = enteredText.value;
    taskText.classList.add('TaskText');

    //Add Items to Main
    task.appendChild(deleteButton);
    task.appendChild(checkbox);
    task.appendChild(taskText);

    //Add to Main List
    document.getElementById("taskList").appendChild(task);

    //Save Task To Browser
    CreateObject(task.id, taskText.textContent, false);

    //Empty Input Field
    enteredText.value = '';
}
function RecreateTask(id, text, IsCompleted) {
    const task = CreateTask();
    task.id = id;

    //Create CheckBox and Delete Button
    //Checkbox
    const checkbox = CreateCheckbox(task.id);
    checkbox.checked = IsCompleted;

    //Delete Button
    const deleteButton = CreateDeleteButton(task.id);

    //Create Text
    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.classList.add('TaskText');

    //Add Items to Main
    task.appendChild(deleteButton);
    task.appendChild(checkbox);
    task.appendChild(taskText);

    if (IsCompleted) {
        checkbox.checked = true;
        taskText.classList.add('Checked');
    }

    //Add to Main List
    document.getElementById("taskList").appendChild(task);
}

function CreateTask() {
    let task = document.createElement('li');
    task.classList.add('TaskIndented');
    task.classList.add('TaskDefault');
    return task;
}
function CreateCheckbox(id) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener("change", () => checkTask(id));
    checkbox.classList.add('TaskCheckbox');
    return checkbox;
}
function CreateDeleteButton(id) {
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener("click", () => deleteTask(id));
    deleteButton.classList.add('TaskDeleteButton');
    return deleteButton;
}

//Deleting and Checking
function deleteTask(id) {
    const taskToDelete = document.getElementById(id);
    const index = FindTaskByID(id);
    if (index !== -1) { TodoListTaskList.splice(index, 1); }
    taskToDelete.remove();
    StoreTasks()
}
function checkTask(id) {
    const task = document.getElementById(id);
    const taskText = task.querySelector('span');
    taskText.classList.toggle('Checked');
    TodoListTaskList[FindTaskByID(id)].completed = taskText.classList.contains('Checked');
    StoreTasks()
}


//Clear Button
function ClearAllTasks() {
    if (confirm("Are you sure you want to clear all tasks?")) {
        TodoListTaskList = [];
        StoreTasks();
        LoadTasks();
    }
}
//PAGE BUTTONS
//New Page
function CreateNewPage() {

}
//Page up and Down
let currentPage = 1;
const maxPages = 5;
function PageUp() {
    if (currentPage < maxPages) {
        currentPage++
        LoadTasks();
        UpdatePageDisplayNum();
    }
}
function PageDown() {
    if (currentPage > 1) {
        currentPage--
        LoadTasks();
        UpdatePageDisplayNum();
    }
}
function UpdatePageDisplayNum() {
    const element = document.getElementById("pageNumDisplay");
    element.textContent = "PAGE: " + currentPage;
}

//SCREEN SCALING
//width
function GetMaxCharacterLimit() {
    if (ScreenWidth <= 600) { return 30; }
    else if (ScreenWidth <= 1024) { return 55; }
    else { return 75; }
}


//Saving and Loading
let TodoListTaskList = [];

function FindTaskByID(id) {
    for (var i = 0; i < TodoListTaskList.length; i++) {
        if (TodoListTaskList[i].ID == id) {
            return i;
        }
    }
    return -1;
}
function CreateObject(id, text, IsCompleted) {
    const NewTask = { ID: id, task: text, completed: IsCompleted };
    AddToList(NewTask);
}
function AddToList(GivenTask) {
    TodoListTaskList.push(GivenTask);
    StoreTasks()
}

function StoreTasks() {
    localStorage.setItem('tasks_page' + currentPage, JSON.stringify(TodoListTaskList));
}
function LoadTasks() {
    document.getElementById("taskList").innerHTML = "";
    TodoListTaskList = [];
    let saved = localStorage.getItem('tasks_page' + currentPage);
    if (saved) {
        TodoListTaskList = JSON.parse(saved);
        for (var i = 0; i < TodoListTaskList.length; i++) {
            RecreateTask(
                TodoListTaskList[i].ID,
                TodoListTaskList[i].task,
                TodoListTaskList[i].completed);
        }
    }

}

LoadTasks();
