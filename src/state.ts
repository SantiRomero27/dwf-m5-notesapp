export const state = {
    data: {
        tasks: [],
    },

    listeners: [],

    // Initializer
    init() {
        // Get the local data
        const localData = JSON.parse(localStorage.getItem("saved-tasks"));

        // If localData returns "null", do nothing
        if (!localData) {
            return;
        } else {
            this.setState(localData);
        }
    },

    // Getter
    getState() {
        return this.data;
    },

    // Setter
    setState(newState) {
        this.data = newState;

        // Save the changes made to the state
        localStorage.setItem("saved-tasks", JSON.stringify(this.data));

        for (const cbFunction of this.listeners) {
            cbFunction();
        }
    },

    // Only active/existing tasks getter
    getActiveTasks() {
        const currentState = this.getState();

        return currentState.tasks.filter((t) => !t.deleted);
    },

    // Change completed property from an item method
    changeItemStatus(id: string, value: boolean) {
        // Get the current state
        const currentState = this.getState();

        // Find the task that needs to be changed
        const foundTask = currentState.tasks.find((t) => t.id == parseInt(id));

        // Change the task property
        foundTask.completed = value;

        this.setState(currentState);
    },

    // Delete task method
    deleteTask(taskId: string) {
        // Get the current state
        const currentState = this.getState();

        // Find the task that needs to be deleted
        const foundTask = currentState.tasks.find(
            (t) => t.id == parseInt(taskId)
        );

        // Change the task deleted property
        foundTask.deleted = true;

        this.setState(currentState);
    },

    // Add task method
    addTask(taskText: string) {
        // Get the current state
        const currentState = this.getState();

        // Aux variables
        const TASK_LIMIT = 200;
        const currentIds = currentState.tasks.map((t) => t.id);

        // Just a test
        if (currentIds.length == TASK_LIMIT) {
            alert(
                "You have reached the tasks limit!\nExecute localStorage.clear() (Only for devs ;))"
            );

            return;
        }

        // Generate the task id
        let taskId = Math.floor(Math.random() * TASK_LIMIT) + 1;

        // In case that the task id is repeated, generate other until it is not
        while (currentIds.includes(taskId)) {
            taskId = Math.floor(Math.random() * TASK_LIMIT) + 1;
        }

        // Create the new task
        const newTask = {
            id: taskId,
            text: taskText,
            completed: false,
            deleted: false,
        };

        // Push the new task to the current tasks collection
        currentState.tasks.push(newTask);

        this.setState(currentState);
    },

    // Subscribe method
    subscribe(cbFunction: (any: any) => any) {
        this.listeners.push(cbFunction);
    },
};
