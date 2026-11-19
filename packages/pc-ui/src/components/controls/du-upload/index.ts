import type { UploadProps, UploadFile, UploadFiles } from 'element-plus'
import DuUpload from './index.vue'

export interface FileItem extends UploadFile {
    id: string;
    type: string
}

export interface FileResponse {
    token: string;
    files: FileItem[]
}

export type DuUploadProps = UploadProps & {
    /**
     * token，用于标识上传的文件所属的会话
     */
    modelValue?: string;
    /**
     * 单个文件的大小限制，配合 unit 使用
     */
    size?: number;
    /**
     * 单个文件大小的单位，可选值为 'KB'、'MB' 或 'GB'
     */
    unit?: 'KB' | 'MB' | 'GB';
    /**
     * 是否只读，禁止上传和删除文件
     */
    readonly?: boolean;
}

export type DuUploadEmits = {
    (e: 'change', file: UploadFile, fileList: UploadFiles): void
}
export default DuUpload