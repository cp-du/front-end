<template>
    <el-form ref="formRef" :rules="rules" :class="['du-form-pro', { 'border': props.border }]"
        v-bind="mergeProps($attrs, props)" :model="formData" :style="formStyle">
        <template v-if="!props.groupable">
            <el-form-item v-if="!props.border" class="du-form-item" v-for="item in visibleControls" :key="item.name"
                :prop="item.name" :style="{ 'grid-column': `span ${item.span || 1}` }" :label="item.caption">
                <template #label="{ label }">
                    <slot :name="`label-${item.name}`">
                        {{ label }}
                        <el-tooltip v-if="item.description" :content="item.description">
                            <span class="iconfont-base">&#xe76a;</span>
                        </el-tooltip>
                    </slot>
                </template>
                <slot :name="item.name" :control="item" :form-data="formData">
                    <control-widget :modelValue="formData[item.name]"
                        @update:modelValue="(val) => setFormDataByField(item, val)"
                        :modelLabel="getDisplayName(`${item.name}_name`)"
                        @update:modelLabel="(val) => setDisplayName(val, `${item.name}_name`)" :form-data="formData"
                        @change="onControlChange" mode="form" :control="item" />
                </slot>
            </el-form-item>

            <el-descriptions v-else :column="column" border :label-width="labelWidth"
                :direction="props.labelPosition === 'top' ? 'vertical' : 'horizontal'">
                <el-descriptions-item v-for="item in visibleControls" :key="item.name"
                    :label-align="props.labelPosition === 'left' ? 'left' : 'right'"
                    :label-class-name="getControlProperty(item, 'required', 'form') ? 'is-required' : ''">
                    <template #label>
                        <slot :name="`label-${item.name}`" :label="item.caption">
                            {{ item.caption }}
                            <el-tooltip v-if="item.description" :content="item.description">
                                <span class="iconfont-base">&#xe76a;</span>
                            </el-tooltip>
                        </slot>
                    </template>
                    <el-form-item class="du-form-item" :prop="item.name"
                        :style="{ 'grid-column': `span ${item.span || 1}` }">
                        <slot :name="item.name" :control="item" :form-data="formData">
                            <control-widget :modelValue="formData[item.name]"
                                @update:modelValue="(val) => setFormDataByField(item, val)"
                                :modelLabel="getDisplayName(`${item.name}_name`)"
                                @update:modelLabel="(val) => setDisplayName(val, `${item.name}_name`)"
                                :form-data="formData" @change="onControlChange" mode="form" :control="item" />
                        </slot>
                        <template #error="{ error }">
                            <span class="border-custom-error">{{ error }}</span>
                        </template>
                    </el-form-item>
                </el-descriptions-item>
            </el-descriptions>

        </template>

        <template v-else>
            <div v-for="group in groupControls" :key="group.groupName" class="du-form-group">
                <du-title>{{ group.groupName }}</du-title>
                <div v-if="!props.border" class="du-form-group-content" :style="groupStyle">
                    <el-form-item class="du-form-item" v-for="item in group.controls" :key="item.name" :prop="item.name"
                        :style="{ 'grid-column': `span ${item.span || 1}` }" :label="item.caption">
                        <template #label="{ label }">
                            <slot :name="`label-${item.name}`">
                                {{ label }}
                                <el-tooltip v-if="item.description" :content="item.description">
                                    <span class="iconfont-base">&#xe76a;</span>
                                </el-tooltip>
                            </slot>
                        </template>
                        <slot :name="item.name" :control="item" :form-data="formData">
                            <control-widget :modelValue="formData[item.name]"
                                @update:modelValue="(val) => setFormDataByField(item, val)"
                                :modelLabel="getDisplayName(`${item.name}_name`)"
                                @update:modelLabel="(val) => setDisplayName(val, `${item.name}_name`)"
                                :form-data="formData" @change="onControlChange" mode="form" :control="item" />
                        </slot>


                    </el-form-item>
                </div>
                <el-descriptions v-else :column="column" border :label-width="borderLabelWidth"
                    :direction="props.labelPosition === 'top' ? 'vertical' : 'horizontal'">
                    <el-descriptions-item v-for="item in group.controls" :key="item.name"
                        :label-align="props.labelPosition === 'left' ? 'left' : 'right'"
                        :label-class-name="getControlProperty(item, 'required', 'form') ? 'is-required' : ''">
                        <slot :name="`label-${item.name}`" :label="item.caption">
                            {{ item.caption }}
                            <el-tooltip v-if="item.description" :content="item.description">
                                <span class="iconfont-base">&#xe76a;</span>
                            </el-tooltip>
                        </slot>
                        <el-form-item class="du-form-item" :prop="item.name"
                            :style="{ 'grid-column': `span ${item.span || 1}` }">
                            <slot :name="item.name" :control="item" :form-data="formData">
                                <control-widget :modelValue="formData[item.name]"
                                    @update:modelValue="(val) => setFormDataByField(item, val)"
                                    :modelLabel="getDisplayName(`${item.name}_name`)"
                                    @update:modelLabel="(val) => setDisplayName(val, `${item.name}_name`)"
                                    :form-data="formData" @change="onControlChange" mode="form" :control="item" />
                            </slot>
                            <template #error="{ error }">
                                <span class="border-custom-error">{{ error }}</span>
                            </template>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </template>
    </el-form>


