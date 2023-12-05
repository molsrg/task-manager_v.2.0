<template>
    <div class="unavailable">
        <div>Sorry.. you dont have AccessToken...</div>
        <button class="unavailable__button" @click="goOut">Выйти и зарегестрироваться</button>
    </div>
</template>

<script>
export default {
    methods:{
        goOut(){
                localStorage.removeItem('AccessToken')
                window.location.href = "http://localhost:8080/"
            }
    }
}
</script>

<style>

</style>