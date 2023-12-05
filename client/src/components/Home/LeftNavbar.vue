<template>
  <div class="leftnavbar">
    <PeopleContainer></PeopleContainer>
    <TaskContainer></TaskContainer>
  </div>
</template>
  

<script>


import TaskContainer from './LEFT_NAVBAR/TaskContainer.vue'
import PeopleContainer from './LEFT_NAVBAR/PeopleContainer.vue'

export default {
  data() {
    return {
      checkedTasks: [],
    };
  
  },

  components: {
    TaskContainer, 
    PeopleContainer
  },
};
</script>
