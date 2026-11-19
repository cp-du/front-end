<template>
    <el-dropdown v-if="props.children" trigger="click">
        <el-button v-bind="singleButtonProps" @click="stopClickPropagation">
            <slot v-if="$slots.default" />
            <span v-else-if="props.name">{{ props.name }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>

        <template #dropdown v-if="props.children.length">
            <el-dropdown-menu>
                <el-dropdown-item v-for="(btn, index) in props.children" :key="index"
                    @click="onNativeClick($event, btn)">{{
                        btn.name
                    }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-button v-else v-bind="singleButtonProps" @click="onNativeClick($event)">
        <slot v-if="$slots.default" />
        <span v-else-if="props.name">{{ props.name }}</span>
    </el-button>
</template>
<script setup lang="ts">
import { mergeProps, computed, useAttrs } from 'vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { debounce } from "es-toolkit";
import type { DuButtonProps, DuButtonEmit, ChildrenButton } from './index'

defineOptions({
    name: 'DuButton'
})


const props = withDefaults(defineProps<DuButtonProps>(), {
})


const attrs = useAttrs()
const singleButtonProps = computed(() => {
    const btnProps = mergeProps(attrs, props)

    delete btnProps.name
    delete btnProps.children
    delete btnProps.stopPropagation

    return btnProps
})


const emits = defineEmits<DuButtonEmit>();

function stopClickPropagation(event: Event, btn?: ChildrenButton) {
    if (props.stopPropagation || btn?.stopPropagation) {
        event.stopPropagation();
    }
}

function onNativeClick(event: Event, btn?: ChildrenButton) {
    // 在防抖之前拦截，确保连续点击也不会冒泡。
    stopClickPropagation(event, btn);
    onClick(btn);
}


const onClick = debounce(
    (btn?: ChildrenButton) => {
        emits("click", btn);
    },
    300,
    { edges: ["leading"] }
);



</script>
