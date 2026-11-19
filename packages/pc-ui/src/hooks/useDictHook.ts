import { reactive, onMounted, toRefs } from "vue";
import { Http } from "@du/utils";
import { getDataByDataPath } from '../utils'
const http = new Http({
    baseURL: "/api",
    cache: true,
});

export type UseDictHookProps = {
    modelValue?: any;
    modelLabel?: string | string[];
    force?: boolean;
    url?: string;
    options?: Record<string, any>[];
    props: {
        value?: string;
        label?: string;
        disabled?: string;
    };
    dataPath?: string;
}

type State = {
    options: Record<string, any>[];
    loaded: boolean;
    loading: boolean;
};

export function useDictHook(props: UseDictHookProps) {

    const state = reactive<State>({
        options: [],
        loaded: false,
        loading: false,
    });

    onMounted(() => {
        if (props.options) {
            state.options = props.options
            state.loaded = true;
            return
        }
        if (props.modelLabel && props.modelValue) {
            state.options = [
                { [props.props!.value as string]: props.modelValue as string, [props.props!.label as string]: props.modelLabel },
            ];
            return
        }
        if (!props.url) return
        if (props.force) {
            fetchDictData()
            return
        }
        if (!props.modelLabel && props.modelValue) {
            fetchDictData()
            return
        }

    });



    function fetchDictData() {
        if (state.loaded) return
        state.loading = true
        http.get<object>(props.url!, {}).then(res => {
            if (res.data) {
                const data = getDataByDataPath(res.data, props.dataPath || '')
                state.options = data
                state.loaded = true
            }
        }).finally(() => {
            state.loading = false
        })
    }

    function getLabel(value: UseDictHookProps['modelValue']) {
        if (!value) return ''
        if (typeof value === 'string') {
            const option = state.options.find(item => item[props.props!.value as string] === value)
            return option ? option[props.props!.label as string] : ''
        }
        if (Array.isArray(value)) {
            return value.map(val => {
                const option = state.options.find(item => item[props.props!.value as string] === val)
                return option ? option[props.props!.label as string] : ''
            }).join(', ')
        }
        return ''

    }


    return {
        ...toRefs(state),
        fetchDictData,
        getLabel
    }
}