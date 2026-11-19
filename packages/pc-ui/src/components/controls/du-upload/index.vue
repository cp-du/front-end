<template>
    <el-upload class="du-upload" v-bind="mergeProps($attrs, props)" :disabled="disabled" :headers="headers" name="files"
        :data="data" :action="action" :file-list="fileList" :on-exceed="onExceed" :before-upload="beforeUpload"
        :on-change="onChange" :on-success="onSuccess" :on-error="onError" :on-progress="onProgress">
        <du-button v-if="!props.readonly" :icon="Upload" :disabled="disabled" :loading="loading">
            点击上传
            <template v-if="props.limit">（{{ fileList.length }}/{{ props.limit }}）</template>
        </du-button>
        <template #tip>
            <div v-if="!props.readonly" class="el-upload__tip">{{ tip }}</div>
            <slot name="files" :files="fileList" :on-preview="onPreview" :on-download="onDownload"
                :on-remove="onRemove">
                <div class="file-list-content">
                    <div class="file-item" v-for="item in fileList" :key="item.id">
                        <span class="iconfont-base" v-html="getFileIcon(getFileType(item.name))"></span>
                        <span class="file-name">{{ item.name }}</span>
                        <du-button link class="action" v-if="fileCanView(getFileType(item.name))"
                            @click="onPreview(item)">
                            <span class="iconfont-base">&#xe7a1;</span>
                        </du-button>
                        <du-button link class="action" @click="onDownload(item)">
                            <span class="iconfont-base">&#xe7a7;</span>
                        </du-button>
                        <du-button v-if="!props.readonly" :disabled="props.disabled" link class="action"
                            @click="onRemove(item)">
                            <span class="iconfont-base">&#xe7ad;</span>
                        </du-button>

                    </div>
                </div>
            </slot>

        </template>
    </el-upload>

    <du-viewer ref="duViewer" :toolbar="false"></du-viewer>
</template>
<script setup lang="ts">
import { ref, watch, computed, mergeProps, useTemplateRef } from 'vue';
import { ElUpload, ElMessage, type UploadUserFile, type UploadRawFile, type UploadFile, type UploadFiles, type UploadProgressEvent } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import type { DuUploadProps, DuUploadEmits, FileItem, FileResponse } from './index.js'
import { store, Http } from '@du/utils'
import { PdfTypes, WordTypes, ExcelTypes, PptTypes, TextTypes, MarkdownTypes, EditorTypes, ImageTypes, VideoTypes, AudioTypes, ArchiveTypes, FileTypeIconMap, ViewableTypes } from './const.js'
import DuViewer from "../../feedback/du-viewer/index.js"
import DuButton from '@/components/base/du-button';

const http = new Http({ baseURL: '/api' })

defineOptions({ name: 'DuUpload' })
const action = '/api/attachment/upload'
const headers = {
    Authorization: 'Bearer ' + store.getStorage('accessToken')
}

const data = ref<{ token: string }>({ token: "" })


const props = withDefaults(defineProps<DuUploadProps>(), {
    autoUpload: true,
    showFileList: false,
    unit: 'KB'
})

const emits = defineEmits<DuUploadEmits>()

const disabled = computed(() => {
    return props.disabled || !!(props.limit && fileList.value.length >= props.limit)
})

const fileList = ref<FileItem[]>([])

const tip = computed(() => {
    let temp: string[] = []
    if (props.accept) {
        temp.push(`只能上传${props.accept}文件`)
    }
    if (props.size && props.unit) {
        temp.push(`单个文件大小不能超过${props.size}${props.unit}。`)
    }
    return temp.join('，')
})



watch(() => props.modelValue, (newValue) => {
    data.value.token = newValue || new Date().getTime().toString()
    if (newValue) {
        http.get<FileResponse>(`/attachment/query?token=${newValue}`).then(res => {
            if (res.data) {
                fileList.value = res.data?.files || []
            }

        })
    }
}, {
    deep: true,
    immediate: true
})

const loading = ref(false)

/**
 * 超出文件数量限制回调
 * @param files File[] 本次选择的文件列表
 * @param fileList UploadUserFile[] 当前已选择的文件列表
 * @returns void
 */
function onExceed(files: File[], fileList: UploadUserFile[]) {
    ElMessage.warning(`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${fileList.length} 个文件`);
    if (props.onExceed) props.onExceed(files, fileList)
}

/**
 * 上传前回调
 * @param file UploadRawFile 当前上传的文件
 * @returns boolean 是否允许上传
 */
function beforeUpload(file: UploadRawFile) {
    const { size } = file
    if (props.beforeUpload) {
        return props.beforeUpload(file)
    }
    if (props.size && props.unit) {
        const maxSize = props.size * (props.unit === 'KB' ? 1024 : 1)
        if (size > maxSize) {
            ElMessage.warning(`单个文件大小不能超过${props.size}${props.unit}。`)
            return false
        }
    }
    loading.value = true
    return true
}

