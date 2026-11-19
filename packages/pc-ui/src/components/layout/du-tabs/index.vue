<template>
    <el-tabs ref="tabsRef" v-bind="mergeProps($attrs, elTabsProps)" v-model="value"
        :class="['du-tabs', `du-tabs--${props.type}`]">
        <slot></slot>
        <teleport v-if="extraTarget && slots.extra" :to="extraTarget">
            <div class="du-tabs__extra-content">
                <slot name="extra"></slot>
            </div>
        </teleport>
    </el-tabs>
</template>

<script lang="ts" setup>
import { mergeProps, provide, computed, nextTick, onMounted, ref, useSlots } from "vue";
import { ElTabs } from "element-plus";
import type { DuTabsProps, DuTabsEmit } from "./index";

defineOptions({
    name: "DuTabs"
});

const slots = useSlots();

const props = withDefaults(defineProps<DuTabsProps>(), {
});

const emits = defineEmits<DuTabsEmit>();
const tabsRef = ref<InstanceType<typeof ElTabs>>();
const extraTarget = ref<HTMLElement | null>(null);

const elTabsProps = computed(() => {
    if (props.type === "title") {
        const { type, ...rest } = props;
        return rest;
    }

    return props;
});

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits("update:modelValue", val);
    }
});

async function resolveExtraTarget() {
    await nextTick();
    const tabsElement = tabsRef.value?.$el as HTMLElement | undefined;
    extraTarget.value = tabsElement?.querySelector(".el-tabs__nav-scroll") ?? null;
}

onMounted(() => {
    void resolveExtraTarget();
});

provide(
    "active-tab",
    computed(() => props.modelValue)
);
</script>
<style scoped lang="scss">
.du-tabs {
    height: 100%;

    &::v-deep(.el-tabs__header) {
        margin: 0 0 12px;

        .el-tabs__item {
            padding: 0 12px;

            &:nth-child(2) {
                padding-left: 0;
            }
        }

    }

    &.du-tabs--title {
        &::v-deep(.el-tabs__header) {
            padding: 12px 0;
            border-bottom: 1px solid var(--el-border-color);



            .el-tabs__nav-wrap {
                &::after {
                    display: none;
                }

                .el-tabs__nav-scroll {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;

                    .el-tabs__nav {
                        flex: 0 0 auto;
                        display: flex;
                        align-items: center;
                        gap: 24px;

                        .el-tabs__item {
                            font-size: 16px;
                            font-weight: 600;
                            line-height: 24px;
                            position: relative;
                            padding: 0;
                            height: auto;

                            &>span {
                                z-index: 2;
                                line-height: 24px;
                            }

                            &.is-active {
                                color: var(--el-text-color-primary);

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

                        }
                    }
                }

            }

        }

    }

    .du-tabs__extra-content {
        flex: 1;
        min-width: 0;
        color: var(--el-text-color-regular);
        font-size: 14px;
    }

}
</style>
