const trashImage = require("url:../../assets/delete.svg");

// Todo item initializer
export function initTodoItem() {
    // Create the class
    class TodoItem extends HTMLElement {
        // Initial properties
        shadow: ShadowRoot;
        itemText: string;
        checked: boolean;
        todoId: string;

        // Constructor
        constructor() {
            // Inherit all properties
            super();

            // Create the Shadow DOM
            this.shadow = this.attachShadow({ mode: "open" });
        }

        // Method that connects the Component to the DOM
        connectedCallback() {
            // Get the item text, the checked and the id attriibute
            this.itemText = this.getAttribute("item-text");
            this.checked = JSON.parse(this.getAttribute("checked"));
            this.todoId = this.getAttribute("todo-id");

            // Give some styles to the component
            const styles = document.createElement("style");
            styles.innerHTML = `
    
            * {
            box-sizing: border-box;
            }
    
            .todo-item {
                display: grid;
                grid-template: 1fr / minmax(0, 1fr) 25px;
                column-gap: 7.5px;
                
                min-height: 100px;
                padding: 15px;
                
                background-color: #fff599;
                border-radius: 4px;
                box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.5);
            }

            .todo-item-active {
                border: 1px solid black;
            }
    
            .todo-item__text {
                margin: 0;
            
                font-size: 18px;
                overflow-wrap: break-word;
            }
    
            .checked-text {
                text-decoration: line-through;
            }
            
            .todo-item__interactive {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
            
                padding: 2.5px 0;
            }
            
            .interactive-checkbox {
                margin: 0;
            }
            
            .interactive-delete {
                width: 80%;
                height: 20px;
            
                cursor: pointer;
            }  
            `;

            // Render the element
            this.render();

            // Append styles to the shadow
            this.shadow.appendChild(styles);
        }

        // Method used to add listeners to the todo-item
        addListeners() {
            // Aux variables
            const checkEl: HTMLElement = this.shadow.querySelector(
                ".interactive-checkbox"
            );
            const trashEl: HTMLElement = this.shadow.querySelector(
                ".interactive-delete"
            );
            const cardEl: HTMLElement = this.shadow.querySelector(".todo-item");

            // Checkbox events
            checkEl.addEventListener("click", (e) => {
                // First of all, prevent the event propagation, so the click event from the item is not triggered
                e.stopPropagation();

                // Get the event target
                const eventTarget: any = e.target;

                // Create a custom event, that sends data to the page
                const checkEvent = new CustomEvent("change", {
                    detail: {
                        id: this.todoId,
                        value: eventTarget.checked,
                    },
                });

                // Dispatch the event, from the WHOLE component ---> this, in order to listen it easily
                this.dispatchEvent(checkEvent);
            });

            // Todo-item click events
            this.addEventListener("click", () => {
                // Get the classlist from the card
                const cardClasses = cardEl.classList;

                // If the card is active, just deactivate it
                if (cardClasses.contains("todo-item-active")) {
                    cardClasses.remove("todo-item-active");
                    trashEl.style.display = "none";
                }

                // If the card wasn't clicked, activate it
                else {
                    cardClasses.add("todo-item-active");
                    trashEl.style.display = "initial";
                }
            });

            // Click on trash image event
            trashEl.addEventListener("click", (e) => {
                // First of all, prevent the event propagation, so the click event from the item is not triggered
                e.stopPropagation();

                // Custom event, that sends the id of the task item
                const deleteEvent = new CustomEvent("delete", {
                    detail: {
                        id: this.todoId,
                    },
                });

                // Dispatch the event
                this.dispatchEvent(deleteEvent);
            });
        }

        // Render method
        render() {
            // Give the element some content
            this.shadow.innerHTML = `
            <div class="todo-item">
                <p class="todo-item__text ${
                    this.checked ? "checked-text" : ""
                }">${this.itemText}</p>
                <div class="todo-item__interactive">
                    <input type="checkbox" ${
                        this.checked ? "checked" : ""
                    } class="interactive-checkbox" />
                    <img
                        src="${trashImage}"
                        style="display: none;"
                        class="interactive-delete"
                    />
                </div>
            </div>`;

            // Add listeners
            this.addListeners();
        }
    }

    // Define the todo-item
    customElements.define("todo-item", TodoItem);
}
