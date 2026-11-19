<template>
    <div class="box">
        <du-ellipsis :value="value"></du-ellipsis>
    </div>


</template>
<script setup lang="ts">
import { ref } from 'vue';
const value = ref('测试自定测试自定测试自定测试自定测试自定测试自定测试自定测试自定测试自定测试自定测试自定测试自定');
</script>
<style scoped lang="scss">
.box {
    width: 100px;
    margin: 100px auto;
    color: var(--text-color-helper);
}
</style>