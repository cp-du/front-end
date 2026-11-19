<template>
  <div class="du-table-pro" :style="tableProStyle" v-loading="modelLoading">
    <du-search-pro v-if="props.searchConfig?.enabled && controls.length > 0" v-model="pendingQuerySetting"
      :reset-init-value="props.resetInitValue" :controls="controls" @search="onSearch" />
    <div class="du-tool-bar" v-if="toobalabled" ref="toolbarRef">
      <div class="left-panel">
        <slot name="toolbar-left" :insert="insertRow"></slot>
      </div>
      <div class="right-panel">
        <slot name="toolbar-right"></slot>
        <du-button type="primary" text @click="fetchData" v-if="props.refreshConfig?.enabled">
          <el-icon>
            <Refresh />
          </el-icon>
        </du-button>
        <du-button type="primary" text v-if="props.importConfig?.enabled">
          <el-icon>
            <Upload />
          </el-icon>
        </du-button>
        <du-button type="primary" text v-if="props.exportConfig?.enabled">
          <el-icon>
            <Download />
          </el-icon>
        </du-button>
        <du-button type="primary" text v-if="props.printConfig?.enabled">
          <el-icon>
            <Printer />
          </el-icon>
        </du-button>
        <du-button type="primary" text v-if="props.customConfig?.enabled" @click="openCustomFieldDialog">
          <el-icon>
            <Operation />
          </el-icon>
        </du-button>
      </div>
    </div>

    <div class="du-table-wrapper">
      <vxe-table ref="vxeTableRef" v-bind="vxeTableProps" :size="size" :data="tableData" v-loading="dataLoading"
        element-loading-text="加载中..." @checkbox-all="onCheckboxAll" @checkbox-change="onCheckboxChange"
        @radio-change="onRadioChange">
        <vxe-column v-if="props.checkType" :type="props.checkType" fixed="left" width="45"></vxe-column>
        <template v-if="renderColumns">
          <template v-for="(control, index) in visibleControls" :key="`${control.name}_${index}`">
            <vxe-column v-bind="getColumnProps(control)">
              <template #default="scope">
                <slot :name="control.name" :control="control" v-bind="scope">
                  {{ scope.row[control.name + '_name'] || scope.row[control.name] || '-' }}
                </slot>
              </template>
              <template #edit="{ row, column }">
                <slot :name="`edit_${control.name}`" :control="control" :form-data="row">
                  <control-widget :modelValue="row[control.name]" @update:modelValue="(val) => row[control.name] = val"
                    :modelLabel="row[control.name + '_name']"
                    @update:modelLabel="(val) => row[control.name + '_name'] = val" :form-data="row" mode="table"
                    :control="control" />
                </slot>
              </template>
            </vxe-column>
          </template>
        </template>

        <!-- width operation__wrapper的宽度 + 单元格左右padding -->
        <vxe-column v-if="$slots.operation" title="操作" fixed="right" width="auto">
          <template #default="scope">
            <slot name="operation" v-bind="scope" :validate="validate" :revertData="revertData"
              :editable="isEditStatus(scope.row)" :setEditRow="setEditRow" :clearEdit="clearEdit"></slot>
          </template>
        </vxe-column>
        <template #empty>
          <du-empty :description="props.emptyText">
            <template v-if="$slots.emptyImage" #image>
              <slot name="emptyImage" />
            </template>
            <template v-if="$slots.emptyDefault" #default>
              <slot name="emptyDefault" />
            </template>
            <template v-if="$slots.emptyDescription" #description>
              <slot name="emptyDescription" />
            </template>
          </du-empty>
        </template>
      </vxe-table>
    </div>


    <el-pagination v-if="props.paginationConfig?.enabled" v-bind="props.paginationConfig"
      v-model:current-page="pagerState.pageIndex" v-model:page-size="pagerState.pageSize" :total="pagerState.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

  <custom-field ref="customFieldDialog" :exist-controls="existControls" :positionable="true"
    @confirm="onCheckFieldsConfirm" />
