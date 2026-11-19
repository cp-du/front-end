<template>
  <el-tab-pane class="du-tab-pane" v-bind="mergeProps($attrs, props)">
    <template #label>
      <span>{{ props.label }}</span>
    </template>
    <template v-if="loaded" #default>
      <div class="du-tab-pane__content">
        <slot></slot>
      </div>
      <div class="du-tab-pane__footer" v-if="$slots.footer">
        <slot name="footer">
        </slot>
      </div>
    </template>
  </el-tab-pane>
</template>

<script lang="ts" setup>
import { mergeProps, inject, ref, watchEffect, type ComputedRef } from "vue";
import { ElTabPane } from "element-plus";
import type { DuTabPaneProps } from "./index";

defineOptions({
  name: "DuTabPane"
});

const props = withDefaults(defineProps<DuTabPaneProps>(), {});

const active = inject<ComputedRef<string>>("active-tab");

// 是否加载过
const loaded = ref(false);

watchEffect(() => {
  if (!loaded.value) {
    loaded.value = active?.value == props.name;
  }
});
</script>
<style scoped lang="scss">
.du-tab-pane {
  height: 100%;
  display: flex;
  flex-direction: column;

  .du-tab-pane__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0;
  }

  .du-tab-pane__footer {
    min-height: 0;
    border-top: 1px solid var(--el-border-color);
    flex: 0 0 auto;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
