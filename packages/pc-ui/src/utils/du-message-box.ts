
import { ElMessageBox, type ElMessageBoxOptions } from 'element-plus'
import { h } from 'vue'

const DefaultOptions: ElMessageBoxOptions = {
    confirmButtonText: '确定',
    customClass: 'du-message-box',
    showCancelButton: false,
    dangerouslyUseHTMLString: true
}
const TYPE_ICON_MAP = {
    primary: '&#xe8e4;',
    error: '&#xe7b8;',
    warning: '&#xe73a;',
    success: '&#xe7ba;'
}
export class DuMessageBox {
    constructor() { }
    alert(message: string, title: string, options: any) {
        // Implement custom alert logic here
        console.log(`Alert: ${title} - ${message}`, options)
    }

    static async confirm(message: string, title: string, options: ElMessageBoxOptions) {
        const finalOptions = { ...DefaultOptions, ...options }
        finalOptions.type = undefined



        function renderContent({ close }: { close: () => void }) {
            return h('div', { className: "du-message-box__container" }, [
                h('div', { className: "du-message-box__header" }, [
                    options.type ? h('span', { className: `du-message-box__icon iconfont-base ${options.type}`, innerHTML: TYPE_ICON_MAP[options.type as keyof typeof TYPE_ICON_MAP] }) : null,
                    h('p', { className: "du-message-box__title" }, title),
                    h('span', { className: "du-message-box__close iconfont-base", innerHTML: "&#xe737;", onClick: close })
                ]),
                h('div', { className: "du-message-box__content" }, message)
            ])
        }
        return ElMessageBox.confirm(
            renderContent,
            undefined,
            finalOptions
        )

    }
}