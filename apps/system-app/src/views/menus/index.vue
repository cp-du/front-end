<template>
    <du-page :title="$t('dict.dictionaryManagement')">

        <du-table-pro ref="tableRef" selectable model-name="menubo" id="id" url="/api/system/menus"
            :treeConfig="{ rowField: 'name' }">
            <template #operation="{ row }">
                <du-button link type="primary" @click="() => onAdd(row)">添加</du-button>
                <du-button link type="primary" @click="() => onEdit(row)">编辑</du-button>
                <du-button link type="primary" @click="() => onDetail(row)">详情</du-button>
                <du-button link type="primary">删除</du-button>
            </template>
            <template #toolbar-left>
                <div>
                    <du-button type="primary" @click="onAdd">新增</du-button>
                    <du-button type="default" @click="">删除</du-button>
                </div>
            </template>
            <template #menuType="{ row }">
                <el-tag>{{ row['menuType_name'] }}</el-tag>
            </template>
        </du-table-pro>
    </du-page>
    <du-dialog v-model="visible" title="编辑" width="800px" ref="dialogRef" :before-close="beforeClose"
        @confirm="onConfirm">
        <div>
            <du-form-pro v-model="formData" :column="2" @item-change="onItemChange" model-name="menubo" ref="formRef"
                @model-done="formModelDone">
                <template #icon>
                    <du-icon-select v-model="formData.icon" size="30px" multiple />
                </template>
            </du-form-pro>
        </div>
    </du-dialog>
</template>
<script setup lang="ts">
defineOptions({ name: 'Menus' })

import { useRouter } from 'vue-router'
import { useTemplateRef, ref } from 'vue'
// import { getBatchOperationTip, useRefresh } from "@du/utils";
import { DuTablePro, DuFormPro } from "@du/pc-ui"
import { queryMenuById, patchMenuById, createMenu } from "@/services/menus"


let type = ''
const router = useRouter()
const tableRef = useTemplateRef<InstanceType<typeof DuTablePro>>('tableRef')

const visible = ref(false)



function onDetail(row: Record<string, unknown>) {
    router.push({ name: 'menus-view', query: { id: row.id as string, readonly: '1' } })
}

type FormData = Record<string, unknown>;
const formData = ref<FormData>({});
const formRef = useTemplateRef<InstanceType<typeof DuFormPro>>('formRef')

function onItemChange(value: unknown, key: string) {
    console.log('Item changed:', key, value);
    switch (key) {
        case "menuType":
            formRef.value?.setModelProps('icon', { 'form.hidden': value !== 'directory' && value !== 'menu' });
            formRef.value?.setModelProps('visible', { 'form.hidden': value !== 'directory' && value !== 'menu' });
            formRef.value?.setModelProps('path', { 'form.hidden': value !== 'menu' && value !== 'link' });
            formRef.value?.setModelProps('permissionCode', { 'form.hidden': value !== 'tab' && value !== 'button' });
            break;
    }
}
function onConfirm(done: () => void) {
    if (formData.value.id) {
        patchMenuById(formData.value.id as string, formData.value).then(() => {
            done()
            tableRef.value?.reload()
        });
    } else {
        createMenu({ ...formData.value, sortOrder: 1 }).then(() => {
            done()
            tableRef.value?.reload()
        });
    }
}

const dialogRef = useTemplateRef('dialogRef')

function beforeClose(done: () => void) {
    type = ''
    formData.value = {}
    done()
}
let currentRow: Record<string, unknown> | undefined = undefined
function formModelDone() {
    console.log('Form model done for row:', currentRow)
    linkageField(currentRow)
}

function linkageField(row?: Record<string, unknown>) {
    formRef.value?.setModelProps('parentId', { 'form.hidden': !row?.parentId });
    formRef.value?.setModelProps('icon', { 'form.hidden': row?.menuType !== 'directory' && row?.menuType !== 'menu' });
    formRef.value?.setModelProps('visible', { 'form.hidden': row?.menuType !== 'directory' && row?.menuType !== 'menu' });
    formRef.value?.setModelProps('path', { 'form.hidden': row?.menuType !== 'menu' && row?.menuType !== 'link' });
    formRef.value?.setModelProps('permissionCode', { 'form.hidden': row?.menuType !== 'tab' && row?.menuType !== 'button' });
}
async function onAdd(row?: Record<string, unknown>) {
    currentRow = { parentId: row?.id }
    if (row?.id) {
        formData.value = { parentId: row.id, parentId_name: row?.name }
    }
    dialogRef.value?.open()
}

function onEdit(row: Record<string, unknown>) {
    console.log(formData.value);
    queryMenuById<FormData>(row.id as string).then(res => {

        formData.value = {
            ...res.data,
            parentId: res.data?.parentId,
            parentId_name: res.data?.parentId_name
        };
        currentRow = res.data
        dialogRef.value?.open()
        type = 'edit'
    });
}
</script>
