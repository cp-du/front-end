<template>
    <el-form ref="formRef" class="du-search-pro" v-bind="elFormProps" :rules="rules" :model="searchData"
        :style="searchStyle">
        <template v-for="index in renderSpans" :key="index">

            <el-form-item class="du-search-item" :prop="effectControls[index - 1].name"
                :style="{ 'grid-column': `span ${getControlProperty(effectControls[index - 1], 'span', 'search') || 1}` }"
                v-if="effectControls[index - 1]" :label="effectControls[index - 1].caption">
                <slot :name="effectControls[index - 1].name" :control="effectControls[index - 1]"
                    :form-data="searchData">
                    <control-widget :modelValue="searchData[effectControls[index - 1].name]"
                        @update:modelValue="(val) => setSearchDataByKey(effectControls[index - 1].name, val)"
                        :modelLabel="getDisplayName(`${effectControls[index - 1].name}_name`)"
                        @update:modelLabel="(val) => setDisplayName(val, `${effectControls[index - 1].name}_name`)"
                        :form-data="searchData" @change="onControlChange" mode="search"
                        :control="effectControls[index - 1]" />
                </slot>
            </el-form-item>

            <div v-else-if="index !== operationPositionSpan" class="du-search-item du-search-item__placeholder">
            </div>

            <div v-else-if="index === operationPositionSpan" class="du-search-item du-search-item__operation">
                <du-button type="default" @click="openCustomFieldDialog">
                    <span class="iconfont-base">&#xe788;</span>
                </du-button>
                <du-button type="primary" @click="onSearch">搜 索</du-button>
                <du-button type="default" @click="onReset">重 置</du-button>
                <!-- <du-button v-if="expendAble" text type="primary" link :icon="expendState ? ArrowDownBold : ArrowUpBold"
                    @click="() => expendState = !expendState"></du-button> -->
            </div>
        </template>
    </el-form>
    <custom-field ref="customFieldDialog" :exist-controls="existControls" @confirm="onCheckFieldsConfirm" />
</template>
<script setup lang="ts">
import { computed, watch, ref, useTemplateRef } from 'vue';
import { ElForm, ElFormItem, type FormRules, type FormItemRule } from 'element-plus'
import DuButton from '@/components/base/du-button';
import ControlWidget from '../../controls/control-widget/index.vue'
import type { DuSearchProProps, DuSearchProEmit, SearchData } from './index'
import { getControlProperty } from '@/utils/index'
import type { SearchControl, QuerySetting, FuzzySearchquerySetting } from '@/typings/model.ts'
import { cloneDeep } from 'es-toolkit';
import { useModelHook } from '@/hooks/index'
import CustomField from "../custom-field/index.vue";

defineOptions({
    name: 'DuSearchPro'
})


const props = withDefaults(defineProps<DuSearchProProps>(), {
    column: 'auto',
    minColumnWidth: '200px',
})

const customFieldDialog = useTemplateRef<InstanceType<typeof CustomField>>('customFieldDialog');
/**
 * 打开自定义字段对话框
 */
function openCustomFieldDialog() {
    customFieldDialog.value?.open?.(visibleControls.value)
}

/**
 * 自定义字段确定
 * @param close 关闭对话框的回调函数
 */
async function onCheckFieldsConfirm(checkedFields: any[], close: () => void) {
    existControls.value.forEach(ctl => {
        const findControl = checkedFields.find(f => f.name === ctl.name)
        setModelProps(ctl.name, {
            'search.hidden': !findControl,
        })
    })


    const orderMap = new Map(
        checkedFields.map((field, index) => [field.name, index])
    )

    const fallbackIndex = checkedFields.length

    controls.value = [...controls.value].sort((a, b) => {
        return (orderMap.get(a.name) ?? fallbackIndex)
            - (orderMap.get(b.name) ?? fallbackIndex)
    })

    close?.()
}

const elFormProps = computed(() => ({
    size: props.size,
    labelWidth: props.labelWidth
}))

const emits = defineEmits<DuSearchProEmit>();

const searchStyle = computed(() => {

    return {
        'grid-template-columns': props.column === 'auto' ? `repeat(auto-fit, minmax(${props.minColumnWidth}, 1fr))` : `repeat(${props.column}, minmax(0, 1fr))`
    }
})

