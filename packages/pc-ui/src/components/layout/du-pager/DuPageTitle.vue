<template>
    <div :class="['du-page-title', `du-page-title--default`]">
        <h2 class="title">
            <slot>
                <span>{{ props.title }}</span>
            </slot>
        </h2>
        <div class="extra">
            <slot name="extra"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">

defineOptions({ name: 'DuPageTitle' })

const props = withDefaults(defineProps<{
    title?: string;
}>(), {
    title: '',
})


</script>
<style scoped lang="scss">
.du-page-title {
    display: flex;
    align-items: center;

    &.du-page-title--small {
        padding: 8px 0;
        gap: 8px;

        .title {
            font-size: 14px;
        }

        .extra {
            font-size: 12px;
        }
    }

    &.du-page-title--default {
        padding: 12px 0;
        gap: 12px;

        .title {
            font-size: 16px;
        }

        .extra {
            font-size: 14px;
        }
    }

    &.du-page-title--large {
        padding: 16px 0;
        gap: 16px;

        .title {
            font-size: 18px;
        }

        .extra {
            font-size: 16px;
        }
    }

    .title {
        flex: 0 0 auto;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        position: relative;

        &>span {
            position: relative;
            z-index: 2;
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 8px;
            background-color: var(--el-color-primary-light-7);
            z-index: 1;
        }
    }

    .extra {
        flex: 1;
        min-width: 0;
        color: var(--el-text-color-regular);
    }
}
</style>