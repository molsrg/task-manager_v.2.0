<template>
    <div class="week">
        <div
        :class="
            day[1] == PRESENT_DAY[0] && day[2] == PRESENT_DAY[1] &&day[3] == PRESENT_DAY[2] 
            ? 'present-day'
            : 'day'
        "
        v-for="day in CURRENT_WEEK"
        :key="day"
        >
        <div class="day_number">{{ day[1] }}</div>
        <div class="day_text">{{ day[0] }}</div>
        <!-- <div class="day__text">{{ day[2] }}</div>
        <div class="day__text">{{ day[3] }}</div> -->

        <div class="day_line">―</div>
        </div>
    </div>
</template>

<script>


import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['PRESENT_DAY', 'CURRENT_WEEK', ]), 
    },

};
</script>

<style scoped>
.week {
    display: flex;
    justify-content: space-between;

    width: 1155px;
    height: 134px;
    margin-bottom: 41px;
    margin-left: 40px;
    /* background-color: red; */

     /* gap: 128px; */
}

.day{ 
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Poppins;
    font-weight: 700;
    color: #9E9E9E;

    height: 134px;
    
}

.present-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Poppins;
    font-weight: 700;
    color: #0E0E0E;
}

.day_number{
    font-size: 53px;
    cursor: pointer;
}

.day_text{
    font-size: 15px;
}

.day_line{
    transform: rotate(90deg);
    font-weight: 900;
}

</style>