<template>
    <div class="taskboard">
        <div class="time">
            <div class="time_container" >
                <span class="time_name" v-for="hour in CURRENT_HOURS" :key="hour" >{{ hour }}</span>
                
            </div>
        </div>
        <div class="task" v-for="task in USER_TASKS_IN_CALENDAR" :key="task.id" :style="taskStyle(task)" @click="showTask(task)">  
            <h5 class="task_name">{{ task.name }}</h5>
            <span class="task_time">{{ formatTime(task.startTime) }} - {{ formatTime(task.endTime) }}</span>
            <!-- <button @click="isTaskOverflowed">Выбрать</button> -->
        </div>
</div>
</template>

<script>
import moment from "moment";
// eslint-disable-next-line no-unused-vars
import Task from '../../../store/modules/Task/Task'

import { mapGetters, mapMutations } from 'vuex';
moment.locale("ru");

export default {
    mounted(){
        this.$nextTick(() => {
            this.scrollToCurrentHour();
        });
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['CURRENT_HOURS', 'USER_TASKS_IN_CALENDAR', 'CURRENT_WEEK']), 
        
    },
    methods: {
        // автоматически скролит к нужному времени при открытии страницы
    scrollToCurrentHour() { 
        const taskboardContainer = document.querySelector('.taskboard'); 
        if (taskboardContainer) {
            const currentHour = `${Number(moment().format('HH'))}:00`; 
            const hourElements = taskboardContainer.querySelectorAll('.time_name');
            for (let i = 0; i < hourElements.length; i++) {
                if (hourElements[i].textContent === currentHour) {
                    const containerRect = taskboardContainer.getBoundingClientRect();
                    const hourRect = hourElements[i].getBoundingClientRect();
                    const scrollTop = hourRect.top - containerRect.top;
                    taskboardContainer.scrollTop = scrollTop;
                    return; // Выходим из цикла, когда нашли нужный час
            }
        }
        
        console.error("Час не найден в .calendar__taskboard.");
    } else {
        console.error("Элемент .calendar__taskboard не найден в DOM.");
    }
    },
        ...mapMutations(['UPDATE_CHECKED_TASK']),
        // Функция для вычисления стиля задачи 
        taskStyle(task) {
            const heightInPixels = Task.calculateTaskLengthInPixels(task);
            // console.log(`${task.name}, длина задачи - ${heightInPixels}`)
            const colorTask = Task.calculateTaskColor(task)
            const leftPosition = Task.calculateLeftPosition(task, this.CURRENT_WEEK)
            const startPosition = Task.calculateTaskStartPosition(task)

            return {
                height: heightInPixels + 'px', 
                'background-color': colorTask, 
                top: startPosition + 'px',
                left: leftPosition + 'px', 
            }
        },
        // обновляет выбранную задачу 
        showTask(task){
            this.UPDATE_CHECKED_TASK(task)
        },
        // приводит дату к нужному формату в отображении задачи на календаре
        formatTime(dateTime){
            const date = dateTime.split('T')[1].split(':')
            const res = `${date[0]}:${date[1]}`
            
            return res
            // const date = new Date(dateTime)
            // const res = [date.getHours(), date.getMinutes()].map(function (x) {
            //     return x < 10 ? "0" + x : x
            // }).join(":")

            // return res

        },
    }

};
</script>

<style>
.taskboard {
    overflow-y: auto;
    max-height: calc(100vh - 280px);
    width: 1340px;
    position: relative; /* Добавьте это */
}

.time {
    width: 38px;
    margin-right: 30px;
    margin-bottom: 65px;
}

.time_container{
    display: flex;
    gap: 65px;
    flex-direction: column;
}

.time_container span{
    position: relative;
}

.time_container span:after{
    display: block;
    width:1266px;
    content: '';
    position: absolute;
    border-bottom: 1px solid #000;
    top:1%;
    left: 56px; 
}
.time_name {
    font-family: Poppins;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
}


.task{
    font-family: Raleway;
    font-size: 14px;

    width: 173px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    position: absolute;
    opacity: 1;
    transform: translateY(20px); /* Сдвиг вниз на 20px, вы можете настроить его по своему усмотрению */
    transition: opacity 0.5s ease, transform 0.5s ease;

    overflow: hidden;
    
}

.task_name {
    font-weight: 600;
    color:#0C3C44;
    padding: 4px 6px;
    word-wrap: break-word;
}
.task_time {
    font-weight: 400;
    color: #296B76;
    padding: 0px 6px;
}
</style>