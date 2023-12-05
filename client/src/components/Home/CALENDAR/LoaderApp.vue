<template>
    <div class="wrapper">
        <span class="loader"></span>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.wrapper {
    width: 1340px;
    margin: 100px auto;
    display: flex;
    justify-content: center;
}
.loader {
    width: 48px;
    height: 48px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>