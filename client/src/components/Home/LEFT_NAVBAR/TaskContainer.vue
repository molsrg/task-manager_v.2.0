<template>
<div class="task-container">
    <h3 class="task-container_logo">Task Unity Tech</h3>

        <div
        v-for="(tasklist, index) in USER_TASKLISTS"
        :key="index"
        class="tasklist"
        >
            <div class="tasklist_title">
                <h4 class="tasklist_title-text">{{ tasklist.title }}</h4>
                <div
                    :class="
                    tasklist.toggleCircle ? 'circle-plus opened' : 'circle-plus closed'
                    "
                    @click="changeToggle(index)"
                >
                    <div class="circle" v-if="tasklist.tasks.length > 0">
                        <div class="horizontal"></div>
                        <div class="vertical"></div>
                    </div>
                </div>
            </div>
            <div
                class="tasklist_tasks"
                :class="{ 'tasklist_tasks-visible': tasklist.isTasklistVisible && tasklist.tasks.length > 0 }"
            >
            <label
                v-for="task in tasklist.tasks"
                :key="task.id"
                class="tasklist_label"
            >
                <input
                class="real-checkbox"
                :value="task"
                type="checkbox"
                @change="selectTasks()"
                v-model="checkedTasks"
                />
                <span class="custom-checkbox"></span>
                {{ task.name }}
            </label>
            </div>
        </div>

        <div class="tasklist-important-task">
                <h4>Домашка</h4>
                <img src="./../../../assets/images/home/tasklist-more.svg" alt="">
        </div>

        <button class="tasklist-option" @click="addedTask">
        Создать задачу
        </button>

        <button class="tasklist-option" @click="addedTasklist">
        Добавить лист
        </button>

        <button
        class="tasklist-option"
        @click="checkSelectedTask"
        >
        Показать отмеченные задачи
        </button>

    </div>

    
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    data() {
        return {
        checkedTasks: [],
        };
    },
    computed: {
        ...mapGetters(["USER_TASKLISTS", "CHECKED_TASK"]),
    },
    methods: {
        ...mapMutations([
        "UPDATE_VISIBLE_TASKLIST",
        "UPDATE_SELECT_TASKS",
        "UPDATE_IS_ADDED_TASK",
        "UPDATE_IS_ADDED_TASKLIST",
        "UPDATE_CHECK_SELECT_TASK",
        ]),
        ...mapActions(["GET_THIS_WEEK_TASKS", "GET_THIS_DAY_TASKS"]),

        changeToggle(index) {
        this.UPDATE_VISIBLE_TASKLIST(index);
        },
        selectTasks() {
        this.UPDATE_SELECT_TASKS(this.checkedTasks);
        },

        addedTask() {
        this.UPDATE_IS_ADDED_TASK();
        },

        addedTasklist() {
        this.UPDATE_IS_ADDED_TASKLIST();
        },

        checkSelectedTask() {
        this.UPDATE_CHECK_SELECT_TASK();
        },
    },
    
};
</script>

