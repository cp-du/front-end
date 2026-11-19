import DuToolBar from "./index.vue";


export type DuToolBarProps = {
    refreshable?: boolean;
    uploadable?: boolean;
    downloadable?: boolean;
    operable?: boolean;
    printable?: boolean;
}

export type DuToolBarEmit = {
    (e: 'refresh'): void;
    (e: 'upload'): void;
    (e: 'download'): void;
    (e: 'operate'): void;
    (e: 'print'): void;
};

export type DuToolBarExpose = {
};

export default DuToolBar;