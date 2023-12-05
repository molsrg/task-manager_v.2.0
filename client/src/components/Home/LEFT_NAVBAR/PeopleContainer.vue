<template>
    <div class="people-container">
        <div class="people-container_info">
            <img
                class="people-container_logo"
                src="../../../assets/images/logo/logo.svg"
                alt="logo"
            />

            <h3 class="people-container-count">3</h3>

            <img src="../../../assets/images/home/line__horizont.png" alt="" />

            <img
                src="../../../assets/images/home/zaxar.png"
                alt=""
                class="people-container-user"
            />
            <img
                src="../../../assets/images/home/zaxar.png"
                alt=""
                class="people-container-user"
            />
            <img
                src="../../../assets/images/home/zaxar.png"
                alt=""
                class="people-container-user"
            />

            <img
                src="../../../assets/images/home/zaxar.png"
                alt=""
                class="people-container-user"
            />

            <button class="people-container-add-user" @click="addPeople()">
                <img src="../../../assets/images/home/addpeople.svg" alt="" />
            </button>
        </div>

        <div class="people-container_nav">
            <img
                class="people-container_nav-item"
                @click="goPersonalArea"
                src="../../../assets/images/home/go_to_profile.svg"
                alt=""
            />
            <img
                class="people-container_nav-item"
                @click="goOut"
                src="../../../assets/images/home/exit.svg"
                alt=""
            />
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    data() {
        return {
            checkedTasks: [],
        };
    },
    methods: {
        ...mapMutations([
            "UPDATE_GO_OUT",
        ]),
        goPersonalArea() {

            window.location.href = "http://localhost:8080/personal";
        },
        // заготовка под добавление людей
        addPeople() {},

        goOut() {
            this.UPDATE_GO_OUT()
            // localStorage.removeItem("AccessToken");
            // window.location.href = "http://localhost:8080/";
        },
    },
};
</script>
