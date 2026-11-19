<template>
    <du-tabs v-model="activeTab">
        <du-tab-pane name="tab1" label="Tab 1">123</du-tab-pane>
        <du-tab-pane name="tab2" label="Tab 2">444</du-tab-pane>
    </du-tabs>
</template>
<script setup lang="ts">
defineOptions({ name: 'Gzsz' })
import { DuTabs, DuTabPane } from '@du/pc-ui';
import { ref } from 'vue';

const activeTab = ref("tab1");
</script>
