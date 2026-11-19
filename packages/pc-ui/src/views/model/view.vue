<template>
    <du-page title="字段维护" backable>
        <template #left>
            <div class="plane">
                <div class="plane-header">
                    <div class="plane-name">{{ $route.query?.name }}</div>
                    <du-button link type="primary" @click="onAddField">新增字段</du-button>
                </div>
                <div class="plane-body">
                    <du-empty v-if="!fields.length" description="暂无字段"></du-empty>
                    <vue-draggable v-model="fields" :animation="150" ghostClass="ghost-item" @end="onDragend">
                        <div :class="{ 'field': true, 'active': currentField?.name === field.name }"
                            v-for="field in fields" :key="field.name" @click="onSelectField(field)">
                            <span class="iconfont-base" style="cursor: pointer;">&#xea8b;</span>
                            <label>{{ field.caption }}</label>
                            <el-button class="hover" type="danger" link
                                @click.stop="onDeleteField(field)">删除</el-button>
                        </div>
                    </vue-draggable>
                </div>
            </div>
        </template>
        <div class="plane">
            <div class="plane-header">
                <div class="plane-name">字段属性</div>
                <du-button link type="primary" @click="onSaveField">保存</du-button>
            </div>
            <div class="plane-body">
                <el-collapse v-if="currentField">
                    <el-collapse-item title="基础属性" name="1">
                        <div style="width: 800px;">
                            <du-form-pro ref="baseForm" :column="1" :controls="baseControls">
                            </du-form-pro>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="表格属性" name="2">
                        <div style="width: 800px;">
                            <du-form-pro ref="tableForm" groupable :column="1" :controls="tableControls">

                            </du-form-pro>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="表单属性" name="3">
                        <div style="width: 800px;">
                            <du-form-pro ref="formForm" groupable :column="1" :controls="formControls"></du-form-pro>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="搜索属性" name="4">
                        <div style="width: 800px;">
                            <du-form-pro ref="searchForm" groupable :column="1"
                                :controls="searchControls"></du-form-pro>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <du-empty v-else description="请选择字段"></du-empty>

            </div>
        </div>
    </du-page>
    <du-dialog ref="addFieldDialog" title="新增字段" @confirm="onSaveAddField">
        <du-form-pro ref="addFieldForm" :column="1" :controls="addFieldControls"></du-form-pro>
    </du-dialog>
