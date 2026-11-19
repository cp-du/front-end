<template>
    <du-page title="船员信息管理">

        <du-table-pro ref="tableRef" selectable model-name="crewbo" id="id" url="/api/crew/query">
            <template #operation="{ row }">
                <du-button link type="primary" @click="() => onEdit(row)">编辑</du-button>
                <du-button link type="primary" @click="onSubmit">提交</du-button>
                <du-button link type="primary" @click="() => onDetail(row)">详情</du-button>
                <du-button link type="primary">撤回</du-button>
                <du-button link type="primary">删除</du-button>
            </template>
            <template #toolbar-left>
                <div>
                    <du-button type="primary" @click="">新增</du-button>
                    <du-button type="default" @click="">提交</du-button>
                    <du-button type="default" @click="">撤回</du-button>
                    <du-button type="default" @click="">删除</du-button>
                </div>
            </template>
        </du-table-pro>
    </du-page>
</template>
<script setup lang="ts">
defineOptions({ name: 'Cyxxgl' })
import { useRouter } from 'vue-router'
import { useTemplateRef, onActivated } from 'vue'
import { getBatchOperationTip, useRefresh } from "@du/utils";
import { DuTablePro } from "@du/pc-ui"
const { consumeRefresh } = useRefresh()
const router = useRouter()
const tableRef = useTemplateRef<InstanceType<typeof DuTablePro>>('tableRef')
function onSubmit() {
    const tip = getBatchOperationTip(tableRef.value, 'text')
    window.alert(tip)
}

function onEdit(row: Record<string, unknown>) {
    console.log(row)
    router.push({ name: 'sqxq', query: { id: row.id as string } })
}

function onDetail(row: Record<string, unknown>) {
    router.push({ name: 'sqxq', query: { id: row.id as string, readonly: '1' } })
}
onActivated(() => {
    if (consumeRefresh()) {
        tableRef.value?.reload()
    }
})
</script>
