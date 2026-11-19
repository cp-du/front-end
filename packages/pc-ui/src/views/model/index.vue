<template>
    <du-page title="模型管理">
        <du-table-pro ref="tableRef" :searchable="false" :controls="tableControls" url="/api/system/models/query"
            :params="params">
            <template #toolbar-left>
                <du-button type="primary" :icon="Plus" @click="onAddModel">
                    新增业务模型
                </du-button>
            </template>
            <template #operation="{ row }">
                <du-button type="primary" link @click="onEdit(row)">
                    编辑
                </du-button>
                <du-button type="primary" link
                    @click="$router.push(`/model/view?id=${row.id}&name=${encodeURIComponent(row.name)}`)">
                    字段维护
                </du-button>
                <du-button type="danger" link @click="onDelete(row)">
                    删除
                </du-button>
            </template>

        </du-table-pro>
    </du-page>
    <du-dialog title="新增" ref="addModelDialog" @confirm="onSaveConfirm">
        <du-form-pro ref="modelFormRef" :column="1" :controls="formControls"></du-form-pro>
    </du-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Plus, } from "@element-plus/icons-vue"
import { nextTick, ref, useTemplateRef } from "vue";
import { Http } from '@du/utils'
import { DuMessageBox } from '@/utils/index'
import { DuPage, DuButton, DuTablePro, DuDialog, DuFormPro } from '@/components';
import { ModelControls } from './options';
import type { TableControl, FormControl } from '@/typings';

const http = new Http({ baseURL: '/api' })
const params = { appName: 'system' }

const addModelDialog = useTemplateRef('addModelDialog')
const modelFormRef = useTemplateRef('modelFormRef')
const tableRef = useTemplateRef('tableRef')

const tableControls = ModelControls as TableControl[]
const formControls = ModelControls as FormControl[]

async function onEdit(row: any) {
    addModelDialog.value?.open()
    await nextTick()
    modelFormRef.value?.setModelProps('code', { 'form.disabled': true })
    modelFormRef.value?.setValue({
        ...row,
    })
}
async function onAddModel() {
    addModelDialog.value?.open()
    await nextTick()
    modelFormRef.value?.setValue({
        status: '1',
        status_name: '启用'
    })
}
async function onDelete(row: any) {
    DuMessageBox.confirm(`已选数据: ${row.name}`, '是否确认删除', {
        type: 'warning',
        confirmButtonType: 'danger',
        confirmButtonText: '删除'
    }).then(() => {
        http.delete(`/system/models/${row.id}?appName=system`).then(() => {
            ElMessage.success('删除成功')
            tableRef.value?.reload()
        })
    })
}
async function onSaveConfirm() {
    const formData = await modelFormRef.value?.validate()
    if (formData) {
        const url = formData.id ? `/system/models/${formData.id}` : '/system/models/create'
        const method = formData.id ? 'patch' : 'post'
        await http[method](url, { status: formData.status, description: formData.description, appName: 'system', name: formData.name, code: formData.code })
        ElMessage.success('保存成功')
        addModelDialog.value?.close()
        tableRef.value?.reload()
    }
}

defineOptions({
    name: 'Model'
})



</script>
