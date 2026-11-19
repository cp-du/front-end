declare module '@vue-office/*' {
    import type { DefineComponent } from 'vue'
    const VueOfficeComponent: DefineComponent<{ src: string }, {}, any>
    export default VueOfficeComponent
}
