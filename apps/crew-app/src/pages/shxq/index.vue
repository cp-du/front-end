<template>
    <du-page title="审核详情" :backable="true">

        <du-form-pro modelName="auditbo" :disabled="true">
        </du-form-pro>


        <template #footer>
            <el-button type="primary">提交</el-button>
            <el-button type="default">关闭</el-button>
        </template>
    </du-page>
</template>
<script setup lang="ts">
defineOptions({ name: 'Shxq' })
import { DuFormPro, DuPage } from '@du/pc-ui';
</script>
