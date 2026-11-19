<template>
  <du-input v-if="type === 'input'" v-bind="{
    ...$attrs,
    ...inputProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="inputValue" @change="onControlChange" />

  <du-input-number style="width: 100%;" v-else-if="type === 'number'" v-bind="{
    ...$attrs,
    ...inputNumberProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="inputNumberValue" @change="onControlChange" />

  <du-select v-else-if="type === 'select'" v-bind="{
    ...$attrs,
    ...selectProps,
    disabled: disabled,
    readonly: readonly,
  }" v-model="selectValue" v-model:modelLabel="label" @change="onControlChange" />

  <du-radio v-else-if="type === 'radio'" v-bind="{
    ...$attrs,
    ...radioProps,
    disabled: disabled,
    readonly: readonly,
  }" v-model="radioValue" v-model:modelLabel="label" @change="onControlChange" />

  <du-switch v-else-if="type === 'switch'" v-bind="{
    ...$attrs,
    ...switchProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="switchValue" @change="onControlChange" />

  <du-checkbox v-else-if="type === 'checkbox'" v-bind="{
    ...$attrs,
    ...checkboxProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="checkboxValue" @change="onControlChange" v-model:modelLabel="label" />

  <du-date-picker v-else-if="type === 'date-picker'" v-bind="{
    ...$attrs,
    ...datePickerProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="datePickerValue" @change="onControlChange" />

  <du-richtext v-else-if="type === 'richtext'" v-bind="{
    ...$attrs,
    ...richtextProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="richtextValue" @change="onControlChange" />

  <du-upload v-else-if="type === 'upload'" v-bind="{
    ...$attrs,
    ...uploadProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="uploadValue" @change="onControlChange" />

  <du-editor v-else-if="type === 'editor'" v-bind="{
    ...$attrs,
    ...editorProps,
    readonly: readonly,
    disabled: disabled,
  }" v-model="editorValue" @change="onControlChange" />

</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { Control } from '@/typings/model'
import { getControlProperty } from '@/utils/index'

import DuInput from '../du-input/index.vue';
import DuInputNumber from '../du-input-number/index.vue';
import DuSelect from '../du-select/index.vue';
import DuRadio from '../du-radio/index.vue';
import DuSwitch from '../du-switch/index.vue';
import DuDatePicker from '../du-date-picker/index.vue';
import DuCheckbox from '../du-checkbox/index.vue';
import DuUpload from '../du-upload/index.vue';
import DuRichtext from '../du-richtext/index.vue';
import DuEditor from '../du-editor/index.vue';

import type { ControlWidgetProps, ControlWidgettEmit } from './index'
import type { DuInputProps } from '../du-input/index.js'
import type { DuInputNumberProps } from '../du-input-number/index.js'
import type { DuSelectProps } from '../du-select/index.js'
import type { DuDatePickerProps } from '../du-date-picker/index.js'
import type { DuSwitchProps } from '../du-switch/index.js'
import type { DuCheckboxProps } from '../du-checkbox/index.js'
import type { DuRadioProps } from '../du-radio/index.js'
import type { DuRichtextProps } from '../du-richtext/index.js'
import type { DuUploadProps } from '../du-upload/index.js'
import type { DuEditorProps } from '../du-editor/index.js'


defineOptions({
  name: 'ControlWidget'
})

const emits = defineEmits<ControlWidgettEmit>()

const props = withDefaults(defineProps<ControlWidgetProps>(), {
  readonly: false,
  disabled: false,
})

function createModel<T>() {
  return computed<T>({
    get() {
      return props.modelValue as T
    },
    set(value) {
      emits('update:modelValue', value);
    }
  })
}
const inputValue = createModel<DuInputProps['modelValue']>()
const inputProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuInputProps)

const inputNumberValue = createModel<DuInputNumberProps['modelValue']>()
const inputNumberProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuInputNumberProps)

const selectValue = createModel<DuSelectProps['modelValue']>()
const selectProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuSelectProps)

const radioValue = createModel<DuRadioProps['modelValue']>()
const radioProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuRadioProps)

const switchValue = createModel<DuSwitchProps['modelValue']>()
const switchProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuSwitchProps)

const checkboxValue = createModel<DuCheckboxProps['modelValue']>()
const checkboxProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuCheckboxProps)

const datePickerValue = createModel<DuDatePickerProps['modelValue']>()
const datePickerProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuDatePickerProps)


const richtextValue = createModel<DuRichtextProps['modelValue']>()
const richtextProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuRichtextProps)

const uploadValue = createModel<DuUploadProps['modelValue']>()
const uploadProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuUploadProps)

const editorValue = createModel<DuEditorProps['modelValue']>()
const editorProps = computed(() => getControlProperty(props.control, 'controlProps', props.mode) as DuEditorProps)

const label = computed<ControlWidgetProps['modelLabel']>({
  get() {
    return props.modelLabel
  },
  set(value) {
    emits('update:modelLabel', value);
  }
})



function onControlChange(value: unknown) {
  emits('change', value, props.control)
}

const type = computed<Control['type']>(() => getControlProperty<Control>(props.control, 'type', props.mode) as Control['type'])
const disabled = computed<Control['disabled']>(() => getControlProperty<Control>(props.control, 'disabled', props.mode) as Control['disabled'])
const readonly = computed<Control['readonly']>(() => getControlProperty<Control>(props.control, 'readonly', props.mode) as Control['readonly'])


</script>