</template>
<script setup lang="ts">
import { inject, computed, mergeProps, nextTick, reactive, ref, useAttrs, onMounted, watch, useTemplateRef, useSlots } from "vue";
import { Upload, Refresh, Download, Operation, Printer } from '@element-plus/icons-vue'
import { cloneDeep, merge } from "es-toolkit";
import type { VxeTableInstance, VxeTablePropTypes, VxeTableDefines } from "vxe-table";
import { ElPagination } from "element-plus";
import { Http } from "@du/utils";
import type { TableControl, QuerySetting } from '@/typings/model';
import { SearchConfig, PaginationConfig, ColumnConfig, RowConfig, TreeConfig, CheckboxConfig, CellConfig, EditConfig } from './const'
import ControlWidget from '../../controls/control-widget/index.vue'
import type {
  DuTableProProps,
  DuTableProEmit,
  DuTableProExpose,
} from "./index";
import { getControlProperty } from '@/utils/index'
import DuSearchPro from "../du-search-pro";
import DuEmpty from "@/components/base/du-empty";
import { useModelHook } from '@/hooks/index'
import CustomField from "../custom-field/index.vue";
import type { DuProviderProps } from '@/components/layout/du-provider'

defineOptions({ name: "DuTablePro", inheritAttrs: false });

// 显式引用 VXE 的公开类型，避免声明生成时展开内部实例类型。
defineSlots<{
  [name: string]: (props: VxeTableDefines.CellRenderBodyParams & { control: TableControl }) => any
} & {
  [name: `edit_${string}`]: (props: { control: TableControl; formData: Record<string, unknown> }) => any
} & {
  'toolbar-left'?: (props: { insert: typeof insertRow }) => any
  'toolbar-right'?: () => any
  operation?: (props: VxeTableDefines.CellRenderBodyParams & {
    validate: typeof validate
    revertData: typeof revertData
    editable: boolean
    setEditRow: typeof setEditRow
    clearEdit: typeof clearEdit
  }) => any
  emptyImage?: () => any
  emptyDefault?: () => any
  emptyDescription?: () => any
}>()

const http = new Http({ baseURL: "" });
const attrs = useAttrs();
const vxeTableRef = ref<VxeTableInstance>();

const props = withDefaults(defineProps<DuTableProProps>(), {
  emptyText: "暂无数据",
  autoLoad: true,
  refreshConfig: () => ({ enabled: true }),
  customConfig: () => ({ enabled: true }),
  searchConfig: () => SearchConfig,
  paginationConfig: () => PaginationConfig,
  // vxe table props
  stripe: true,
  round: true,
  showHeader: true,
  padding: true,
  fit: true,
  autoResize: undefined,
  keepSource: true,
  height: '100%',
});

/**
 * vxe table props
 */
const vxeTableProps = computed(() => {
  const tableProps = mergeProps(attrs, {
    ...props,
    height: '100%',
    minHeight: undefined,
    maxHeight: undefined,
    emptyText: undefined,
    columnConfig: merge(ColumnConfig, props.columnConfig || {}),
    rowConfig: merge(RowConfig, props.rowConfig || {}),
    checkboxConfig: merge(CheckboxConfig, props.checkboxConfig || {}),
    editConfig: merge(EditConfig, props.editConfig || {}),
    editRules: rules.value
  })

  return tableProps;
})

const config = inject<DuProviderProps>('du-global-config');
const size = computed(() => config?.size ?? 'default');



const tableProStyle = computed(() => {
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height
  const minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  const maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  return {
    height,
    minHeight,
    maxHeight
  }
})

const slots = useSlots()

const toobalabled = computed(() => {
  return slots.toolbarLeft || slots.toolbarRight || props.customConfig?.enabled || props.refreshConfig?.enabled || props.importConfig?.enabled || props.exportConfig?.enabled || props.printConfig?.enabled
})


const { controls, setModelProps, modelLoading } = useModelHook<TableControl>(props);

/**
 * 存在的字段。未被移除的字段
 */
const existControls = computed(() => {
  return controls.value.filter(ctl => !getControlProperty(ctl, 'omitted', 'table'))
});

const customFieldDialog = useTemplateRef<InstanceType<typeof CustomField>>('customFieldDialog');

/**
 * 打开自定义字段对话框
 */
function openCustomFieldDialog() {
  customFieldDialog.value?.open?.(visibleControls.value)
}

// 渲染开关 VXE 的列注册算法做了最小复 及时修改了顺序 页面渲染的顺序也将错乱 需要重新渲染
const renderColumns = ref(true)
/**
 * 自定义字段确定
 * @param close 关闭对话框的回调函数
 */
