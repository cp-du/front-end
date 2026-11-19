<template>
    <div class="du-page">
        <header v-if="$slots.header || props.title || props.backable">
            <div class="back" v-if="props.backable">
                <du-button link text :icon="Back" @click="goBack">
                    返回
                </du-button>
            </div>
            <div class="du-page-title">
                <h2 class="title">
                    <slot name="title">
                        <span>{{ props.title }}</span>
                    </slot>
                </h2>
                <div class="extra">
                    <slot name="extra"></slot>
                </div>
            </div>
        </header>
        <main v-if="!$slots.left">
            <div class="main-body">
                <slot></slot>
            </div>

        </main>
        <main class="splitter" v-else>
            <el-splitter>
                <el-splitter-panel :size="props.percentage">
                    <div class="left-panel">
                        <slot name="left">
                        </slot>
                    </div>
                </el-splitter-panel>
                <el-splitter-panel :min="200">
                    <div class="main-panel">
                        <slot></slot>
                    </div>
                </el-splitter-panel>
            </el-splitter>
        </main>
        <footer v-if="$slots.footer">
            <slot name="footer">
            </slot>
        </footer>
    </div>
</template>
<script setup lang="ts">

import { Back } from '@element-plus/icons-vue';
import type { ComponentSize, SplitterPanelProps } from 'element-plus';
import { useRouter } from 'vue-router';
import DuPageTitle from './DuPageTitle.vue'
import DuButton from '@/components/base/du-button'

defineOptions({ name: 'DuPage' })
const props = withDefaults(defineProps<{
    title?: string;
    size?: ComponentSize;
    backable?: boolean;
    percentage?: SplitterPanelProps['size'];
}>(), {
    title: '',
    backable: false,
    percentage: '15%',
})
const router = useRouter();
function goBack() {
    router.back();
}

</script>

<style lang="scss" scoped>
.du-page {
    height: 100%;
    display: flex;
    flex-direction: column;

    &>header {
        flex: 0 0 auto;
        border-bottom: 1px solid var(--el-border-color);
        display: flex;
        align-items: center;
        padding: 0 var(--space-4);

        .du-page-title {
            display: flex;
            align-items: center;
            padding: 12px 0;
            gap: 12px;

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
                font-size: 14px;
                color: var(--el-text-color-regular);
            }
        }

        .back {
            display: flex;
            align-items: center;

            &::after {
                content: '';
                display: inline-block;
                margin: 0 12px;
                width: 1px;
                height: 12px;
                background-color: black;
            }
        }
    }

    &>main {
        flex: 1;
        min-height: 0;
        display: flex;
        padding: var(--space-4);

        .main-body {
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        &.splitter {
            padding: 0;

            .left-panel {
                padding: var(--space-4) var(--space-3) var(--space-4) var(--space-4);
                height: 100%;
                overflow-y: auto;
            }

            .main-panel {
                padding: var(--space-4) var(--space-4) var(--space-4) var(--space-3);
                height: 100%;
                overflow-y: auto;
            }
        }
    }

    &>footer {
        padding: var(--space-3) var(--space-4);
        border-top: 1px solid var(--el-border-color);
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
}
</style>
