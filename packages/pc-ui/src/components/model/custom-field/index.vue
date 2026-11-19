<template>
    <du-dialog ref="customFieldDialog" title="自定义列配置" width="900" @confirm="onConfirm">
        <div class="custom-field-dialog-content">
            <div class="panel left-panel">
                <div class="header">
                    <div class="title">待选字段</div>
                </div>
                <div class="content">
                    <el-checkbox-group v-model="checkedFields">
                        <el-checkbox v-for="item in props.existControls" :key="item.name" :label="item">{{ item.caption
                            }}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="panel right-panel">
                <div class="header">
                    <div class="title">已选字段段</div>
                </div>
                <div class="content">
                    <VueDraggable v-model="checkedFields" :animation="150" ghostClass="ghost-item">
                        <div class="checked-item" v-for="field in checkedFields" :key="field.name">
                            <span class="iconfont-base" style="cursor: pointer;">&#xea8b;</span>
                            <div class="title">{{ field.caption }}</div>
                            <du-select v-if="props.positionable" style="width: 80px;" size="small" v-model="field.fixed"
                                :options="positionOptions"></du-select>
                            <span class="iconfont-base" style="cursor: pointer;"
                                @click="onRemoveCheck(field.name)">&#xe737;</span>
                        </div>
                    </VueDraggable>

                </div>
            </div>
        </div>
    </du-dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { ElCheckboxGroup, ElCheckbox } from "element-plus";
import { VueDraggable } from 'vue-draggable-plus'
import DuDialog from "@/components/feedback/du-dialog";
import DuSelect from "@/components/controls/du-select";
import { cloneDeep } from "es-toolkit";
import type { TableControl, SearchControl, CardControl } from '@/typings/model';

defineOptions({ name: 'CustomField' })

const positionOptions = [
    { label: '左', value: 'left' },
    { label: '右', value: 'right' },
]

const props = withDefaults(defineProps<{
    existControls: TableControl[] | SearchControl[] | CardControl[];
    positionable?: boolean
}>(), {
    positionable: false
})

const emits = defineEmits<{
    (e: 'confirm', checkedFields: any[], close: () => void): void
}>()

/**
 * 绑定勾选字段
 */
const checkedFields = ref<any[]>([])
const customFieldDialog = useTemplateRef<InstanceType<typeof DuDialog>>('customFieldDialog');


/**
 * 打开自定义字段对话框
 */
function open(visibleControls: TableControl[] | SearchControl[] | CardControl[]) {
    checkedFields.value = cloneDeep(visibleControls)
    customFieldDialog.value?.open?.()
}

/**
 * 移除已勾选的字段
 * @param field string - 目标字段的名称
 */
function onRemoveCheck(name: string) {
    checkedFields.value = checkedFields.value.filter(f => f.name !== name)
}

function onConfirm(close: () => void) {
    emits('confirm', checkedFields.value, close)
}

defineExpose<{
    open: (visibleControls: TableControl[] | SearchControl[] | CardControl[]) => void
}>({
    open
})

</script>

<style scoped lang="scss">
.custom-field-dialog-content {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: row;
    gap: var(--space-3, 12px);

    .panel {
        flex: 1;
        min-width: 0;
        border: 1px solid var(--el-border-color);
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;

        &.right-panel {
            .content {

                .checked-item {
                    padding: var(--space-2, 8px);
                    border-radius: var(--radius-sm);
                    background-color: var(--el-fill-color-light);
                    display: flex;
                    align-items: center;
                    gap: var(--space-1, 4px);
                    margin-bottom: var(--space-3, 12px);

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .title {
                        flex: 1;
                        min-width: 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }

        .header {
            padding: var(--space-2, 8px) var(--space-3, 12px);
            display: flex;
            align-items: center;
            background-color: var(--el-fill-color-lighter);

            .title {
                font-size: 14px;
                font-weight: 600;
            }
        }

        .content {
            flex: 1;
            min-height: 0;
            padding: var(--space-3, 12px);
            overflow-y: auto;
        }
    }
}
</style>