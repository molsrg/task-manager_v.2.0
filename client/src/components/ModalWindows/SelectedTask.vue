<template>
    <ul class="selected_task" >
        <li v-for="task in USER_SELECT_TASKS" :key="task._id" >{{ task.name }}</li>
    </ul>
    <button @click="UPDATE_CHECK_SELECT_TASK()">Закрыть выбранные задачи</button>

</template>

<script>

import { mapGetters, mapMutations } from "vuex";
export default {
    methods:{
        ...mapMutations(['UPDATE_CHECK_SELECT_TASK'])
    },
    computed: {
    ...mapGetters(['USER_SELECT_TASKS']),
    },
};
</script>

<style>
.selected_task{
    width: 600px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}
</style>