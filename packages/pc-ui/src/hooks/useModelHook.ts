import { onMounted, ref, inject, type Ref } from "vue";
import type { Control } from "../typings/model";
import type { ConfigProviderProps } from "./useGlobalConfig";
import { Http } from "@du/utils";
import { merge } from "es-toolkit";

const http = new Http({
  baseURL: "/api",
  cache: true,
});

type UseModelHookProps<T extends Control> = {
  /**
   * 模型名称
   */
  modelName?: string;
  /**
   * 控件
   */
  controls?: T[];
  /**
   * 模型数据预处理
   */
  beforeRender?: (modelData: T[]) => T[] | Promise<T[]>;
  /**
   * 模型回调
   * @returns void
   */
  callback?: () => void;
};


export function useModelHook<T extends Control>(props: UseModelHookProps<T>): { controls: Ref<T[]>; setModelProps: (key: T['name'], props: Partial<T>) => void; modelLoading: Ref<boolean> } {
  const controls = ref<T[]>([]);

  const config = inject<ConfigProviderProps>("du-global-config");

  const modelLoading = ref(false);

  async function getModel() {
    if (!props.controls && !props.modelName) return;

    let modelData: T[] = [];
    // 模型获取逻辑
    if (props.controls) {
      modelData = props.controls;

      // return
    }

    if (props.modelName) {
      modelData = await getRemoteModelData();
    }

    if (props.beforeRender) {
      controls.value = await props.beforeRender(modelData);
    } else {
      controls.value = modelData;
    }

    props.callback?.();
  }

  async function getRemoteModelData() {
    if (!config?.appCode) return [];

    const res = await http.get<T[]>(
      `/${config.appCode}/model/${props.modelName}`,
    );
    if (res.code === '0') {
      return res.data || [];
    } else {
      return [];
    }
  }

  function setModelProps(key: T['name'], props: Partial<T>): void {
    const index = controls.value.findIndex(c => c.name === key);
    if (index !== -1) {
      const findControl = merge(controls.value[index], props);
      // @ts-ignore to bypass type checking for merge result
      controls.value.splice(index, 1, findControl);
    }
  }

  onMounted(async () => {
    modelLoading.value = true;
    await getModel();
    modelLoading.value = false;
  });


  return {
    controls: controls as Ref<T[]>,
    setModelProps,
    modelLoading
  };
}
