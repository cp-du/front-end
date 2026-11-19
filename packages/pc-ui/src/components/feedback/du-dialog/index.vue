<template>
    <el-dialog ref="dialogRef" class="du-dialog" v-bind="mergeProps($attrs, props)" v-model="visible"
        header-class="du-dialog__header" body-class="du-dialog__body" footer-class="du-dialog__footer">
        <template #header v-if="$slots.header">
            <slot name="header" />
        </template>
        <slot ref="bodyRef" />
        <template #footer v-if="$slots.footer || cancelButton?.enable || confirmButton?.enable">
            <slot name="footer">
                <du-button v-if="cancelButton?.enable" @click="onCancel">{{ cancelButton?.text
                }}</du-button>
                <du-button v-if="confirmButton?.enable" type="primary" @click="onConfirm">{{
                    confirmButton?.text }}</du-button>
            </slot>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { mergeProps, useTemplateRef, computed, watch, ref } from 'vue';
import { ElDialog } from 'element-plus';
import { useI18n } from 'vue-i18n';

import type { DuDialogProps, DuDialogEmit, DuDialogExpose } from './index'



defineOptions({
    name: 'DuDialog'
})

const { t } = useI18n({ useScope: "global" });

const emits = defineEmits<DuDialogEmit>();

const props = withDefaults(defineProps<DuDialogProps>(), {
    width: '500px',
    appendToBody: true,
    modal: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: true,
    draggable: true,
    destroyOnClose: true,
})

const visible = ref(false)

watch(() => props.modelValue, (val) => {
    visible.value = val;
});

watch(visible, (val) => {
    emits('update:modelValue', val);
});

const confirmButton = computed(() => ({
    enable: props.confirmButton?.enable ?? true,
    text: props.confirmButton?.text ?? t('confirm'),
    type: props.confirmButton?.type ?? 'primary',
}));

const cancelButton = computed(() => ({
    enable: props.cancelButton?.enable ?? false,
    text: props.cancelButton?.text ?? t('cancel'),
    type: props.cancelButton?.type ?? 'default',
}));

const dialogRef = useTemplateRef<InstanceType<typeof ElDialog>>('dialogRef');

function beforeClose(done: () => void) {
    props.beforeClose?.(done);
}

function onConfirm() {
    emits('confirm', () => {
        dialogRef.value?.handleClose()
    });


}
function onCancel() {
    emits('cancel');
    dialogRef.value?.handleClose()
}

function open() {
    visible.value = true;
}
function close() {
    dialogRef.value?.handleClose()
}

defineExpose<DuDialogExpose>({
    open,
    close
})


</script>

<style scoped lang="scss"></style>

<style lang="scss">
.el-overlay-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
}

.du-dialog {
    max-height: 80vh;
    padding: 0;
    overflow: hidden;
    position: relative;
    margin: 0;
    display: flex;
    flex-direction: column;

    .du-dialog__header {
        padding: 12px 20px;
        border-bottom: 1px solid var(--el-border-color);

        .el-dialog__title {
            font-weight: 600;
            font-size: 16px;
        }
    }

    .du-dialog__body {
        width: 100%;
        padding: 12px 20px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .du-dialog__footer {
        padding: 12px 20px;
        border-top: 1px solid var(--el-border-color);
    }
}
</style>