</template>

<script lang="ts" setup>
import { mergeProps, computed, useTemplateRef, ref, watch } from 'vue'
import { ElTooltip, ElForm, ElFormItem, ElDescriptions, ElDescriptionsItem, type FormInstance, type FormRules } from 'element-plus'
import { cloneDeep } from 'es-toolkit';
import type { DuFormProProps, DuFormProEmit, FormData, DuFormProExpose } from './index'
import type { FormControl, Control } from '@/typings/model';
import DuTitle from '../../base/du-title/index.vue'
import ControlWidget from '../../controls/control-widget/index.vue'
import { getControlProperty } from '@/utils/index'
import { useModelHook } from '@/hooks/index'
import { useElementSize } from '@vueuse/core';


defineOptions({
    name: 'DuFormPro'
})

const emit = defineEmits<DuFormProEmit>();


const props = withDefaults(defineProps<DuFormProProps>(), {
    column: 'auto',
    minColumnWidth: '200px',
    scrollToError: true,
    labelPosition: 'left',
    showMessage: true
})

/**
 * 边框模式下 labelWidth = ‘auto’无效。
 * 如果传了labelWidth，则在边框模式下会覆盖默认的120px
 */
const borderLabelWidth = computed(() => {
    let labelWidth = props.labelWidth || 'auto'
    if (props.border) {
        labelWidth = labelWidth === 'auto' ? '120px' : labelWidth
    }
    return labelWidth
})

const formStyle = computed(() => {
    return {
        'display': props.groupable ? 'flex' : 'grid',
        'flex-direction': props.groupable ? 'column' : 'unset',
        'column-gap': props.groupable ? 'unset' : 'var(--space-4, 16px)',
        'row-gap': props.groupable ? 'var(--space-4, 16px)' : 'unset',
        'grid-template-columns': props.column === 'auto' ? `repeat(auto-fit, minmax(${props.minColumnWidth}, 1fr))` : `repeat(${props.column}, minmax(0, 1fr))`
    }
})
const groupStyle = computed(() => {
    return {
        'display': 'grid',
        'column-gap': 'var(--space-4, 16px)',
        'grid-template-columns': props.column === 'auto' ? `repeat(auto-fit, minmax(${props.minColumnWidth}, 1fr))` : `repeat(${props.column}, minmax(0, 1fr))`

    }
})

const formRef = useTemplateRef<FormInstance>('formRef')

const { width: formWidth } = useElementSize(() => formRef.value?.$el as HTMLElement)

