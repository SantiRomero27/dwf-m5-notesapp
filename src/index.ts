import { initHomePage } from "./pages/home/home";
import { initTodoItem } from "./components/todo-item/todo-item";
import { state } from "./state";

// Main function
(function () {
    // First of all, initialize all data
    state.init();

    // Initialize component
    initTodoItem();

    // Initialize page
    initHomePage(document.querySelector("#root"));
})();
