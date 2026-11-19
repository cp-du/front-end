<template>
    <div class="root-nav">
        <div class="title">system</div>
        <div :class="['home', router.currentRoute.value.path === '/home' ? 'active' : '']"
            @click="router.push('/home')">
            <span style="font-size: 16px;" class="iconfont-base">&#xedb0;</span>
            {{ t('home') }}
        </div>
        <div class="menu">
            <RootMenu />
        </div>
        <div class="toolbar">
            <du-button text @click="router.push('/settings')">
                <el-icon size="16">
                    <component :is="Setting" />
                </el-icon>
            </du-button>
        </div>
        <div class="user">
            <div class="avatar"></div>
            <div class="user-group">
                admin
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { Setting } from "@element-plus/icons-vue";
import RootMenu from "./RootMenu.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

defineOptions({
    name: "RootNav",
});

const router = useRouter();
const { t } = useI18n();


</script>

<style scoped lang="scss">
.root-nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--el-bg-color);

    gap: var(--space-3, 12px);

    .title {
        width: 100%;
        margin-bottom: 4px;
        overflow-wrap: break-word;
        font-size: 12px;
        font-weight: 1000;
        line-height: 20px;
        letter-spacing: 0;
        text-align: center;
    }

    .home {
        width: 100%;
        height: var(--el-menu-item-height);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        line-height: normal;
        font-size: 14px;

        &:hover {
            background-color: var(--el-menu-hover-bg-color);
        }

        &.active {
            color: var(--el-menu-active-color);
        }
    }

    .menu {
        width: 100%;
        flex: 1;
        position: relative;
        padding: 16px 0;



        &::v-deep(.el-menu) {
            border-right: 0;
        }

        &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 1px;
            background-color: var(--el-border-color);

        }

        &::after {
            content: "";
            display: block;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 1px;
            background-color: var(--el-border-color);
        }
    }

    .user {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3, 12px);

        .avatar {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-sm);
            background-color: pink;
        }

        .user-group {
            width: 100%;
            font-size: 12px;
            line-height: 28px;
            text-align: center;
        }
    }

    .toolbar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;

        &::v-deep(.el-button) {
            margin-left: 0;
            text-align: center;
        }
    }
}
</style>
