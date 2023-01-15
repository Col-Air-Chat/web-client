<template>
    <RouterView />
</template>

<style>
#root,
body,
html {
    height: 100%;
}

#app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
}

img{
    max-width: 100%;
    height: auto;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-radius: 10px;
}

::-webkit-scrollbar {
    display: none;
}

blockquote{
    border-left: 6px solid #dfe2e5;
    font-size: 24px;
    padding: 0 1em;
}
</style>

<script lang="ts" setup>
import { RouterView } from 'vue-router'

</script>