const formRef = useTemplateRef<InstanceType<typeof ElForm>>('formRef')

/**
 * 计算表单的网格列数
 */
const gridColumnCount = computed(() => {
    if (!formRef.value?.$el) return 0;
    const style = getComputedStyle(formRef.value.$el)
    const tracks = style.gridTemplateColumns
    // 分割，过滤空字符串
    return tracks.split(/\s+/).filter(Boolean).length
})

/**
 * 计算占位的列跨度
 */
// const placeholderSpans = computed(() => {
//     return gridColumnCount.value * props.row - 1 // - 1是给操作列留位置 
// })
/**
 * 获取controls
 */
const { controls, setModelProps } = useModelHook<SearchControl>(props)
/**
 * 获取存在的controls
 */
const existControls = computed(() => {
    return controls.value.filter(ctl => !getControlProperty<SearchControl>(ctl, 'omitted', 'search'))
})

const visibleControls = computed(() => {
    return existControls.value.filter(ctl => !getControlProperty<SearchControl>(ctl, 'hidden', 'search'))
})
/**
 * 获取存在的controls
 * 模糊搜索也算
 */
const visibleWithFuzzyControls = computed(() => {
    let visibles = cloneDeep(visibleControls.value)

    const fuzzySearchControls = visibles.filter(ctl => getControlProperty(ctl, 'fuzzySearch', 'search'))
    if (fuzzySearchControls.length) {
        // 加上模糊搜索
        visibles = [{
            name: "__fuzzy",
            caption: "关键字",
            builder: "include",
            fuzzySearch: true,
            "search.type": "input",
            fuzzySearchField: fuzzySearchControls.map(item => item.name),
            controlProps: {
                placeholder: fuzzySearchControls.map(item => item.caption).join('/'),
                clearable: true,
            }

        }, ...(visibles.filter(ctl => !getControlProperty(ctl, 'fuzzySearch', 'search')))]
    };
    return visibles
})

/**
 * 展开状态
 */
// const expendState = ref(false)

/**
 * 是否显示展开折叠
 */
// const expendAble = computed(() => {
//     const spans = getControlsSpans(visibleWithFuzzyControls.value)
//     return spans > placeholderSpans.value
// })

/**
 * 获取当前显示的Controls
 */
const effectControls = computed(() => {
    return [...visibleWithFuzzyControls.value]

    // if (!expendAble.value || expendState.value) {
    //     return visibles
    // }

    // let totalSpans = 0
    // for (let i = 0; i < visibles.length; i++) {
    //     const ctl = visibles[i]
    //     totalSpans += getControlsSpans([ctl])
    //     if (totalSpans > placeholderSpans.value) {
    //         visibles = visibles.slice(0, i)
    //         break;
    //     }
    // }

    // return visibles
})


/**
 * 获取Controls的总列跨度
 */

// function getControlsSpans(controls: SearchControl[]) {
//     return controls.reduce((total, ctl) => {
//         return total + (getControlProperty<SearchControl>(ctl, 'span', 'search') as number || 1)
//     }, 0)
// }

/**
 * 计算显示的Controls的列跨度
 */
const effectControlsSpan = computed(() => {

    return effectControls.value.reduce((total, ctl) => {
        return total + (getControlProperty<SearchControl>(ctl, 'span', 'search') as number || 1)
    }, 0)
})

/**
 * 计算渲染的列跨度
 */
const renderSpans = computed(() => {
    // 如果当前显示的Controls的列跨度正好等于gridColumnCount，则渲染两行，否则按实际计算行数
    const rows = effectControlsSpan.value === gridColumnCount.value ? 2 : Math.ceil((effectControlsSpan.value / gridColumnCount.value) || 0)
    return rows * gridColumnCount.value
})

const operationPositionSpan = computed(() => {
    return renderSpans.value - (effectControlsSpan.value - effectControls.value.length)
})

/**
 * 校验规则
 */
const rules = computed(() => {
    const rules: FormRules = {}
    visibleControls.value.forEach(ctl => {
        const rulesArray: FormItemRule[] = []
        const type = getControlProperty<SearchControl>(ctl, 'type', 'form') as string
        const trigger = ['input', 'number'].includes(type) ? 'blur' : 'change'
        if (getControlProperty(ctl, 'required', 'form')) {
            rulesArray.push({ required: true, message: `${ctl.caption} is required`, trigger: trigger })
        }
        const pattern = getControlProperty(ctl, 'pattern', 'form') as RegExp
        if (pattern) {
            rulesArray.push({ pattern: pattern, message: `${ctl.caption} is invalid`, trigger: trigger })
        }
        rules[ctl.name] = rulesArray
    })

    return rules
})


