import axios from 'axios'
export default {

    state() {
        return {
            registration: '23-07-2023',
            tasklist: [
                {
                    title: 'Текущий день',
                    toggleCircle: false,
                    isTasklistVisible: false,
                    tasks: [],
                }, 
                {
                    title: 'Неделя на календаре',
                    toggleCircle: false,
                    isTasklistVisible: false,
                    tasks: [],
                }, 
            ], 
            selectTask: []
        }
        
    }, 
    
    getters: {
        USER_REGISTRATIONS: state => {
            return state.registration
        },
        USER_TASKLISTS: state => {
            return state.tasklist
        }, 
        USER_SELECT_TASKS: state => {
            return state.selectTask
        }, 

        USER_TASKS_IN_CALENDAR: state => {
            return state.tasklist[1].tasks
        }
    }, 
    mutations: {
        UPDATE_VISIBLE_TASKLIST: (state, idx) => {
            state.tasklist[idx].toggleCircle = !state.tasklist[idx].toggleCircle
            state.tasklist[idx].isTasklistVisible = !state.tasklist[idx].isTasklistVisible
        }, 
        UPDATE_SELECT_TASKS: (state, response) => {
            state.selectTask = response
        }, 
        UPDATE_THIS_DAY_TASKS: (state, response) => {
            state.tasklist[0].tasks = response
        }, 
        UPDATE_THIS_WEEK_TASKS: (state, response) => {
            state.tasklist[1].tasks = response
        }, 
        UPDATE_TASKLIST: (state, data) => {
            const baseList = state.tasklist.slice(0,2)
            state.tasklist = [...baseList, ...data]
        }, 
        
    }, 
    actions: {
        GET_THIS_DAY_TASKS({commit}, day) {
            const presentDay = `${day[2]}-${day[3]}-${day[0]}`
            let nextDay_day =  day[0].split('0')
            const nextDay = `${day[2]}-${day[3]}-${Number(day[0]) >= 9 ? Number(day[0]) + 1 : `0${Number(nextDay_day[1]) + 1}`}`
            
            axios({
                method: 'GET', 
                url: 'http://localhost:5000/task/getTask',
                headers: {'authorization': `Bearer ${localStorage.getItem('AccessToken')}`},
                params: {
                    startTime: `${presentDay}T00:00:00Z`, 
                    endTime: `${nextDay}T00:00:00Z`, 
                }
            })
            .then((response) => {
                commit('UPDATE_THIS_DAY_TASKS', response.data.tasks)
            })
            .catch((err) => {
                console.log(err)
                alert("Запрос на этот день не удался")
            })   
        },

        GET_THIS_WEEK_TASKS({commit}, week) {
            const startTime = `${week[0][3]}-${week[0][4]}-${week[0][1]}`
            const endTime = `${week[6][3]}-${week[6][4]}-${week[6][1]}`

            axios({
                method: 'GET', 
                url: 'http://localhost:5000/task/getTask',
                headers: {'authorization': `Bearer ${localStorage.getItem('AccessToken')}`},
                params: {
                    startTime: `${startTime}T00:00:00Z`, 
                    endTime: `${endTime}T23:59:59Z`, 
                }
            })
            .then((response) => {
                commit('UPDATE_THIS_WEEK_TASKS', response.data.tasks)
            })
            .catch((err) => {
                console.log(err)
                alert("Запрос на эту неделю не удался")
            })   
        },

        ADDED_TASKLIST(){
            axios({
                method: 'POST',
                url: 'http://localhost:5000/task/createTaskList',
                headers: {'authorization': `Bearer ${localStorage.getItem('AccessToken')}`},
                data: {
                    title: 'Мужики го в баню',
                    toggleCircle: false,
                    isTasklistVisible: false,
                    startTime: "2023-10-02T11:00:00Z",
                    endTime: "2023-10-08T16:30:00Z",
                },
            })
            .then(() => {
                this.dispatch('GET_TASKLIST')

            })
            .catch((err) => {
                console.log(err)
                alert("Создание списка не удалось")
            }) 

            
        }, 

        GET_TASKLIST({commit}){
            axios({
                method: 'GET', 
                url: 'http://localhost:5000/task/getTaskList',
                headers: {'authorization': `Bearer ${localStorage.getItem('AccessToken')}`},
            })
            .then((response) => {
                commit('UPDATE_TASKLIST', response.data.tasksList)
            })
            .catch(() => {
                alert("Запрос на кастомный список не удался")
            })  
        },


    }
}