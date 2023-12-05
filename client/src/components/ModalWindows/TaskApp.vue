<template>
    <div class="form-task">
        <div class="form-title-container">
            <input
                class="form-title"
                type="text"
                placeholder="Название задачи"
                :disabled="!editedTask"
                v-model="taskTitle"
            />
            <button type="button" @click="this.editedTask = !this.editedTask">
                <img src="./../../assets/images/home/edited_task.svg" alt="" />
            </button>
        </div>

        <form
            action=""
            type="post"
            @submit="editTask"
            style="display: flex; flex-direction: column; row-gap: 20px"
        >
            <div>
                <input
                    class="form-input"
                    type="text"
                    placeholder="Описание задачи"
                    v-model="taskInfo"
                    :disabled="!editedTask"
                />
            </div>
            <h4 class="form-text">Тип задачи - {{ CHECKED_TASK.type }}</h4>

            <input
                class="form-input"
                type="text"
                :placeholder="'Дата выполнения ' + `- ${this.taskDate}`"
                :min="this.formattedDate"
                onfocus="(this.type='date')"
                onblur="(this.type='text')"
                :disabled="!editedTask"
            />

            <div class="form-input_time-container">
                <div>
                    <input
                        class="form-input-time"
                        type="text"
                        :placeholder="`Начало - ${this.taskStartTime[0]}:${this.taskStartTime[1]}`"
                        onfocus="(this.type='time')"
                        onblur="(this.type='text')"
                        :disabled="!editedTask"
                    />
                </div>

                <div>
                    <input
                        class="form-input-time"
                        type="text"
                        :placeholder="`Окончание - ${this.taskEndTime[0]}:${this.taskEndTime[1]}`"
                        onfocus="(this.type='time')"
                        onblur="(this.type='text')"
                        :disabled="!editedTask"
                    />
                </div>
            </div>

            <div class="task__button-container">
                <div class="task__buttons-edit">
                    <div
                        class="task_button"
                        style="border: 1px solid red; color: red"
                        @click="UPDATE_DELETE_TASK()"
                    >
                        Удалить
                    </div>

                    <div
                        @click="changeTask()"
                        class="task_button"
                        style="
                            background-color: #87979a;
                            color: #ffecd1;
                            border: 1px solid #87979a;
                        "
                    >
                        Сохранить
                    </div>
                </div>

                <div
                    class="task_button"
                    @click="closeTask()"
                    style="
                        background-color: #15616D;
                        color: #ffecd1;
                        border: 1px solid #15616D;
                    "
                >
                    Выполнена
                </div>
                <div class="task_button" @click="closeTask()">Отмена</div>
            </div>
        </form>
    </div>


    <div class="modal" v-if="IS_DELETE_TASK"><DeleteTask/></div>




</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import DeleteTask from './DeleteTask.vue';
export default {
    computed: {
        ...mapGetters(["CHECKED_TASK", "IS_DELETE_TASK"]),
    },
    data() {
        return {
            taskTitle: "",
            taskInfo: "",
            taskStartTime: "",
            taskEndTime: "",
            editedTask: false,

            taskDate: "",
        };
    },
    methods: {
        ...mapMutations(["UPDATE_CHECKED_TASK", "UPDATE_DELETE_TASK"]),
        closeTask() {
            this.UPDATE_CHECKED_TASK(undefined);
        },

        deleteTask() {},
        changeTask() {},
    },
    created() {
        const checkedTask = this.CHECKED_TASK;
        if (checkedTask) {
            this.taskTitle = checkedTask.name || "";
            this.taskInfo = checkedTask.text || "";

            this.taskDate = checkedTask.startTime.split("T")[0] || "";
            this.taskStartTime =
                checkedTask.startTime.split("T")[1].split(":") || "";
            this.taskEndTime =
                checkedTask.endTime.split("T")[1].split(":") || "";
        }

        // <li>ID - {{ CHECKED_TASK._id }}</li>
        // <li>NAME - {{ CHECKED_TASK.name }}</li>
        // <li>INFO - {{ CHECKED_TASK.text}}</li>
        // <li>TYPE - {{ CHECKED_TASK.type }}</li>
        // <li>START TIME - {{ CHECKED_TASK.startTime }}</li>
        // <li>END TIME - {{ CHECKED_TASK.endTime }}</li>
        // <li>OWNER ? - {{ CHECKED_TASK.owner }}</li>
    },
    components: {
        DeleteTask
    }
};
</script>

<style>
.form-title-container {
    display: flex;
    column-gap: 5px;
    justify-content: center;
}

.task__button-container {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

.task__buttons-edit {
    display: flex;
    justify-content: space-between;
    column-gap: 15px;
}

.task_button {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 16px 53px;
    border-radius: 10px;
    border: 1px solid #001524;

    cursor: pointer;
}
</style>