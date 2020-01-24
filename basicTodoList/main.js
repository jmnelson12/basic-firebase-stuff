// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "<api-key>",
    authDomain: "basic-todolist-df505.firebaseapp.com",
    databaseURL: "https://basic-todolist-df505.firebaseio.com",
    projectId: "basic-todolist-df505",
    storageBucket: "basic-todolist-df505.appspot.com",
    messagingSenderId: "<sender-id>",
    appId: "<app-id>"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let [todoCount, updateTodoCount] = [0, newCount => todoCount = newCount];

const Database = (function () {
    const todoRef = firebase.database().ref('todoList');

    function addTodo(todoData) {
        const newTodo = todoRef.push();
        newTodo.set(todoData);
    }
    function removeAllTodos() {
        todoRef.remove(() => clearTodoList);
    }
    function updateTodo(todoId, todoData) {
        const query = todoRef.orderByChild("id").equalTo(todoId);

        query.once("child_added", snapshot => snapshot.ref.update(todoData));
    }
    function startListener(callback) {
        todoRef.on('value', snapshot => {
            callback(snapshot);
        });
    }

    return {
        ref: todoRef,
        addTodo,
        removeAllTodos,
        updateTodo,
        startListener
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todoForm');
    const btnClear = document.getElementById('btnClear');

    form.addEventListener('submit', formSubmit);
    btnClear.addEventListener('click', Database.removeAllTodos);

    Database.startListener(snapshot => {
        const todos = snapshot.val();
        clearTodoList();

        if (todos) {
            updateTodoCount(Object.keys(todos).length)
            for (let [key, { ...fields }] of Object.entries(todos)) {
                pushTodoItemToList({ ...fields });
            }
        }
    });
});

function formSubmit(e) {
    e.preventDefault();
    const { value } = document.getElementById('txtTodo');

    if (value.length > 0) {
        const newTodo = { id: todoCount, value, done: false };

        // frontend form validation ...
        // would add more to server/api if we ran one

        Database.addTodo(newTodo);
    }

}

function pushTodoItemToList(todoData) {
    const todoItemsEl = document.getElementById('todoItems');
    const wrapperEl = document.createElement('div');


    wrapperEl.className = "item " + (todoData.done ? "done" : "");
    wrapperEl.innerHTML = `
        <span onClick="editTodo({ todoId: ${todoData.id}, prevVal: '${todoData.value}'})">edit</span>
        <p>${todoData.value}</p>
        <span onClick="setTodoDone(${todoData.id})">&times;</span>
    `;

    todoItemsEl.appendChild(wrapperEl);
}

function clearTodoList() {
    const todoItemsEl = document.getElementById('todoItems');
    todoItemsEl.innerHTML = "";
}

function setTodoDone(todoId) {
    Database.updateTodo(todoId, { done: true });
}

function editTodo({ todoId, prevVal = "" }) {
    const newValue = prompt("New Todo Value", prevVal);

    if (newValue.length > 0) {
        Database.updateTodo(todoId, { value: newValue });
    }
}