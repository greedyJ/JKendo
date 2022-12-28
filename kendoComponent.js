/// <reference path="https://kendo.cdn.telerik.com/2022.3.1109/js/kendo.all.min.js" />
/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js" />
'use strict';
/**
 * 
 * @param {'kendoGrid'|'kendoDropDownList'|'kendoComboBox'|'kendoWindow'|'kendoTabStrip'} component 
 * @returns 
 */
let newKendoOpt = (component, extendsOpt) => {
    extendsOpt = !extendsOpt ? {} : extendsOpt
    let opt = {}
    switch (component) {
        case 'kendoGrid':
            opt = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: ''
                    },
                    pageSize: 5,
                },
                editable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                },
                columns: [],
                filterable: true,
                groupable: true,
                group: function (e) { //Kendo UI 2016 R3 (2016.3.914) release. 現在沒用
                    let grid = e.sender
                    grid.columns.map(c => grid.showColumn(c.field))
                    e.groups.map(c => grid.hideColumn(c.field))
                },
                selectable: true,
            }
            break;
        case "kendoDropDownList":
            opt = {
                dataTextField: "value",
                dataValueField: "key",
                dataSource: {
                    type: "json",
                    transport: {
                        read: ""
                    }
                }
            }
            break;
        case "kendoComboBox":
            opt = {
                dataTextField: "value",
                dataValueField: "key",
                filter: "contains",
                placeholder: "Fill in the Licensor",
                dataSource: {
                    type: "json",
                    transport: { read: "" }
                },
            }
            break;
        case 'kendoWindow':
            opt = {
                width: "70%",
                title: '',
                visible: false,
                actions: [
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                modal: true,
            }
            break;
        case 'kendoTabStrip':
            opt = {
                animation: {
                    open: {
                        effects: "fadeIn"
                    }
                }
            }
            break;
    }
    Object.assign(opt, extendsOpt)
    return opt
}
/**
 * 
 * @param {'kendoComboBox'|'kendoDropDownList'|'button'|'textbox'|'input'} component 
 * @returns default \<div\>
 */
let newComponentDOM = (component) => {
    let comp = $('<div>')
    switch (component) {
        case 'input':
        case 'kendoDropDownList':
        case 'kendoComboBox':
            comp = $('<input>').attr('type', 'text')
            break;
        case 'textbox':
            comp = newComponentDOM('input').addClass('k-textbox')
            break;
        case 'button':
            comp = $('<button>').addClass('k-button').attr('type', 'button')
            break;
    }
    return comp
}

/**
 * 
 * @param {'kendoGrid'|'kendoDropDownList'|'kendoComboBox'|'kendoWindow'|'kendoTabStrip'} component 
 * @returns 
 */
let initKendoComponent = (component, DOMSelector, opt) => {
    let obj = null
    opt = !opt ? {} : opt
    switch (component) {
        case 'kendoGrid':
            if (opt.filterable) {
                opt.columns = opt.columns.map(m => {
                    if (m.filterable == null)
                        m.filterable = { multi: true, search: true }
                    return m
                })
            }
            obj = DOMSelector.kendoGrid(!opt ? {} : opt).data(component)

            // group hide column event
            obj.dataSource.bind('change', function (e) {
                obj.columns.map(c => obj.showColumn(c.field))
                e.sender.group().map(c => obj.hideColumn(c.field))
            })
            break;
        case 'kendoDropDownList':
            obj = DOMSelector.kendoDropDownList(!opt ? {} : opt).data(component)
            break;
        case 'kendoComboBox':
            obj = DOMSelector.kendoComboBox(!opt ? {} : opt).data(component)
            break;
        case 'kendoWindow':
            obj = DOMSelector.kendoWindow(!opt ? {} : opt).data(component)
            break;
        case 'kendoTabStrip':
            obj = DOMSelector.kendoTabStrip(!opt ? {} : opt).data(component)
            break;
    }
    return obj
}

class JKendoBase {
    /**
     * 
     * @param {'kendoGrid'|'kendoComboBox'|'kendoDropDownList'|'kendoWindow'|'button'|'textbox'|'kendoTabStrip'} component 
     */
    constructor(component) {
        this.component = component
        this.DOM = newComponentDOM(component)
        this.opt = newKendoOpt(component)
        this.obj = this.DOM
        this.id = parseInt(Math.random() * Math.pow(10, 10)).toString()
    }
    init(customizeOpt) {
        this.opt = customizeOpt = customizeOpt == null ? this.opt : customizeOpt
        this.obj = initKendoComponent(this.component, this.DOM, this.opt)
    }
    getHTML() {
        return this.obj[0].outerHTML
    }
}

class JKendoGrid extends JKendoBase {
    constructor() {
        super('kendoGrid')
    }
}

class JKendoWindow extends JKendoBase {
    constructor() {
        super('kendoWindow')
    }
}

class JKendoTextbox extends JKendoBase {
    constructor() {
        super('textbox')
    }
}

class JKendoComboBox extends JKendoBase {
    constructor() {
        super('kendoComboBox')
    }
}

class JKendoDropDownList extends JKendoBase {
    constructor() {
        super('kendoDropDownList')
    }
}

class JKendoButton extends JKendoBase {
    constructor() {
        super('button')
    }
}

class JKendoTab extends JKendoBase {

    constructor() {
        super('kendoTabStrip')
    }
    /**
     * 
     * @param {[[String], [Object]]} tabContents 
     */
    set(tabContents) {
        this.setTabs(tabContents[0])
        this.setContents(tabContents[1])
    }
    /**
     * 
     * @param {[String]} tabs 
     */
    setTabs(tabs) {
        this.DOM.html(
            $('<ul>').html(
                tabs.map((m, idx) => $('<li>').attr('id', this.id + idx).html(m)[0].outerHTML).join('')
            )
        ).append(tabs.map(m => $('<div>')[0].outerHTML).join(''))
        this.tabs = tabs
        this.tabContents = tabs.map(m => '')
    }

    setContents(contents) {
        this.tabContents = contents
    }

    setContent(tab, content) {
        this.tabContents[this.tabs.indexOf(tab)] = content
    }

    init(customizeOpt) {
        super.init(customizeOpt)

        this.tabs.map((m, idx) => {
            this.DOM.find('div#' + this.DOM.find('ul li#' + this.id + idx).attr('aria-controls')).html(this.tabContents[idx])
        })
        this.obj.activateTab(this.DOM.find('ul li#' + this.id + 0))
    }
}