const column = computed(() => {
    if (props.column !== 'auto') {
        return props.column
    }
    if (formWidth.value) {
        let maxControlsLen = visibleControls.value.length
        // 启用分组
        if (props.groupable) {
            // 获取分组中字段最多的分组长度
            maxControlsLen = groupControls.value.reduce((max, group) => Math.max(max, group.controls.length), 0)
        }
        // 无分组
        const totalMinWidth = parseInt(props.minColumnWidth) * maxControlsLen
        if (totalMinWidth <= formWidth.value) {
            return maxControlsLen
        }
        return Math.floor(formWidth.value / parseInt(props.minColumnWidth))
    }
    return 0
})


const { controls, setModelProps } = useModelHook<FormControl>({
    ...props,
    callback: () => {
        emit('model-done')
    }
})

/**
* 获取当前显示的Controls
*/
const visibleControls = computed(() => {
    const exitControls = controls.value.filter(ctl => !getControlProperty(ctl, 'omitted', 'form'))
    return exitControls.filter(ctl => !getControlProperty(ctl, 'hidden', 'form'))
})


/**
 * 进行分组
 */
const groupControls = computed(() => {
    const groups: { groupName: string, controls: FormControl[] }[] = []
    visibleControls.value.forEach(ctl => {
        const groupName = ctl.groupName || '其他'
        const group = groups.find(g => g.groupName === groupName)
        if (!group) {
            groups.push({ groupName, controls: [ctl] })
        } else {
            group.controls.push(ctl)
        }
    })

    return groups
})




const formData = ref<FormData>({})

watch(() => props.modelValue, (newVal) => {
    if (newVal !== undefined) {
        formData.value = cloneDeep(newVal ?? {})
    }
}, { immediate: true });

function setFormData(value: FormData) {
    formData.value = cloneDeep(value ?? {})
    emit("update:modelValue", formData.value)
}

function setFormDataByField(control: FormControl, value: unknown) {
    setFormData({ ...formData.value, [control.name]: value })
}

function getValue() {
    return cloneDeep(formData.value)
}

function setValue(value: FormData) {
    setFormData(value)
}
function getDisplayName(key: string): string | undefined {
    return typeof formData.value[key] === 'string' ? formData.value[key] : undefined
}
function setDisplayName(val: string | undefined, key: string) {
    setFormData({ ...formData.value, [key]: val })
}

/**
 * 校验规则
 */
const rules = computed(() => {
    const rules: FormRules = {}
    visibleControls.value.forEach(ctl => {
        if (getControlProperty(ctl, 'required', 'form')) {
            rules[ctl.name] = [{ required: true, message: `${ctl.caption} is required`, trigger: 'change' }]
        }
    })
    return rules
})

function onControlChange(value: unknown, control: Control) {
    emit('item-change', value, control.name)
}


function validate(): Promise<FormData | false> {
    return new Promise(resolve => {
        formRef.value?.validate(valid => {
            if (valid) {
                resolve(cloneDeep(formData.value))
            } else {
                resolve(false)
            }
        })
    })
}


defineExpose<DuFormProExpose>({
    validate,
    getValue,
    setValue,
    setModelProps
})
</script>

<style scoped lang="scss">
.du-form-pro {
    .du-form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 12px);
    }

    .du-form-item {
        &::v-deep(label.el-form-item__label) {
            height: 100%;
            display: flex;
            align-items: center;
        }
    }

    &.border {
        &::v-deep(.el-descriptions__label) {
            &.is-required::before {
                content: "*";
                color: var(--el-color-danger);
                margin-right: 4px;
            }
        }


        .du-form-item {
            margin-bottom: 0;

            &::v-deep(div.el-form-item__content) {
                margin-left: 0 !important;
            }

        }

        &::v-deep(.el-descriptions__table) {
            table-layout: fixed !important;
        }

        .border-custom-error {
            background: var(--el-color-danger);
            color: #fff;
            position: absolute;
            top: calc(100% + 4px);
            right: 0px;
            width: auto;
            font-size: 12px;
            line-height: normal;
            padding: 3px 6px;
            border-radius: 2px;
        }
    }
}
</style>
