<template>
    <div class="form-task">
        <h3 class="form-title">Создание задачи</h3>

        <form
            action=""
            type="post"
            @submit="addTask"
            style="display: flex; flex-direction: column; gap: 20px"
        >
            <div>
                <input
                    class="form-input"
                    type="text"
                    placeholder="Название задачи"
                    v-model="taskName"
                />
                <span
                    class="invalid-span"
                    v-if="v$.taskName.$invalid && v$.taskInfo.$dirty"
                >
                    Заполните поле
                </span>
            </div>

            <div>
                <input
                    class="form-input"
                    type="text"
                    placeholder="Описание задачи"
                    v-model="taskInfo"
                />
                <span
                    class="invalid-span"
                    v-if="v$.taskInfo.$invalid && v$.taskInfo.$dirty"
                    >Заполните поле</span
                >
            </div>

            <div>
                <h4 class="form-text">
                    Тип задачи
                    <span
                        class="invalid-span"
                        v-if="v$.taskType.$invalid && v$.taskType.$dirty"
                        >Обязателен к заполнению</span
                    >
                </h4>

                <div class="form-button-container">
                    <input
                        type="radio"
                        id="type-task-1"
                        name="radio-group"
                        v-model="taskType"
                        value="Personal"
                    />
                    <label for="type-task-1" class="form-button">Личное</label>

                    <input
                        type="radio"
                        id="type-task-2"
                        name="radio-group"
                        v-model="taskType"
                        value="Working"
                    />
                    <label for="type-task-2" class="form-button">Рабочее</label>

                    <div class="form-button_add" @click="addListType()">
                        <img src="./../../assets/images/home/plus.svg" alt="" />
                    </div>
                </div>
            </div>

            <div>
                <input
                    ref="taskDate"
                    class="form-input"
                    type="text"
                    placeholder="Дата выполнения"
                    v-model="taskStartDate"
                    :min="this.formattedDate"
                    onfocus="(this.type='date')" onblur="(this.type='text')"
                />

                <span
                    class="invalid-span"
                    v-if="v$.taskStartDate.$invalid && v$.taskStartDate.$dirty"
                    >Введите дату</span
                >
            </div>
            <div class="form-input_time-container">
                <div>
                    <input
                        id="start-time"
                        ref="taskStartTime"
                        class="form-input-time"
                        type="text"
                        placeholder="Время начала"
                        v-model="taskStartTime"
                        onfocus="(this.type='time')" onblur="(this.type='text')"
                    />
                    <span
                        class="invalid-span"
                        v-if="
                            v$.taskStartTime.$invalid && v$.taskStartDate.$dirty
                        "
                        >Введите время</span
                    >
                </div>

                <div>
                    <input
                        id="end-time"
                        ref="taskEndTime"
                        class="form-input-time"
                        type="text"
                        placeholder="Время окончания"
                        v-model="taskEndTime"
                        onfocus="(this.type='time')" onblur="(this.type='text')"
                    />
                    <span
                        class="invalid-span"
                        v-if="
                            v$.taskStartTime.$invalid && v$.taskStartDate.$dirty
                        "
                        >Введите время</span
                    >
                </div>
            </div>
            <button
                class="form-submit"
                type="submit"
                :class="{ 'form-submit_filled': !this.v$.$invalid }"
            >
                Создать
            </button>
            <button class="form-submit_exit" @click="UPDATE_IS_ADDED_TASK()">
                Отмена
            </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { mapActions, mapMutations, mapGetters } from "vuex";

// валидация даты в инпуте
const isValidDate = (input) => {
    const regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!regex.test(input)) return false;

    const parts = input.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > new Date(year, month, 0).getDate()) return false;

    return true;
};
// const minValue = (value) => {
//     if(value.length > 8){
//         return true
//     }
//     else {
//         return 'Минимальная длина 8 символов епт'
//     }
// }
export default {
    setup() {
        return {
            v$: useVuelidate(),
        };
    },
    mounted() {
        // this.formattedDate = this.USER_REGISTRATIONS.split('-').reverse().join('-') + 'T00:00'
        this.formattedDate = `${this.USER_REGISTRATIONS.split("-")[2]}-${
            this.USER_REGISTRATIONS.split("-")[1]
        }-${this.USER_REGISTRATIONS.split("-")[0]}`;
        // console.log(this.formattedDate)
        // console.log(this.USER_REGISTRATIONS)
    },

    data() {
        return {
            taskName: "",
            taskInfo: "",
            taskType: "",
            taskStartDate: "",
            taskStartTime: "",
            taskEndTime: "",

            formattedDate: "",
        };
    },
    validations: {
        taskName: { required },
        taskInfo: { required },
        taskType: { required },
        taskStartDate: { required, isValidDate },
        taskStartTime: { required },
        taskEndTime: { required },
    },
    methods: {
        // добавить еще листы для выбора категории задачи
        addListType() {},

        ...mapActions([
            "ADD_TASK",
            "GET_THIS_DAY_TASKS",
            "GET_THIS_WEEK_TASKS",
            "GET_TASKLIST",
        ]),
        ...mapMutations(["UPDATE_IS_ADDED_TASK"]),

        async addTask(event) {
            event.preventDefault();
            const taskDateInput = this.$refs.taskDate;
            const taskTimeSInput = this.$refs.taskStartTime;
            const taskTimeEInput = this.$refs.taskEndTime;

            this.taskStartDate = taskDateInput.value;
            this.taskStartTime = taskTimeSInput.value;
            this.taskEndTime = taskTimeEInput.value;

            const isFormCorrect = await this.v$.$validate();
            if (!isFormCorrect) return;

            axios({
                method: "POST",
                url: "http://localhost:5000/task/createTask",
                headers: {
                    authorization: `Bearer ${localStorage.getItem(
                        "AccessToken"
                    )}`,
                },
                data: {
                    name: this.taskName,
                    type: this.taskType,
                    text: this.taskInfo,
                    status: "Done",
                    startTime: `${this.taskStartDate}T${this.taskStartTime}:00Z`,
                    endTime: `${this.taskStartDate}T${this.taskEndTime}:00Z`,
                },
            })
                .then(() => {
                    this.UPDATE_IS_ADDED_TASK();
                    this.GET_THIS_DAY_TASKS(this.PRESENT_DAY);
                    this.GET_THIS_WEEK_TASKS(this.CURRENT_WEEK);
                    this.GET_TASKLIST();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        validateTask() {
            // const startTime = new Date(this.taskStartTime)
            // const endTime = new Date(this.taskEndTime)
            // this.errors.push('Время окончания не может быть раньше времени начала')

            // if (endTime > startTime) {
            //     this.errors.push('Время окончания не может быть раньше времени начала')
            //     this.taskStartTime = ''
            //     this.taskEndTime = ''
            //     return false
            // }

            return true;
        },
    },
    computed: {
        ...mapGetters(["USER_REGISTRATIONS", "PRESENT_DAY", "CURRENT_WEEK"]),
        isFormValid() {
            // Проверка длины всех полей
            const isTaskNameValid = this.taskName.length > 6;
            const isTaskInfoValid = this.taskInfo.length > 8;
            const isTaskTypeValid = this.taskType.length > 0;
            let isTaskStartDateValid = true;
            if (this.taskStartDate.length > 0) {
                isTaskStartDateValid = isValidDate(this.taskStartDate);
            }

            // Если все поля имеют длину больше 0, форма считается валидной
            return (
                isTaskNameValid &&
                isTaskInfoValid &&
                isTaskTypeValid &&
                isTaskStartDateValid
            );
        },
    },
};
</script>

<style scoped>
</style>