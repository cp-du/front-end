import { ref } from 'vue'

const needRefresh = ref(false)

export function useRefresh() {
    function requestRefresh() {
        needRefresh.value = true
    }

    function consumeRefresh() {
        if (!needRefresh.value) {
            return false
        }

        needRefresh.value = false
        return true
    }

    return {
        requestRefresh,
        consumeRefresh
    }
}
