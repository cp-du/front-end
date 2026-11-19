<template>
    <Teleport to="body">
        <div v-if="visible" class="office-viewer-model">
            <div class="office-file-content" v-loading="loading">
                <vue-office-excel v-if="fileType === 'excel'" :src="officeUrl" @rendered="onRendered"
                    @error="onRenderError" />
                <vue-office-docx v-if="fileType === 'word'" :src="officeUrl" @rendered="onRendered"
                    @error="onRenderError" />
                <vue-office-pptx v-if="fileType === 'ppt'" :src="officeUrl" @rendered="onRendered"
                    @error="onRenderError" />
                <vue-office-pdf v-if="fileType === 'pdf'" :src="officeUrl" @rendered="onRendered"
                    @error="onRenderError" />
            </div>

            <div class="close-button" @click="hide">
                <span class="iconfont-base">&#xe7af;</span>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useViewer } from 'v-viewer'
import { ElMessage } from 'element-plus'
import VueOfficeDocx from '@vue-office/docx/lib/v3'
import '@vue-office/docx/lib/v3/index.css'
import VueOfficeExcel from '@vue-office/excel/lib/v3'
import '@vue-office/excel/lib/v3/index.css'
import VueOfficePptx from '@vue-office/pptx/lib/v3'
import VueOfficePdf from '@vue-office/pdf/lib/v3'
import type { DuViewerProps, DuViewerExpose } from './index.js'
import { ViewableTypes } from './const.js'

defineOptions({ name: 'DuViewer' })


const props = withDefaults(defineProps<DuViewerProps>(), {
})

const images = ref<{ src: string, 'data-source': string }[]>([])

const officeUrl = ref('')
const visible = ref(false)
const loading = ref(false)
const fileType = ref('')

const { show: showImageViewer, hide: hideImageViewer } = useViewer({ images, options: props })


function show(url: string, type: string) {
    if (!url || !type) return
    fileType.value = type
    if (!ViewableTypes.includes(type)) {
        ElMessage.warning('该文件类型不支持预览')
        return
    }

    loading.value = true

    switch (type) {
        case 'image':
            images.value = [{ src: url, 'data-source': url }]
            showImageViewer()
            break
        case 'pdf':
        case 'word':
        case 'excel':
        case 'ppt':
            officeUrl.value = url
            visible.value = true
            break

        case 'text':
        case 'markdown':
        case 'editor':
        case 'video':
        case 'audio':
        case 'zip':
        case 'ext':
            break
        default:
            ElMessage.warning('该文件类型不支持预览')
            return
    }

}



function hide() {
    hideImageViewer()
    visible.value = false
    officeUrl.value = ''
    fileType.value = ''
}

function onRendered() {
    loading.value = false
}
function onRenderError() {
    ElMessage.error('文件渲染失败')
}

defineExpose<DuViewerExpose>({
    show,
    hide
})
</script>

<style lang="scss" scoped>
.office-viewer-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    .office-file-content {
        width: 80%;
        height: 80%;
        overflow-y: auto;
    }
}

.close-button {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50% 0 0 50%;
    cursor: pointer;
    height: 40px;
    width: 40px;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    transition: background-color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;


    span {
        color: #fff;
        font-size: 20px;
    }
}
</style>
