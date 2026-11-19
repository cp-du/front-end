<template>
    <div class="du-tool-bar">
        <div class="left-panel">
            <slot name="left"></slot>
        </div>
        <div class="right-panel">
            <slot name="right"></slot>
            <du-button :icon="Refresh" type="primary" text @click="() => emits('refresh')"
                v-if="props.refreshable"></du-button>
            <du-button :icon="Upload" type="primary" text v-if="props.uploadable"
                @click="() => emits('upload')"></du-button>
            <du-button :icon="Download" type="primary" text v-if="props.downloadable"
                @click="() => emits('download')"></du-button>
            <du-button :icon="Operation" type="primary" text v-if="props.operable"
                @click="() => emits('operate')"></du-button>
            <du-button :icon="Printer" type="primary" text v-if="props.printable"
                @click="() => emits('print')"></du-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Upload, Refresh, Download, Operation, Printer } from '@element-plus/icons-vue'
import DuButton from '@/components/base/du-button'
import type { DuToolBarProps, DuToolBarEmit } from './index'

defineOptions({ name: 'DuToolBar' })

const props = withDefaults(defineProps<DuToolBarProps>(), {
    refreshable: true,
    uploadable: false,
    downloadable: false,
    operable: true,
    printable: false,
})

const emits = defineEmits<DuToolBarEmit>();
</script>

<style scoped lang="scss">
.du-tool-bar {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 16px;

    .left-panel {
        flex: 1 1 0;
    }

    .right-panel {
        flex: 0 0 auto;
    }
}
</style>
