import DuSelect from "./index.vue";
import type { SelectProps } from 'element-plus'

export type DuSelectProps = {
    /**
     * 选中项绑定值
     */
    modelValue?: SelectProps['modelValue'];
    /**
     * 选中项显示的名称
     */
    modelLabel?: string | string[];
    /**
     * 是否只读
     */
    readonly?: boolean;
    /**
     * 是否多选
     */
    multiple?: SelectProps['multiple'];
    /**
     * 选项的数据源， value 的 key 和 label 和  disabled可以通过 props自定义.
     */
    options?: SelectProps['options'];
    /**
     * 请求数据的接口地址
     */
    url?: string;
    /**
     * 配置选项的属性
     */
    props?: SelectProps['props'];
    /**
     * 作为 value 唯一标识的键名，绑定值为对象类型时必填
     */
    valueKey?: SelectProps['valueKey'];
    /**
     * 输入框尺寸
     */
    size?: SelectProps['size'];
    /**
     * 是否可清空
     */
    clearable?: SelectProps['clearable'];
    /**
     * 多选时是否将选中值按文字的形式展示
     */
    collapseTags?: SelectProps['collapseTags'];
    /**
     * 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。要使用此属性，collapse-tags属性必须设定为 true
     */
    collapseTagsTooltip?: SelectProps['collapseTagsTooltip'];
    /**
     * 折叠标签工具提示的配置对象。要使用此项， collapse-tags 和 collapse-tags-tooltip 必须为 true
     */
    tagTooltip?: SelectProps['tagTooltip'];
    /**
     * multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数，为 0 则不限制
     */
    multipleLimit?: SelectProps['multipleLimit'];
    /**
     * 原生 input 的 id
     */
    id?: SelectProps['id'];
    /**
     * Select 输入框的原生 name 属性
     */
    name?: SelectProps['name'];
    /**
     * tooltip 主题，内置了 dark / light 两种
     */
    effect?: SelectProps['effect'];
    /**
     * Select 输入框的原生 autocomplete 属性
     */
    autocomplete?: SelectProps['autocomplete'];
    /**
     * 占位符，默认为“Select”
     */
    placeholder?: SelectProps['placeholder'];
    /**
     * Select 组件是否可筛选
     */
    filterable?: SelectProps['filterable'];
    /**
     * 是否允许用户创建新条目，当filterable设置为 true 时才会生效
     */
    allowCreate?: SelectProps['allowCreate'];
    /**
     * 自定义筛选方法，接收两个参数：输入的查询字符串和当前选项对象，返回布尔值
     */
    filterMethod?: SelectProps['filterMethod'];
    /**
     * 其中的选项是否从服务器远程加载
     */
    remote?: SelectProps['remote'];
    /**
     * 远程搜索时的防抖延迟（以毫秒为单位）
     */
    debounce?: SelectProps['debounce'];
    /**
     * 当输入值发生变化时触发的函数。它的参数就是当前的输入值。当filterable设置为 true 时才会生效
     */
    remoteMethod?: SelectProps['remoteMethod'];
    /**
     * 远程搜索方法显示后缀图标
     */
    remoteShowSuffix?: SelectProps['remoteShowSuffix'];
    /**
     * 是否正在从远程获取数据
     */
    loading?: SelectProps['loading'];
    /**
     * 从服务器加载数据时显示的文本，默认为“Loading”
     */
    loadingText?: SelectProps['loadingText'];
    /**
     * 搜索条件无匹配时显示的文字，也可以使用 empty 插槽设置，默认是 “No matching data'”
     */
    noMatchText?: SelectProps['noMatchText'];
    /**
     * 无选项时显示的文字，也可以使用 empty 插槽设置自定义内容，默认是 “No data”
     */
    noDataText?: SelectProps['noDataText'];
    /**
     * 为 Select 下拉菜单和标签提示设置自定义类名
     */
    popperClass?: SelectProps['popperClass'];
    /**
     * 为 Select 下拉菜单和标签提示设置自定义样式
     */
    popperStyle?: SelectProps['popperStyle'];
    /**
     * 当 multiple 和 filterable被设置为 true 时，是否在选中一个选项后保留当前的搜索关键词
     */
    reserveKeyword?: SelectProps['reserveKeyword'];
    /**
     * 是否在输入框按下回车时，选择第一个匹配项。需配合 filterable 或 remote 使用
     */
    defaultFirstOption?: SelectProps['defaultFirstOption'];
    /**
     * 是否使用 teleport。设置成 true则会被追加到 append-to 的位置
     */
    teleported?: SelectProps['teleported'];
    /**
     * 下拉框挂载到哪个 DOM 元素
     */
    appendTo?: SelectProps['appendTo'];
    /**
     * 当下拉选择器未被激活并且persistent设置为false，选择器会被删除。
     */
    persistent?: SelectProps['persistent'];
    /**
     * 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单
     */
    automaticDropdown?: SelectProps['automaticDropdown'];
    /**
     * 自定义清空图标
     */
    clearIcon?: SelectProps['clearIcon'];
    /**
     * 下拉框的宽度是否与输入框相同
     */
    fitInputWidth?: SelectProps['fitInputWidth'];
    /**
     * 自定义后缀图标组件
     */
    suffixIcon?: SelectProps['suffixIcon'];
    /**
     * 标签类型
     */
    tagType?: SelectProps['tagType'];
    /**
     * 标签的效果
     */
    tagEffect?: SelectProps['tagEffect'];
    /**
     * 是否触发表单验证
     */
    validateEvent?: SelectProps['validateEvent'];
    /**
     * 下拉面板偏移量
     */
    offset?: SelectProps['offset'];
    /**
     * 是否显示下拉箭头
     */
    showArrow?: SelectProps['showArrow'];
    /**
     * 下拉框的弹出位置
     */
    placement?: SelectProps['placement'];
    /**
     * dropdown 可用的 positions 请查看popper.js 文档
     */
    fallbackPlacements?: SelectProps['fallbackPlacements'];
    /**
     * 需要显示的 Tag 的最大数量只有当 collapse-tags 设置为 true 时才会生效。
     */
    maxCollapseTags?: SelectProps['maxCollapseTags'];
    /**
     * popper.js 的配置项
     */
    popperOptions?: SelectProps['popperOptions'];
    /**
     * 等价于原生 input aria-label 属性
     */
    ariaLabel?: SelectProps['ariaLabel'];
    /**
     * 组件的空值配置， 参考config-provider
     */
    emptyValues?: SelectProps['emptyValues'];
    /**
     * 清空选项的值
     */
    valueOnClear?: SelectProps['valueOnClear'];
    /**
     * 下拉菜单显示/消失时后缀图标的动画
     */
    suffixTransition?: boolean;
    /**
     * input 的 tabindex
     */
    tabindex?: SelectProps['tabindex'];











}

export type DuSelectEmit = {
    (e: "update:modelValue", value: DuSelectProps["modelValue"]): void;
    (e: "update:modelLabel", value: DuSelectProps["modelLabel"]): void;
    (e: 'change', value: DuSelectProps["modelValue"], label: DuSelectProps["modelLabel"]): void
};

export type DuSelectState = {
    options: { value: string; label: string }[];
    loaded: boolean;
    loading: boolean;
}

export type DuSelectExpose = {
};

export default DuSelect;