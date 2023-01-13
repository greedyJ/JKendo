let defaultTreeListConfig = {
    dataSource: {
        type: "json",
        transport: {
            read: ''
        },
        pageSize: 10,
    },
    editable: false,
    sortable: true,
    pageable: {
        refresh: true,
        pageSizes: true,
        buttonCount: 5,
    },
    columns: [],
    filterable: true,
    toolbar: [],
    selectable: true,
    resizable: true,
    reorderable: true,
}
