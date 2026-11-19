<template>
    <div ref="contentRef" class="du-tooltip-content">
        <el-tooltip v-if="isEllipsis" :content="props.value" trigger="hover" placement="top-start"
            popper-class="du-offset-icon">
            {{ props.value }}
        </el-tooltip>
        <template v-else>
            {{ props.value }}
        </template>

    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch, onMounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { ElTooltip } from 'element-plus';
import type { DuEllipsisProps } from './index';
defineOptions({ name: 'DuEllipsis' })

const props = withDefaults(defineProps<DuEllipsisProps>(), {
});
const contentRef = useTemplateRef<HTMLDivElement>('contentRef');
const isEllipsis = ref(false);


function updateEllipsis() {
    const el = contentRef.value;
    isEllipsis.value = !!el && el.scrollWidth > el.clientWidth;
}

// 首次渲染后测量
onMounted(updateEllipsis);

// 文本变化，等 DOM 更新后测量
watch(() => props.value, updateEllipsis, {
    flush: 'post',
});

// 容器宽度变化后重新测量
useResizeObserver(contentRef, updateEllipsis);
</script>

<style scoped>
.du-tooltip-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<style>
.du-offset-icon>span.el-popper__arrow {
    transform: translate3d(22px, 0px, 0px) !important;
}
</style>