async function onCheckFieldsConfirm(checkedFields: any[], close: () => void) {
  renderColumns.value = false
  await nextTick()
  existControls.value.forEach(ctl => {
    const findControl = checkedFields.find(f => f.name === ctl.name)
    setModelProps(ctl.name, {
      'table.hidden': !findControl,
      fixed: findControl?.fixed || ""
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

  renderColumns.value = true
  await nextTick()
}


/**
 * 显示的字段 未被隐藏的字段
 */
const visibleControls = computed<TableControl[]>(() => {
  return existControls.value.filter(ctl => !getControlProperty(ctl, 'hidden', 'table'))
})


/**
 * 校验规则
 */
const rules = computed<VxeTablePropTypes.EditRules<NonNullable<DuTableProProps['modelValue']>[number]>>(() => {
  const rules: VxeTablePropTypes.EditRules<NonNullable<DuTableProProps['modelValue']>[number]> = {}
  visibleControls.value.forEach(ctl => {
    if (getControlProperty(ctl, 'required', 'table')) {
      rules[ctl.name] = [{ required: true, message: `${ctl.caption} is required`, trigger: 'change' }]
    }
  })
  return rules
})

/**
 * 验证表格数据
 * @param rows 要验证的行，可以是布尔值、对象或表格数据数组，默认为 true（验证所有行）
 * @returns 验证结果，返回一个 Promise，resolve 为 true 表示验证通过，false 表示验证失败
 */
async function validate(rows: boolean | object | DuTableProProps['modelValue'] = true): Promise<boolean> {
  const invalid = await vxeTableRef.value?.validate?.(rows);
  return !invalid
}

/**
 * 还原行数据到初始状态
 */
async function revertData(row: NonNullable<DuTableProProps['modelValue']>[number]) {
  vxeTableRef.value?.revertData(row);
}

async function insertRow(row: NonNullable<DuTableProProps['modelValue']>[number], index: number = 0, setEdit: boolean = true) {
  const result = await vxeTableRef.value?.insertAt?.(row, index);
  await nextTick()
  if (setEdit) {
    vxeTableRef.value?.setEditRow?.(result?.row);
  }
  return result?.row
}



/**
 * 获取列的属性，将控件本身的属性与表格区域的控件属性合并
 * @param control 表格控件
 * @returns 合并后的列属性
 */
function getColumnProps(control: TableControl) {
  return {
    ...control,
    type: undefined,
    treeNode: props.treeConfig?.rowField === control.name,
    field: control.name,
    title: control.caption,
    editRender: { enabled: !getControlProperty(control, 'readonly', 'table') },
  }
}

// 待使用的查询配置
const pendingQuerySetting = ref<QuerySetting>([]);

watch(() => props.querySetting, (newVal) => {
  pendingQuerySetting.value = newVal ?? [];
}, { deep: true, immediate: true })
// 正在使用的查询配置
const usingQuerySetting = ref<QuerySetting>([]);

function onSearch() {
  reload();
}

const emits = defineEmits<DuTableProEmit>();

const tableData = ref<DuTableProProps['modelValue']>([]);



function setData(value: DuTableProProps['modelValue']) {
  const nextData = value ?? [];

  tableData.value = nextData;
  emits("update:modelValue", nextData);
}

function getData() {
  return tableData.value;
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) {
      tableData.value = newVal ?? [];
    }
  },
  { immediate: true },
);

interface TableResponse<T> {
  total: number;
  rows: T[];
  pageIndex: number;
  pageSize: number;
}

const pagerState = reactive<{
  pageSize: number;
  pageIndex: number;
  total: number;
}>({
  pageSize: 20,
  pageIndex: 1,
  total: 0,
});

function handleSizeChange(newSize: number) {
  pagerState.pageSize = newSize;
  pagerState.pageIndex = 1;
  fetchData();
}

function handleCurrentChange(newPage: number) {
  pagerState.pageIndex = newPage;
  fetchData();
}

const checkedRecords = ref<NonNullable<DuTableProProps['modelValue']>>([]);
const dataLoading = ref<Boolean>(false);
async function fetchData() {
  dataLoading.value = true;
  if (!props.url) {
    return;
  }

  let requestParams: Record<string, unknown> = {};

  if (props.paginationConfig.enabled) {
    requestParams = {
      pageIndex: pagerState.pageIndex,
      pageSize: pagerState.pageSize,
    };
  }
  if (props.params) {
    requestParams.params = props.params;
  }
  if (props.searchConfig.enabled) {
    requestParams.querySetting = pendingQuerySetting.value;
  }

  http.post<TableResponse<Record<string, unknown>>>(
    props.url,
    requestParams,
  ).then(res => {
    // 更新正在使用的查询配置
    usingQuerySetting.value = pendingQuerySetting.value ?? [];
    const rows = res.data!.rows || [];
    if (props.paginationConfig.enabled) {
      pagerState.total = res.data!.total || 0;
    }
    setData(rows);
    emits("loaded", rows);

    if (checkedRecords.value.length) {
      setCheckTable(checkedRecords.value, true);
    }
  }).finally(() => {
    dataLoading.value = false;
  });
}

function getQuerySetting() {
  return cloneDeep(usingQuerySetting.value);
}

async function reload() {
  pagerState.pageIndex = 1;
  checkedRecords.value = [];
  await fetchData();
}
// 刷新不会回到第一页
function refresh() {
  fetchData();
}

watch(
  () => [props.url, props.params, props.autoLoad],
  ([url, , autoLoad]) => {
    if (url && autoLoad) {
      reload();
    }
  },
  { immediate: true, deep: true },
);





// const operationWrapperRef = useTemplateRef("operationWrapper");

// const { width: operationWrapperWidth } = useElementSize(operationWrapperRef);

function onCheckboxAll({ checked }: { checked: boolean }) {
  setCheckRecoreds(tableData.value!, checked);
}

function onCheckboxChange({
  checked,
  row,
}: {
  checked: boolean;
  row: NonNullable<DuTableProProps['modelValue']>[number];
}) {
  setCheckRecoreds([row], checked);
}

function onRadioChange({ row }: { row: NonNullable<DuTableProProps['modelValue']>[number] }) {
  checkedRecords.value = [row];
}

function setCheckRecoreds(records: NonNullable<DuTableProProps['modelValue']>, checkable?: boolean) {
  if (typeof checkable === "boolean") {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const recordIndex = checkedRecords.value.findIndex(
        (item) => item[props.id! as string] === record![props.id! as string],
      );
      if (checkable) {
        if (recordIndex !== -1) {
          continue;
        }
        checkedRecords.value.push(record!);
      } else {
        if (recordIndex === -1) {
          continue;
        }
        checkedRecords.value.splice(recordIndex, 1);
      }
    }
    return;
  }
  checkedRecords.value = records;
}

function setCheckTable(records: NonNullable<DuTableProProps['modelValue']>, checkable: boolean) {
  if (props.checkType === "checkbox") {
    const filterRows = tableData.value!.filter(
      (row) => !!records.find((record) => record[props.id! as string] === row[props.id! as string]),
    );
    vxeTableRef.value?.setCheckboxRow(filterRows, checkable);
  } else {
    if (checkable) {
      records.forEach((record) => {
        const index = tableData.value!.findIndex(
          (row) => row[props.id! as string] === record[props.id! as string],
        );
        index !== -1 && vxeTableRef.value?.setRadioRow(tableData.value![index]);
      });
    } else {
      vxeTableRef.value?.clearRadioRow();
    }
  }
}

function getCheckedRecords() {
  return cloneDeep(checkedRecords.value);
}

function isEditStatus(row: NonNullable<DuTableProProps['modelValue']>[number]): boolean {
  if (!row || !vxeTableRef.value) {
    return false;
  }

  return vxeTableRef.value?.isEditByRow(row) ?? false;
}

async function setEditRow(row: NonNullable<DuTableProProps['modelValue']>[number]) {
  if (!row || !vxeTableRef.value) {
    return;
  }
  await vxeTableRef.value.setEditRow(row);
  // 等待操作按钮更新后，重新测量 auto 列宽。
  await nextTick();
  await vxeTableRef.value?.recalculate(true);
}

async function clearEdit() {
  if (vxeTableRef.value) {
    await vxeTableRef.value.clearEdit();
    await nextTick();
    await vxeTableRef.value?.recalculate(true);
  }
}



onMounted(async () => {
})

defineExpose<DuTableProExpose>({
  reload,
  setData,
  getData,
  getTableRef: () => vxeTableRef.value,
  refresh,
  getQuerySetting,
  getCheckedRecords,
  total: pagerState.total,
  setModelProps,
  setEditRow,
  clearEdit,
  validate
});



</script>

<style scoped lang="scss">
.du-table-pro {
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 16px);


  .du-tool-bar {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: var(--space-4, 16px);

    .left-panel {
      flex: 1 1 0;
    }

    .right-panel {
      flex: 0 0 auto;
    }
  }

  .du-table-wrapper {
    flex: 1 1 0;
    min-height: 0;
  }

}
</style>
