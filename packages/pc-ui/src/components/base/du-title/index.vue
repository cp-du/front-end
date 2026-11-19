<template>
  <div :class="['title ', !line ? 'title__bg' : '']" :style="titleStyle">
    <div :class="['title-wrap font-[500] flex items-center relative', line ? 'title__line' : '']">
      <slot>
        <span class="leading-[40px]">{{ title }}</span>
      </slot>
    </div>
    <div class="title-extra" v-if="$slots.extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DuTitleProps } from "./index";

const SIZE_MAP = {
  large: {
    titleSize: 18,
    extraSize: 16
  },
  default: {
    titleSize: 16,
    extraSize: 14
  },
  small: {
    titleSize: 14,
    extraSize: 12
  }
};

defineOptions({
  name: "DuTitle"
});

const props = withDefaults(defineProps<DuTitleProps>(), {
  line: true
});



const titleStyle = computed(() => {
  const size = 'default';
  return {
    '--title-size': SIZE_MAP[size].titleSize + "px",
    '--extra-size': SIZE_MAP[size].extraSize + "px"
  };
});


</script>
<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 8px;
  gap: var(--space-3);
  line-height: 1;

  &-wrap {
    position: relative;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: var(--title-size);
  }

  &-extra {
    flex: 1;
    min-width: 0;
    font-size: var(--extra-size);
    font-weight: 400;
    color: var(--el-text-color-regular);
  }
}

.title__bg {
  background: linear-gradient(270deg, rgba(245, 245, 255, 0.1) 0%, var(--el-color-primary-light-9) 100%);
}

.title__line::before {
  content: "";
  display: block;
  width: 4px;
  height: 100%;
  background-color: var(--el-color-primary);
  position: absolute;
  left: -12px;
  top: 0;
  border-radius: 4px;
}
</style>
