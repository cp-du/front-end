<template>
    <du-tabs v-model="activeTab" type="title">
        <du-tab-pane name="tab1" label="待审核">
            <du-table-pro selectable model-name="auditbo" id="id" url="/query/eabysh_kcrd_eacourserecognition_cxshlb"
                :params="{ a: '1' }" :querySetting="querySetting">
                <template #operation>
                    <du-button link type="primary">编辑</du-button>
                    <du-button link type="primary">删除</du-button>
                </template>
                <template #toolbar-left>
                    <div>
                        <du-button type="primary" @click="onAdd">新增</du-button>
                    </div>
                </template>
            </du-table-pro>
        </du-tab-pane>

        <du-tab-pane name="tab2" label="已审核">
            <du-table-pro model-name="auditbo" :height="0" max-height="400" :pagerable="false"
                url="/query/eabysh_kcrd_eacourserecognition_cxshlb" />
        </du-tab-pane>
        <template #extra>
            123
        </template>
    </du-tabs>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
defineOptions({ name: 'Mtsh' })
import { DuButton, DuTablePro, DuTabs, DuTabPane } from '@du/pc-ui';
import { onMounted, ref } from 'vue';
import type { QuerySetting } from '@du/pc-ui';

const activeTab = ref("tab1");
const querySetting = ref<QuerySetting>([
    // {
    //     builder: "include", builder_display: "", caption: "输入框", linkOpt: "and", name: "text", value: "123"
    //     , value_display: undefined,
    // }
]);

const router = useRouter()

function onAdd() {
    router.push({ name: 'shxq' });
}
onMounted(() => {
    debugger
})

</script>
