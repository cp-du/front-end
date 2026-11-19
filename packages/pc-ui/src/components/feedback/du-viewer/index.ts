import DuViewer from './index.vue'

export type DuViewerProps = {
    toolbar?: boolean;
    navbar?: boolean;
}

export type DuViewerExpose = {
    show: (url: string, type: string) => void
    hide: () => void
}
export default DuViewer