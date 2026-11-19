<template>
    <div class="micro-app-root">
        <div id="sub-container" class="micro-app-container" />
    </div>
</template>

<style scoped lang="scss">
.micro-app-root {
    width: 100%;
    height: 100%;
    min-height: 0;

    .micro-app-container {
        width: 100%;
        height: 100%;
        min-height: 0;
        overflow-y: auto;


    }

    &::v-deep(.micro-app-container>div) {
        height: 100%;
    }
}
</style>