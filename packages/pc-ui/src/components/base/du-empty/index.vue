<template>
    <div class="du-empty">
        <el-empty v-bind="mergeProps($attrs, props)">
            <template v-if="$slots.image" #image>
                <slot name="image" />
            </template>
            <template v-if="$slots.default" #default>
                <slot name="default" />
            </template>
            <template v-if="$slots.description" #description>
                <slot name="description" />
            </template>
        </el-empty>
    </div>
</template>
<script setup lang="ts">
import { mergeProps } from 'vue';
import { ElEmpty } from 'element-plus';
import type { DuEmptyProps } from './index'

defineOptions({ name: 'DuEmpty' })

const props = withDefaults(defineProps<DuEmptyProps>(), {
    description: "暂无数据"
})


</script>

<style scoped lang="scss">
.du-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
