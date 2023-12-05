<template>
    <section class="go-out">
        <h2 class="go-out__text">Вы действительно хотите выйти?</h2>
        <div class="go-out__buttons">
            <button class="go-out__button" style="background-color: #dd5e5e" @click="goOut()">
                Выйти
            </button>
            <button class="go-out__button" style="background-color: #15616d" @click="cancel()">
                Отмена
            </button>
        </div>
    </section>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    methods: {
        ...mapMutations([
            "UPDATE_GO_OUT",
        ]),
        goOut(){
            localStorage.removeItem("AccessToken");
            window.location.href = "http://localhost:8080/";
        }, 
        cancel(){
            this.UPDATE_GO_OUT()
        }

    }
};
</script>

<style>
.go-out {
    background-color: white;
    width: 430px;
    height: 182px;
    font-family: Raleway;
    font-weight: 500;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 35px;
    border-radius: 10px;
}

.go-out__text {
    color: #001524;
    font-size: 20px;
    text-align: center;
}

.go-out__buttons {
    display: flex;
    justify-content: center;
    column-gap: 20px;
}

.go-out__button {
    padding: 16px 53px;
    color: #FFECD1;
    font-family: Raleway;
    font-size: 14px;
    border-radius: 10px;
}

</style>