/**
 * 上传成功回调
 * @param response { code: string, data?: FileResponse } 上传响应对象
 * @param file UploadFile 当前上传的文件
 * @param uploadFiles UploadFiles 当前上传的文件列表
 * @returns void
 */
function onSuccess(response: { code: string, data?: FileResponse }, file: UploadFile, uploadFiles: UploadFiles) {
    loading.value = false
    if (response && response.code === '0' || response.data) {
        fileList.value = response.data?.files || []
        if (props.onSuccess) {
            props.onSuccess(response, file, uploadFiles)
        }
    } else {
        ElMessage.error('上传失败')
        props.onError && props.onError({
            name: 'UploadError',
            message: '上传失败',
            stack: ''
        }, file, uploadFiles)
    }
}

/**
 * 上传失败回调
 * @param err Error 上传错误对象
 * @param file UploadFile 当前上传的文件
 * @param uploadFiles UploadFiles 当前上传的文件列表
 * @returns void
 */
function onError(err: Error, file: UploadFile, uploadFiles: UploadFiles) {
    loading.value = false
    ElMessage.error('上传失败')
    if (props.onError) {
        props.onError(err, file, uploadFiles)
    }
}

/**
 * 上传进度回调
 * @param event UploadProgressEvent 上传进度事件
 * @param file UploadFile 当前上传的文件
 * @param uploadFiles UploadFiles 当前上传的文件列表
 * @returns void
 */
function onProgress(event: UploadProgressEvent, file: UploadFile, uploadFiles: UploadFiles) {
    const percent = event.percent
    loading.value = percent < 100
    if (props.onProgress) {
        props.onProgress(event, file, uploadFiles)
    }
}

/**
 * 删除文件项
 * @param item FileItem 要删除的文件项
 * @returns void
 */
function onRemove(item: FileItem) {
    if (props.readonly || props.disabled) return
    if (props.beforeRemove && !props.beforeRemove(item, fileList.value)) {
        return
    }
    http.post<FileResponse>('/attachment/delete', { token: data.value.token, fileIds: [item.id] }).then(res => {
        if (res.code === '0' && res.data) {
            fileList.value = res.data?.files || []
        } else {
            ElMessage.error('删除失败')
        }
    }).catch(() => {
        ElMessage.error('删除失败')
    })

}

/**
 * 下载文件
 * @param item FileItem 要下载的文件项
 * @returns void
 */
function onDownload(item: FileItem) {
    if (item.url) {
        const a = document.createElement('a')
        a.href = item.url
        a.download = item.name // 跨域时这个属性无效！
        // a.target = '_blank' // 兜底，不行就新开预览页
        document.body.appendChild(a)
        a.click()
        a.remove()
    }
}

/**
 * 获取文件类型
 * @param fileName 文件名
 * @returns 文件类型，如 'image', 'video', 'audio', 'ext'
 */
function getFileType(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (!ext) return ''

    if (PdfTypes.includes(ext)) return 'pdf'
    if (WordTypes.includes(ext)) return 'word'
    if (ExcelTypes.includes(ext)) return 'excel'
    if (PptTypes.includes(ext)) return 'ppt'
    if (TextTypes.includes(ext)) return 'text'
    if (MarkdownTypes.includes(ext)) return 'markdown'
    if (EditorTypes.includes(ext)) return 'richtext'

    if (ImageTypes.includes(ext)) return 'image'
    if (VideoTypes.includes(ext)) return 'video'
    if (AudioTypes.includes(ext)) return 'audio'
    if (ArchiveTypes.includes(ext)) return 'zip'
    return 'ext'
}

/**
 * 获取文件icon
 * @param fileType 文件类型
 * @returns icon string
 */
function getFileIcon(fileType: string) {
    const type = fileType as keyof typeof FileTypeIconMap
    return FileTypeIconMap[type] || FileTypeIconMap['unknown']
}

/**
 * 判断文件是否可以预览
 * @param fileType 文件类型
 * @returns 是否可以预览
 */
function fileCanView(fileType: string) {
    return ViewableTypes.includes(fileType)
}

const duViewerRef = useTemplateRef<InstanceType<typeof DuViewer>>('duViewer')
function onPreview(item: FileItem) {
    if (fileCanView(getFileType(item.name)) && item.url) {
        duViewerRef.value?.show(item.url, getFileType(item.name))
    } else {
        console.error('该文件无法预览')
    }
}

function onChange(file: UploadFile, fileList: UploadFiles) {
    if (props.onChange) {
        props.onChange(file, fileList)
    }
    emits('change', file, fileList)
}
</script>
<style scoped lang="scss">
.du-upload {
    width: 100%;

    &::v-deep(.el-upload) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
}

.file-list-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    .file-item {
        display: flex;
        align-items: center;
        gap: var(--space-2, 8px);
        background-color: var(--el-fill-color-light);
        border-radius: var(--radius-sm, 4px);
        padding: var(--space-2, 8px);
        line-height: normal;


        .file-name {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            color: var(--el-text-color-regular);

        }

        .action {
            margin: 0 !important;
        }
    }
}
</style>