</template>
<script setup lang="ts">
import { shallowRef, useTemplateRef, nextTick, onMounted } from "vue";
import { cloneDeep } from "es-toolkit";
import { ElCollapse, ElCollapseItem, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { useRoute } from "vue-router";
import { DuFormPro, DuDialog, DuButton } from '@/components'
import type { FormControl, TableControl, SearchControl, Control } from '@/typings'
import { Http } from '@du/utils'
import { addFieldControls, defaultControls, baseControls, tableControls, formControls, searchControls } from './options';

defineOptions({ name: 'ModelView' })

const route = useRoute()
const http = new Http({ baseURL: '/api' })


type Field = FormControl | TableControl | SearchControl

type Fields = Field[]
// 字段包含复杂的组件配置类型；仅追踪整体替换，避免深层 Ref 解包。
const fields = shallowRef<Fields>([])

const currentField = shallowRef<Field | null>(null);

async function fetchFields() {
    const id = route.query.id as string
    if (id) {
        http.get<{ id: string, fields: Fields }>(`/system/models/${id}/fields?appName=system`).then(res => {
            if (res.code === '0' && res.data) {
                fields.value = res.data.fields
                if (currentField.value && !fields.value.some(item => item.name === currentField.value?.name)) {
                    currentField.value = null;
                }

            }
        })
    }
}

async function onDeleteField(field: FormControl | TableControl | SearchControl) {
    const id = route.query.id as string
    http.delete(`/system/models/${id}/fields/${field.name}?appName=system`).then(res => {
        if (res.code === '0' && res.data) {
            ElMessage.success('删除成功')
            fetchFields()
        }
    })
}

const addFieldDialog = useTemplateRef<InstanceType<typeof DuDialog>>("addFieldDialog")
const addFieldForm = useTemplateRef<InstanceType<typeof DuFormPro>>("addFieldForm")

function onAddField() {
    addFieldDialog.value?.open()
}

async function onSaveAddField(done: () => void) {
    const formValue = await addFieldForm.value?.validate()
    if (formValue) {
        http.post(`/system/models/${route.query.id as string}/fields`, { appName: 'system', field: formValue }).then(res => {
            if (res.code === '0') {
                ElMessage.success('添加成功')
                fetchFields()
            }
        })
        done()
    }
}

async function onDragend() {
    const fieldNames = (fields.value as Control[]).map(item => item.name)
    await http.put(`/system/models/${route.query.id as string}/fields/order`, { appName: 'system', fieldNames })
}

onMounted(() => {
    fetchFields()
})



const baseFields = baseControls.map(control => control.name)
const tableFields = tableControls.map(control => control.name)
const formFields = formControls.map(control => control.name)
const searchFields = searchControls.map(control => control.name)

console.log(searchFields)


const baseForm = useTemplateRef<InstanceType<typeof DuFormPro>>("baseForm")
const tableForm = useTemplateRef<InstanceType<typeof DuFormPro>>("tableForm")
const formForm = useTemplateRef<InstanceType<typeof DuFormPro>>("formForm")
const searchForm = useTemplateRef<InstanceType<typeof DuFormPro>>("searchForm")
async function onSelectField(field: FormControl | TableControl | SearchControl) {
    currentField.value = cloneDeep({
        ...defaultControls,
        ...field
    })
    await nextTick()

    const baseFormData: Record<string, any> = {}

    baseFields.forEach(f => {
        if (f === 'controlProps') {
            baseFormData[f] = JSON.stringify(currentField.value?.controlProps || {})
        }
        else {
            baseFormData[f] = currentField.value?.[f as keyof typeof currentField.value]
        }
    })
    baseForm.value?.setValue(baseFormData)


    let tableFormData: Record<string, any> = {}
    tableFields.forEach(f => {
        if (f === 'table.controlProps') {
            tableFormData[f] = JSON.stringify(currentField.value?.['table.controlProps' as keyof typeof currentField.value] || {})
        }
        else {
            tableFormData[f] = currentField.value?.[f as keyof typeof currentField.value]
        }
    })

    let formFormData: Record<string, any> = {}
    formFields.forEach(f => {
        if (f === 'form.controlProps') {
            formFormData[f] = JSON.stringify(currentField.value?.['form.controlProps' as keyof typeof currentField.value] || {})
        }
        else {
            formFormData[f] = currentField.value?.[f as keyof typeof currentField.value]
        }
    })

    let searchFormData: Record<string, any> = {}
    searchFields.forEach(f => {
        if (f === 'search.controlProps') {
            searchFormData[f] = JSON.stringify(currentField.value?.['search.controlProps' as keyof typeof currentField.value] || {})
        }
        else {
            searchFormData[f] = currentField.value?.[f as keyof typeof currentField.value]
        }
    })

    console.log(searchFormData)

    tableForm.value?.setValue(tableFormData)
    formForm.value?.setValue(formFormData)
    searchForm.value?.setValue(searchFormData)

    console.log(searchForm.value?.getValue())
}


async function onSaveField() {
    const baseFormResult = await baseForm.value?.validate()
    const tableFormResult = await tableForm.value?.validate()
    const formFormResult = await formForm.value?.validate()

    const searchFormResult = await searchForm.value?.validate()

    if (!baseFormResult || !tableFormResult || !formFormResult || !searchFormResult) {
        return
    }

    tableFormResult['table.controlProps'] = JSON.parse(tableFormResult['table.controlProps' as keyof typeof tableFormResult] as string) || {}
    formFormResult['form.controlProps'] = JSON.parse(formFormResult['form.controlProps' as keyof typeof formFormResult] as string) || {}
    searchFormResult['search.controlProps'] = JSON.parse(searchFormResult['search.controlProps' as keyof typeof searchFormResult] as string) || {}
    baseFormResult['controlProps'] = JSON.parse(baseFormResult['controlProps' as keyof typeof baseFormResult] as string) || {}
    console.log(searchFormResult)
    const index = fields.value.findIndex(field => field.name === currentField.value?.name)
    if (index !== -1) {
        const updatedFields = [...fields.value];
        updatedFields[index] = {
            ...updatedFields[index],
            ...baseFormResult,
            ...tableFormResult,
            ...formFormResult,
            ...searchFormResult,
        }
        fields.value = updatedFields;

        http.patch(`/system/models/${route.query.id as string}/fields/${currentField.value?.name}`, { appName: 'system', field: fields.value[index] }).then(res => {
            if (res.code === '0') {
                ElMessage.success('字段保存成功')
                fetchFields()
            }
        })
    }

}


</script>
<style scoped lang="scss">
.plane-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--el-border-color);
    padding-bottom: var(--space-4);

    .plane-name {
        font-size: 14px;
        font-weight: 700;
        line-height: normal;
    }
}

.plane-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--space-4) 0 0;
}

.plane {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.field {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--el-color-primary-light-9);
    font-size: 12px;
    cursor: pointer;
    margin-bottom: var(--space-2);
    display: flex;
    align-items: center;
    gap: var(--space-2);

    &>label {
        flex: 1;
        min-width: 0;
        line-height: 20px;
    }

    .hover {
        display: none;
    }

    &.active {
        background: var(--el-color-primary-light-7);
    }

    &:hover {
        background: var(--el-color-primary-light-8);

        .hover {
            display: inline-block;
        }
    }
}
</style>
