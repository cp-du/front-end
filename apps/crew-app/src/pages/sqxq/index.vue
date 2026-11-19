<template>
    <du-page title="审核详情" :backable="true">

        <du-form-pro modelName="auditbo" :readonly="readonly">
        </du-form-pro>


        <template #footer>
            <el-button type="primary" v-if="!readonly" @click="onSubmit">提交</el-button>
            <el-button type="default">关闭</el-button>
        </template>
    </du-page>
</template>
<script setup lang="ts">
defineOptions({ name: 'Sqxq' })
import { DuFormPro, DuPage } from '@du/pc-ui';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useRefresh } from '@du/utils';
const route = useRoute()
const router = useRouter()

const readonly = ref(false)
const { requestRefresh } = useRefresh()

onMounted(() => {
    readonly.value = route.query.readonly === '1'
})
function onSubmit() {
    requestRefresh()
    router.back()

}
</script>
