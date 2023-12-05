<template>
    <section class="go-out">
        <h2 class="go-out__text">Вы действительно хотите удалить эту задачу?</h2>
        <div class="go-out__buttons">
            <button class="go-out__button" style="background-color: #dd5e5e" @click="cancel()">
                Нет
            </button>
            <button class="go-out__button" style="background-color: #15616d" @click="deleteTask()">
                Да
            </button>
        </div>
    </section>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    methods: {
        ...mapMutations([
            "UPDATE_DELETE_TASK", "UPDATE_CHECKED_TASK",
        ]),
        deleteTask(){
            this.UPDATE_CHECKED_TASK()
            // this.DELETE_TASK_BY_ID(task.id) - сделать метод удаления
        }, 
        cancel(){
            this.UPDATE_DELETE_TASK()
        }

    }
};
</script>
