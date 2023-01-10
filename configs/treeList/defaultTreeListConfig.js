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
    dataBound: function () {
        this.autoFitColumn(0);
    },
    change: function () {
        this.editRow(this.select());
    },
    selectable: true,
}
