<template>
    <div class="navigation">
        <div class="select-month">
            <div class="select-month_header">
                <div class="select-month_current">{{ FIRST_DAY }}</div>
                <img
                @click="showSelect = !showSelect"
                :class="showSelect ? 'select-month_btn' : 'select-month_btn-isActive'"
                
                src="../../../assets/images/home/select__btn.svg"
                alt=""
                />
            </div>

            <div
            :class="showSelect ? 'select-month_body-show' : 'select-month_body'"
            
            >
                <div
                @click="changeCurrentMonth(month)"
                class="select-month_body-item"
                v-for="month in CURRENT_MONTHS"
                :key="month"
                >
                {{ month[0] }} {{ month[1] }}
                </div>
            </div>
        </div>
        <div class="arrows">
        <img
            @click="prevWeek(this.USER_REGISTRATIONS)"
            src="../../../assets/images/home/left-arrow.svg"
            alt=""
            :class="isArrowShow ? '' : 'arrows-item-hidden'"
        />
        <img
            @click="nextWeek()"
            src="../../../assets/images/home/right-arrow.svg"
            alt=""
        />
        <img
            @click="goToCurrentWeek"
            src="../../../assets/images/home/home.svg"
            alt=""
        />
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions, mapMutations } from "vuex";
moment.locale("ru");

export default {

  data() {
    return {
      currentWeek: moment().clone().startOf("week"),

      showSelect: false, // меняет состоянике стрелки в списке месяцев
    //   isFirstLoadSelect: false,
      isArrowShow: true, // убирает стрелку при достижении недели регистрации
      isFirstWeekReg: false, // тоже для первой регистрации

    };
  },
  computed: {
    ...mapGetters([
      "CURRENT_MONTHS",
      "USER_REGISTRATIONS",
      "CURRENT_WEEK",
      "FIRST_DAY",
    ]),
  },
  mounted() {
    this.CHANGE_WEEK(moment());
    this.GET_PRESENT_DAY();
    this.GET_MONTHS(this.USER_REGISTRATIONS);
  },

  methods: {
    ...mapActions([
      "GET_MONTHS",
      "GET_PRESENT_DAY",
      "CHANGE_WEEK",
      'GET_THIS_WEEK_TASKS', 
    ]),
    ...mapMutations([
      "UPDATE_WEEK",
      "UPDATE_FIRST_DAY_WEEK",
      "UPDATE_SHOW_LOADER"
    ]),
    // переключает неделю на предыдущую (стрелка)
    async prevWeek(startDate) {
        this.startLoading();
        const previousWeek = this.currentWeek
        ? this.currentWeek.clone().subtract(1, "week")
        : moment().startOf("isoWeek").subtract(1, "week");

        const startDateNormalized = moment(startDate, "DD-MM-YYYY").startOf(
        "month"
        );

        if (previousWeek.isBefore(startDateNormalized)) {
        if (!this.isFirstWeekReg) {
            this.currentWeek = previousWeek;
            this.isArrowShow = false;
        }
        this.isFirstWeekReg = true;
        } else {
        this.currentWeek.subtract(1, "week");
        }

        this.UPDATE_WEEK(this.fillDays(this.currentWeek));
        this.GET_THIS_WEEK_TASKS(this.CURRENT_WEEK);
        this.UPDATE_FIRST_DAY_WEEK(
        `${this.capitalizeFirstLetter(this.CURRENT_WEEK[0][2])}  ${
            this.CURRENT_WEEK[0][3]
        }`
        );

        await this.loading();
    },

    // переключает неделю на следующую (стрелка)
    async nextWeek() {
        this.startLoading();
        this.isFirstWeekReg = false;
        this.isArrowShow = true;
        if (!this.currentWeek) {
            // Если текущая неделя не определена, создаем ее и устанавливаем в текущую неделю
            this.currentWeek = moment().add(1, "week").startOf("isoWeek");
        } else {
            // Иначе переключаемся на следующую неделю
            this.currentWeek.add(1, "week");
        }

        this.UPDATE_WEEK(this.fillDays(this.currentWeek));
        this.GET_THIS_WEEK_TASKS(this.CURRENT_WEEK);
        this.UPDATE_FIRST_DAY_WEEK(
            `${this.capitalizeFirstLetter(this.CURRENT_WEEK[0][2])}  ${
            this.CURRENT_WEEK[0][3]
            }`
        );

        await this.loading();
    },

    // заполнение днями недели текущей
    fillDays(startDate) {
        const daysArray = [];
        for (let i = 0; i <= 6; i++) {
            const day = moment(startDate)
            .add(i, "days")
            .format("ddd-DD-MMMM-YYYY-MM");
            daysArray.push(day.split("-"));
        }
        return daysArray;
    },
    // делает заглавным первые буквы месяцев в списке (мб костыль)
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    // изменяет выбранный месяц в списке (визуально)
    async changeCurrentMonth(value) {
        this.startLoading();
        this.UPDATE_FIRST_DAY_WEEK(`${value[0]} ${value[1]}`);
        const newDate = moment(`${value[0]}-${value[1]}`, "MMMM-YYYY").startOf(
            "month"
        );
        this.CHANGE_WEEK(newDate);
        this.showSelect = false;
        this.currentWeek = newDate;

        this.GET_THIS_WEEK_TASKS(this.CURRENT_WEEK);
        await this.loading();
        // this.scrollToCurrentHour();
    },
    // возвращается к текущей неделе
    async goToCurrentWeek() {
        this.startLoading();
        this.CHANGE_WEEK(moment());
        this.currentWeek = moment().clone().startOf("week");
        this.GET_THIS_WEEK_TASKS(this.CURRENT_WEEK);
        await this.loading();

    },

        

    





    // старт загрузки
    startLoading() {
        this.UPDATE_SHOW_LOADER()
    },
    // процесс загрузки
    async loading() {
        return new Promise((resolve) => {
            // Здесь выполняются асинхронные действия, например, задержка в 1 секунду
            setTimeout(() => {
                this.startLoading()
            resolve(); // Разрешить промис после выполнения
            }, 1000);
        });
    },
}
};
</script>


