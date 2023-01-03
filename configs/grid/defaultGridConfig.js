//https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/configuration/columns.command
let defaultGridFirstCol = { command: 'destroy', width: "50px" }
let defaultGridConfig = {
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
    groupable: false,
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/configuration/toolbar
    toolbar: [],
    group: function (e) { //Kendo UI 2016 R3 (2016.3.914) release. 現在沒用
        let grid = e.sender
        grid.columns.map(c => grid.showColumn(c.field))
        e.groups.map(c => grid.hideColumn(c.field))
    },
    dataBound: function () {
        this.autoFitColumn(0);
    },
    change: function () {
        this.editRow(this.select());
    },
    selectable: true,
}