const searchData = ref<SearchData>({})

function setSearchDataByKey(key: string, value: unknown) {
    setSearchData({
        ...searchData.value,
        [key]: value
    })
}
function setSearchData(val: SearchData) {
    searchData.value = val
    let querySetting: QuerySetting = []
    const fuzzySearchquerySetting: FuzzySearchquerySetting = []

    for (let k in searchData.value) {
        if (k.includes('_name')) continue;
        if (searchData.value[k] !== undefined || searchData.value[k] !== null || searchData.value[k] !== '') {

            const ctl = visibleWithFuzzyControls.value.find(ctl => ctl.name === k)
            if (k === '__fuzzy') {
                const fuzzySearchField = ctl?.fuzzySearchField || []

                fuzzySearchField.forEach(f => {
                    const fctl = controls.value.find(ctl => ctl.name === f)

                    if (fctl) {
                        fuzzySearchquerySetting.push({
                            name: f,
                            caption: fctl?.caption ?? "",
                            linkOpt: "or",
                            value: searchData.value[k] as string,
                            value_display: searchData.value[k + '_name'] as string,
                            builder: fctl?.builder ?? "include",
                            builder_display: fctl?.builder_display ?? ""
                        })
                    }
                })
            } else {
                querySetting.push({
                    name: k,
                    caption: ctl?.caption ?? "",
                    linkOpt: "and",
                    value: searchData.value[k] as string,
                    value_display: searchData.value[k + '_name'] as string,
                    builder: ctl?.builder ?? "include",
                    builder_display: ctl?.builder_display ?? ""
                })
            }

        }
    }
    if (fuzzySearchquerySetting.length) {
        fuzzySearchquerySetting[0].linkOpt = 'and'
        querySetting = [fuzzySearchquerySetting, ...querySetting]

    }

    emits("update:modelValue", querySetting)
}

function formatSearchData(querySetting: QuerySetting, data: SearchData) {
    for (let i = 0; i < querySetting.length; i++) {
        const item = querySetting[i]
        if (Array.isArray(item)) {
            formatSearchData(item, data)
        } else {
            if (item.value !== undefined || item.value !== null || item.value !== '') {
                const ctl = controls.value.find(c => c.name === item.name)
                if (ctl?.fuzzySearch) {
                    data['__fuzzy'] = item.value
                } else {
                    data[item.name] = item.value
                }

            }
        }

    }
}

function getDisplayName(key: string): string | undefined {
    return typeof searchData.value[key] === 'string' ? searchData.value[key] : undefined
}
function setDisplayName(val: string | undefined, key: string) {
    setSearchData({ ...searchData.value, [key]: val })
}

let initForce = false
let initValue: SearchData = {}
watch(() => props.modelValue, (newVal) => {
    if (newVal !== undefined && newVal.length) {
        const formData: SearchData = {}
        formatSearchData(newVal, formData)
        searchData.value = cloneDeep(formData ?? {})
        if (!initForce && !props.resetInitValue) {
            initForce = true
            initValue = cloneDeep(formData ?? {})
        }
    }
}, { immediate: true, deep: true });
function onControlChange() { }



function onSearch() {
    formRef.value?.validate((valid) => {
        if (!valid) {
            return
        }
        emits('search')
    })
}

function onReset() {
    if (!props.resetInitValue) {
        searchData.value = cloneDeep(initValue ?? {})
        emits('reset')
        emits('search')
        return
    }
    searchData.value = {}
    emits('reset')
    emits('search')
}

</script>

<style scoped lang="scss">
.du-search-pro {
    display: grid;
    column-gap: var(--space-4, 16px);
    background: linear-gradient(180deg, var(--el-color-info-light-9), hsla(0, 0%, 100%, 0));
    padding: var(--space-4, 16px);
    border-radius: var(--radius-md);

    .du-search-item {
        &.du-search-item__operation {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
        }

        display: flex;
        align-items: center;
    }
}
</style>
