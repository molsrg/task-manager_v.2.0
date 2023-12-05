// import axios from 'axios'
import moment from 'moment'
moment.locale('ru')

export default {
    state() {
        return {
            hours: [],
            week: [],
            months: [], 

            presentDay: [],
            firstDayWeek: [], 
        }
        
    }, 
    getters: {
        CURRENT_HOURS: state => {
            return state.hours
        }, 
        CURRENT_WEEK: state => {
            return state.week
        }, 
        CURRENT_MONTHS: state => {
            return state.months
        }, 

        
        PRESENT_DAY: state => {
            return state.presentDay
        }, 
        FIRST_DAY: state => {
            return state.firstDayWeek
        }, 


    
    }, 
    mutations: {
        UPDATE_HOURS: (state, response) => {
            state.hours = response
        }, 
        UPDATE_MONTHS: (state, response) => {
            state.months = response
        }, 
        UPDATE_PRESENT_DAY: (state, response) => {
            state.presentDay = response
        }, 
        UPDATE_WEEK:(state, response) => {
            state.week = response
        }, 
        UPDATE_FIRST_DAY_WEEK: (state, response) => {
            state.firstDayWeek = response
        }
    }, 
    actions: {
        // загружаем часы
        GET_HOURS ({ commit }) {
            const hours = [];
            
            for (let i = -1; i < 24; i++) {
            let hour = i + 1;
            
            hours.push(`${hour}:00`);
            }
            commit('UPDATE_HOURS', hours);
        },
        
        // получаем месяцы пользователя 
        GET_MONTHS ({commit}, startDate, monthAfter = 3){
            const months = []
            const nowNormalized = moment().locale("ru").startOf("month"); // Первое число текущего месяца
            const startDateNormalized = moment(startDate, "DD-MM-YYYY").startOf("month");
            while (startDateNormalized.isBefore(nowNormalized)) {
                const formattedMonth = startDateNormalized.format("MMMM YYYY MM");
                const formattedMonthArray = formattedMonth.split(" ").map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                });
                months.push(formattedMonthArray);
                startDateNormalized.add(1, "M");
            }
            
        
            // Добавляем месяцы после текущего
            for (let i = 0; i < monthAfter; i++) {
                const monthslater = nowNormalized.clone().add(i, "M");
                const formattedMonth = monthslater.format("MMMM YYYY MM");
                const formattedMonthArray = formattedMonth.split(" ").map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                });
                months.push(formattedMonthArray);
            }
        
            commit('UPDATE_MONTHS', months);
        }, 

        // получаем текущий день
        GET_PRESENT_DAY ({commit}){
            const day = moment().format("DD-MMMM-YYYY-MM").split("-")
            commit('UPDATE_PRESENT_DAY', day)
        }, 

        // показывает текущую неделю на календаре (выбранную)
        CHANGE_WEEK({commit}, currentDate) {
            let days = [];
            const weekStart = currentDate.clone().startOf("week");

            for (let i = 0; i <= 6; i++) {
                const day = moment(weekStart).add(i, "days").format("ddd-DD-MMMM-YYYY-MM");
                days.push(day.split("-"));
            }
            commit('UPDATE_FIRST_DAY_WEEK', `${days[0][2].charAt(0).toUpperCase() + days[0][2].slice(1)} ${days[0][3]}`);
            commit('UPDATE_WEEK', days)
        },
    }

}


