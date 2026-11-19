
export const SearchConfig = {
    enabled: true,
} as const;

export const PaginationConfig = {
    enabled: true,
    layout: "total, sizes, prev, pager, next, jumper",
    background: true,
    pageSizes: [5, 10, 20, 50, 100],
};

export const ColumnConfig = {
    resizable: true,
    minWidth: 120,
} as const;

export const RowConfig = {
    isHover: true,
} as const;

export const CellConfig = {
    padding: {
        top: true,
        right: true,
        bottom: true,
        left: true,
    },
} as const;

// export const TreeConfig = {
//     rowField: 'id',
//     childrenField: 'children'
// } as const;

export const TreeConfig = undefined;
export const CheckboxConfig = {
    checkField: '__isChecked'
} as const;

export const EditConfig = {
    trigger: 'manual',
    mode: 'row',
    autoClear: false,
    showStatus: true,
} as const;