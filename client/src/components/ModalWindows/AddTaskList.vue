<template>
    <div class="form-task">
        <h3 class="form-title">Создание списка задач</h3>

        <form
            action=""
            type="post"
            @submit="addTaskList"
            style="display: flex; flex-direction: column; row-gap: 20px"
        >
            <div>
                <input
                    class="form-input"
                    type="text"
                    placeholder="Название списка"
                    v-model="taskListTitle"
                />
                <span
                    class="invalid-span"
                    v-if="v$.taskListTitle.$invalid && v$.taskListTitle.$dirty"
                    >Заполните поле</span
                >
            </div>

            <div>
                <input
                    class="form-input"
                    type="text"
                    placeholder="Описание списка"
                    v-model="taskListInfo"
                />
                <span
                    class="invalid-span"
                    v-if="v$.taskListInfo.$invalid && v$.taskListInfo.$dirty"
                    >Заполните поле
                </span>
            </div>

            <div>
                <input
                    ref="taskDate"
                    class="form-input"
                    type="text"
                    placeholder="Дата выполнения"
                    v-model="taskListDate"
                    :min="this.formattedDate"
                    onfocus="(this.type='date')" onblur="(this.type='text')"
                />

                <!-- <span
                    class="invalid-span"
                    v-if="v$.taskListEndTime.$invalid && v$.taskListEndTime.$dirty"
                    >Введите дату</span
                > -->
            </div>

            <div class="form-color-select">
                <h4 class="form-title">Цвет</h4>
                <!-- <div class="form-color-button" @click="selectColor()"><ColorPicker v-model="color" /></div> -->
                <div class="form-button-color" v-if="!isSelectColor" @click="this.isSelectColor = !this.isSelectColor">Выберите цвет</div>
                <ColorPicker v-model="taskListColor"  v-else/>
            </div>

            <button
                class="form-submit"
                type="submit"
                :class="{ 'form-submit_filled': !this.v$.$invalid }"
            >
                Создать
            </button>
            <button
                class="form-submit_exit"
                @click="UPDATE_IS_ADDED_TASKLIST()"
            >
                Отмена
            </button>
        </form>
    </div>
</template>
<script>
// const dateValid = () => {

//     console.log(this.$refs.taskListDate)
//     if(this.$refs.taskListDate.value.length > 0){
//         return true
//     }
//     else {
//         dateValid.$message = 'Выберите дату';
//         return false;
//     }
// }

import axios from "axios";
import { mapActions, mapMutations, mapGetters } from "vuex";

import ColorPicker from "primevue/colorpicker";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
    setup() {
        return {
            v$: useVuelidate(),
        };
    },
    mounted() {
        this.formattedDate =
            this.USER_REGISTRATIONS.split("-").reverse().join("-") + "T00:00";
    },
    data() {
        return {
            taskListTitle: "",
            taskListInfo: "",
            taskListDate: "",

            taskListColor: "#15616D",

            // taskListStartTime: "",
            // taskListEndTime: "",

            formattedDate: "",

            isSelectColor: false,
        };
    },
    validations: {
        taskListTitle: { required },
        taskListInfo: { required },
        taskListDate: { required },
        // taskListColor: { required }
    },
    methods: {
        ...mapActions(["ADD_TASK", "GET_TASKLIST"]),
        ...mapMutations(["UPDATE_IS_ADDED_TASKLIST"]),
        splitDateRange(dateRange) {
            const [startDate, endDate] = dateRange.split(" - ");
            return { startDate, endDate };
        },

        // formatToISODate(dateString) {
        //     const date = new Date(dateString);
        //     if (!isNaN(date.getTime())) {
        //         const year = date.getFullYear();
        //         const month = String(date.getMonth() + 1).padStart(2, "0");
        //         const day = String(date.getDate()).padStart(2, "0");
        //         return `${year}-${month}-${day}T00:00:00Z`;
        //     } else {
        //         return null;
        //     }
        // },

        async addTaskList(event) {
            event.preventDefault();

            // const taskDateInput = this.$refs.taskListDate;
            // this.taskListDate = taskDateInput.value;

            const isFormCorrect = await this.v$.$validate();
            if (!isFormCorrect) return;

            // const { startDate, endDate } = this.splitDateRange(
            //     this.taskListDate
            // );

            axios({
                method: "POST",
                url: "http://localhost:5000/task/createTaskList",
                headers: {
                    authorization: `Bearer ${localStorage.getItem(
                        "AccessToken"
                    )}`,
                },
                data: {
                    title: this.taskListTitle,
                    toggleCircle: false,
                    isTasklistVisible: false,

                    startTime: `2023-11-29T00:00:00Z`,
                    endTime: `${this.taskListDate}T00:00:00Z`,
                    // startTime: this.formatToISODate(startDate),
                    // endTime: this.formatToISODate(endDate),
                    // taskListColor: this.taskListColor
                },
            })
                .then(() => {
                    this.UPDATE_IS_ADDED_TASKLIST();
                    this.GET_TASKLIST();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    computed: {
        ...mapGetters(["USER_REGISTRATIONS"]),
    },

    components: {
        ColorPicker,
    },
};
</script>