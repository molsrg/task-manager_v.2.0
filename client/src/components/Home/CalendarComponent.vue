<template>
    <div>
        <SelectArrow></SelectArrow>
        <div class="calendar">
            <CurrentWeek></CurrentWeek>
            <CalendarApp v-if="!SHOW_LOADER"></CalendarApp>
            <LoaderApp v-else></LoaderApp>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import SelectArrow from "./CALENDAR/SelectArrow.vue";
import CurrentWeek from "./CALENDAR/CurrentWeek.vue";
import CalendarApp from "./CALENDAR/CalendarApp.vue";
import LoaderApp from "./CALENDAR/LoaderApp.vue";
import { mapGetters, mapActions } from "vuex";

moment.locale("ru");

export default {
    components: {
        SelectArrow,
        CurrentWeek,
        CalendarApp,
        LoaderApp,
    },
    data() {
        return {
            // загрузка данных с сервера
            showLoader: false,
        };
    },
    computed: {
        ...mapGetters([
            "USER_REGISTRATIONS",
            "CURRENT_WEEK",
            "PRESENT_DAY",
            "SHOW_LOADER",
        ]),
    },
    mounted() {
        this.$nextTick(() => {
            this.scrollToCurrentHour();
        });

        this.CHANGE_WEEK(moment());
        this.GET_HOURS();
        this.GET_PRESENT_DAY();
        this.GET_MONTHS(this.USER_REGISTRATIONS);

        this.GET_THIS_WEEK_TASKS(this.CURRENT_WEEK);
        this.GET_THIS_DAY_TASKS(this.PRESENT_DAY);
        this.GET_TASKLIST(); // other
    },

    methods: {
        ...mapActions([
            "GET_HOURS",
            "GET_MONTHS",
            "GET_PRESENT_DAY",
            "CHANGE_WEEK",
            "GET_THIS_WEEK_TASKS",
            "GET_THIS_DAY_TASKS",
            "GET_TASKLIST",
        ]),

        isTaskOverflowed(task) {
            const taskElement = this.$refs[`${task.id}`];
            console.log(taskElement);
        },

        // автоматически скролит к нужному времени при открытии страницы
        scrollToCurrentHour() {
            //     const taskboardContainer = document.querySelector('.calendar__taskboard');
            //     if (taskboardContainer) {
            //       const currentHour = `${Number(moment().format('HH'))}:00`;
            //       const hourElements = taskboardContainer.querySelectorAll('.time__name');
            //       for (let i = 0; i < hourElements.length; i++) {
            //         if (hourElements[i].textContent === currentHour) {
            //           const containerRect = taskboardContainer.getBoundingClientRect();
            //           const hourRect = hourElements[i].getBoundingClientRect();
            //           const scrollTop = hourRect.top - containerRect.top;
            //           taskboardContainer.scrollTop = scrollTop;
            //           return; // Выходим из цикла, когда нашли нужный час
            //         }
            //   }
            //   console.error("Час не найден в .calendar__taskboard.");
            // } else {
            //   console.error("Элемент .calendar__taskboard не найден в DOM.");
            // }
        },
    },
};
</script>


<style>
.calendar {
    display: flex;
    flex-direction: column;
    place-items: center;

    margin-left: 70px;
    margin-top: 30px;
}
</style>