<style scoped>
.navigation {
    margin-top: 24px;
    margin-left: 70px;
    max-width: 400px;
    display: flex;
    gap: 10px;
    font-family: Raleway;

}

.select-month{
    
}
.select-month_header{
    display: flex;
    /* align-items: center; */
}

.select-month_current{
    font-size: 28px;
    font-weight: 700;
}

.select-month_btn {
    margin-left: 5px;
    transition: 1s;
    transform: rotate(180deg);
}

.select-month_btn-isActive {
    transition: 1s;
    margin-left: 5px;
}

.select-month_body-show {
    background-color: white;
    position: fixed;
    display: flex;
    gap: 10px;
    flex-direction: column;
    border-radius: 10px;
    z-index: 1;
    max-height: 200px;
    overflow-y: auto;
    opacity: 0;
    animation: show 2s forwards;

}
    @keyframes show {
        0% {opacity: 0;}
        100% {opacity: 1;}
    }

.select-month_body {

    z-index: 1;
    position: fixed;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    opacity: 0;
    animation: ANTIshow 2s forwards;
    background-color: white;    
    gap: 10px;   

    display: none;
}
    /* @keyframes ANTIshow {
            0% {opacity: 1;}
            100% {opacity: 0; display: none;}
        } */

.select-month_body-item {
    font-size: 26px;
    font-weight: 500;
    cursor: pointer;
    display: inline-block; 

}

.select-month_body-item:after {
    display: block; /*превращаем его в блочный элемент*/
    content: ""; /*контента в данном блоке не будет поэтому в кавычках ничего не ставим*/
    height: 3px; /*задаём высоту линии*/
    width: 0%; /*задаём начальную ширину элемента (линии)*/
    background-color: #225384; /*цвет фона элемента*/
    transition: width 0.4s ease-in-out; /*данное свойство отвечает за плавное изменение ширины. Здесь можно задать время анимации в секундах (в данном случае задано 0.4 секунды)*/
}

.select-month_body-item:hover {
    color:#225384;
}

.select-month_body-item:hover::after, .select-month_body-item:focus::after  {
    width: 100%;
}


.arrows{
    /* background-color: #225384; */
    display: flex;
    cursor: pointer;
    gap: 30px;
    margin-left: 10px;;
}

.arrows-item-hidden{
    visibility: hidden;
}
</style>