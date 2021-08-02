import { state } from "../../state";

// Home function
export function initHomePage(containerEl: Element) {
    // Function that render all the tasks
    function renderTasks(itemContainer: Element, taskList: Array<any>) {
        // First of all, clear the container content
        itemContainer.innerHTML = "";

        // Then, sort the tasks by their completed attribute
        const sortedTasks = taskList.sort((t) => t.completed);

        // Then, add tasks to the container
        sortedTasks.forEach((t) => {
            // Create the todo-item element
            const todoItemEl = document.createElement("todo-item");

            // Add attributes to the item
            todoItemEl.setAttribute("item-text", t.text);
            todoItemEl.setAttribute("checked", t.completed);
            todoItemEl.setAttribute("todo-id", t.id);

            // Listen the checkbox changes
            todoItemEl.addEventListener("change", (e: any) => {
                state.changeItemStatus(e.detail.id, e.detail.value);
            });

            // Listen the delete event
            todoItemEl.addEventListener("delete", (e: any) => {
                state.deleteTask(e.detail.id);
            });

            // Append the item to the container
            itemContainer.appendChild(todoItemEl);
        });
    }

    // Give the container some content
    containerEl.innerHTML = `
        <h1 class="title">Mis pendientes</h1>
        <form class="page-form">
        <div class="page-form__labeled-input">
        <label for="pendinput" class="page-form__label"
        >Nuevo pendiente</label
        >
        <input
        type="text"
        autocomplete="off"
        class="page-form__input"
        id="pendinput"
        name="pendinput"
        />
        </div>
        <button class="page-form__button">Agregar</button>
        </form>
        
        <div class="todo-container"></div>`;

    // Get the active tasks from the state
    const currentStateTasks = state.getActiveTasks();

    // Get the items container
    const itemContainer = containerEl.querySelector(".todo-container");

    // Render all the tasks/items
    renderTasks(itemContainer, currentStateTasks);

    // Add an event listener for the form
    containerEl.querySelector(".page-form").addEventListener("submit", (e) => {
        // Prevent default behavior
        e.preventDefault();

        // Get the input field text
        const inputEl: any = containerEl.querySelector(".page-form__input");
        const inputText = inputEl.value.trim();

        // If there's an empty string, do nothing
        if (inputText == "") {
            return;
        }

        // Add the new task
        state.addTask(inputText);

        // Clear the input field
        inputEl.value = "";
    });

    // Subscribe to the changes made to the state
    state.subscribe(() => {
        // Every time the state is changed, it will be necessary to get and render the latest items/tasks
        renderTasks(itemContainer, state.getActiveTasks());
    });
}
