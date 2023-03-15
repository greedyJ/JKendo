'use strict';
/// <reference path="https://kendo.cdn.telerik.com/2022.3.1109/js/kendo.all.min.js" />
/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js" />
/// <reference path="configs/grid/defaultGridConfig.js" />
/// <reference path="configs/treeList/defaultTreeListConfig.js" />

/**
 *
 * @param {'kendoGrid'|'kendoTreeList'|'kendoDropDownList'|'kendoComboBox'|'kendoWindow'|'kendoTabStrip'|'kendoRadioButton'} component
 * @returns
 */
let newKendoOpt = (component, extendsOpt) => {
    extendsOpt = !extendsOpt ? {} : extendsOpt
    let opt = {}
    switch (component) {
        case 'kendoGrid':
            opt = { ...defaultGridConfig }
            break;
        case 'kendoTreeList':
            opt = { ...defaultTreeListConfig }
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
        case 'kendoRadioButton':
            opt = {
                label: "RadioButton Label",
                encoded: false
            }
            break;
    }
    Object.assign(opt, extendsOpt)
    return { ...opt }
}
/**
 *
 * @param {'kendoComboBox'|'kendoDropDownList'|'button'|'textbox'|'input'|'label'|'textarea'|'kendoRadioButton'} component
 * @returns default \<div\>
 */
let newComponentDOM = (component) => {
    let comp = $(document.createElement('div'))
    switch (component) {
        case 'input':
        case 'kendoDropDownList':
        case 'kendoComboBox':
        case 'kendoRadioButton':
        case 'textbox':
            comp = $(document.createElement('input')).attr('type', 'text')
            switch (component) {
                case 'kendoRadioButton':
                    comp.attr({ type: 'radio' })
                    break;
                case 'textbox':
                    comp.addClass('k-textbox')
                    break;
            }
            break;
        case 'button':
            comp = $(document.createElement('button')).addClass('k-button').attr('type', 'button')
            break;
        case 'link':
            comp = $(document.createElement('a'))
            break;
        case 'label':
            comp = $(document.createElement('label'))
            break;
        case 'textarea':
            comp = $(document.createElement('textarea'))
            break;
    }
    return comp
}

/**
 *
 * @param {'kendoGrid'|'kendoTreeList'|'kendoDropDownList'|'kendoComboBox'|'kendoWindow'|'kendoTabStrip'|'kendoRadioButton'} component
 * @param {jQuery} DOMSelector
 * @param {JSON} opt
 * @returns
 */
let initKendoComponent = (component, DOMSelector, opt) => {
    let obj = DOMSelector
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
            obj = DOMSelector.kendoGrid(opt).data(component)

            // group hide column event
            obj.dataSource.bind('change', function (e) {
                obj.columns.map(c => obj.showColumn(c.field))
                e.sender.group().map(c => obj.hideColumn(c.field))
            })
            break;
        case 'kendoTreeList':
            obj = DOMSelector.kendoTreeList(opt).data(component)
            break;
        case 'kendoDropDownList':
            obj = DOMSelector.kendoDropDownList(opt).data(component)
            break;
        case 'kendoComboBox':
            obj = DOMSelector.kendoComboBox(opt).data(component)
            break;
        case 'kendoWindow':
            obj = DOMSelector.kendoWindow(opt).data(component)
            break;
        case 'kendoTabStrip':
            obj = DOMSelector.kendoTabStrip(opt).data(component)
            break;
        // case 'kendoRadioButton':
        //     obj = DOMSelector.kendoRadioButton(opt).data(component)
        //     break;
    }
    return obj
}

class JKendoBase {
    /**
     *
     * @param {'kendoGrid'|'kendoTreeList'|'kendoComboBox'|'kendoDropDownList'|'kendoWindow'|'button'|'textbox'|'kendoTabStrip'|'link'|'kendoRadioButton'} component
     * @param {{}} props set properties on init
     */
    constructor(component, props) {
        this.component = component
        this.DOM = newComponentDOM(component)
        this.opt = newKendoOpt(component)
        this.obj = this.DOM
        this.id = parseInt(Math.random() * Math.pow(10, 10)).toString()

        let objProps = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        if (props != null)
            Object.keys(props).forEach(prop => {
                if (objProps.includes(prop))
                    try {
                        this[prop] = props[prop]
                    } catch { }
            })
    }
    /**
     * @param {JSON} customizeOpt
     */
    init(customizeOpt) {
        this.opt = customizeOpt = customizeOpt == null ? this.opt : customizeOpt
        this.obj = initKendoComponent(this.component, this.DOM, this.opt)
        return this.obj
    }
    /**
     * @param {any} obj
     */
    set html(obj) {
        if (obj.constructor.name.startsWith('JKendo'))
            this.DOM.html(obj.DOM)
        else
            this.DOM.html(obj)
    }
    /**
     * @param {any} obj
     */
    set append(obj) {
        if (obj.constructor.name.startsWith('JKendo'))
            this.DOM.append(obj.DOM)
        else
            this.DOM.append(obj)
    }
    /**
     * @returns {String}
     */
    get html() {
        return this.obj[0].outerHTML
    }
    set objName(name) { this._objName = name }
    get objName() { return this._objName }
    /**
     * @param {String} value
     */
    set val(value) {
        switch (this.component) {
            case 'textbox':
                this.obj.val(value)
                break;
            case 'kendoComboBox':
            case 'kendoDropDownList':
                this.obj.value(value)
                break;
            case 'textarea':
                this.obj.html(value)
                break;
            case 'kendoRadioButton':
                // this.obj.check(this.DOM.val() == value)
                if (this.DOM.val() == value)
                    this.DOM.click()
                break;
        }
    }
    /**
     * @returns String
     */
    get val() {
        let val = ''
        switch (this.component) {
            case 'textbox':
            case 'textarea':
                val = this.obj.val()
                break;
            case 'kendoComboBox':
            case 'kendoDropDownList':
                val = this.obj.value()
                break;
            case 'kendoRadioButton':
                // this.obj.check(this.DOM.val() == value)
                if (this.DOM.prop('checked'))
                    val = this.DOM.val()
                break;
        }
        return val
    }
    /**
     * @param {String} url
     */
    set url(url) {
        switch (this.component) {
            case 'kendoComboBox':
            case 'kendoDropDownList':
            case 'kendoGrid':
            case 'kendoTreeList':
                this.opt.dataSource.transport.read = url
                break;
        }
    }
    /**
     * @param {[JSON]} data
     */
    set data(data) {
        switch (this.component) {
            case 'kendoComboBox':
            case 'kendoDropDownList':
            case 'kendoGrid':
            case 'kendoTreeList':
                delete this.opt.dataSource.transport
                this.opt.dataSource.data = data
                break;
        }
    }
    get data() {
        let data = []
        switch (this.component) {
            case 'kendoGrid':
            case 'kendoTreeList':
                data = this.obj.dataSource.data()
                break;
        }
        return data
    }
    /**
     * @param {any} show
     */
    set progress(show) {
        kendo.ui.progress(this.DOM, show)
    }

    on(event, callback) {
        if (callback != null)
            this.DOM.on(event, callback)
        return this
    }
    on(event, selector, callback) {
        if (callback != null)
            this.DOM.on(event, selector, callback)
        return this
    }
    attr(attrObj) {
        this.DOM.attr(attrObj)
        return this
    }
}

class JKendoGridKind extends JKendoBase {
    /**
     *
     * @param {'kendoGrid'|'kendoTreeList'} component
     * @param {{}} props set properties on init
     */
    constructor(component, props) {
        super(component, props)
    }
    /**
     * @param {[{field:String,title:String}]} cols
     */
    set columns(cols) {
        this.opt.columns = cols
    }
    /**
     * @param {[('cancel'|'create'|'save'|'excel'|'pdf')]} btns
     */
    set toolbar(btns) {
        if (!btns.length)
            delete this.opt.toolbar
        else
            this.opt.toolbar = btns
        if (btns.includes('save'))
            console.log('Please Set saveChanges property')
    }
    /**
     * @param {Boolean} editable
     */
    set editable(editable = true) {
        this.opt.editable = editable
        delete this.opt.change
    }
    /**
     * @param {Function} callback
     */
    set saveChanges(callback) {
        if (this.opt.toolbar.includes('save'))
            this.opt.saveChanges = callback
    }
}

class JKendoGrid extends JKendoGridKind {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('kendoGrid', props)
    }

    /**
     * @param {[{field:String}]} cols
     */
    set distinctColumns(cols) {
        this._distinctColumns = cols
        this.opt.dataSource.change = function (e) {
            switch (e.action) {
                case 'add':
                case 'itemchange':
                    let _oriData = e.sender.data()
                    let _newDatas = _oriData
                        .filter((value, index, self) => {
                            return self
                                .map(m => cols.map(mm => m[mm.field]).join('^@^'))
                                .indexOf(cols.map(mm => value[mm.field]).join('^@^')) === index
                        })
                    if (_newDatas.length != _oriData.length) {
                        let _diffDatas = _oriData
                            .filter(f => !_newDatas.includes(f))

                        let _diffMsgScope = _diffDatas.filter(f => !(cols.map(mm => f[mm.field] == null).reduce((a, b) => a && b))) // remove empty row
                        if (_diffMsgScope.length > 0) {
                            let msg = _diffMsgScope.map(m => cols.map(mm => mm.field + ':' + m[mm.field]).join(',')).join('\n')
                            alert('Duplicate ' + msg)
                        }

                        _diffDatas.map(m => {
                            e.sender.remove(m)
                        })
                    }
                    break;
            }
        }
    }

    /**
     * @param {Boolean} show
     */
    set showGroupHeader(show) {
        this.opt.groupable = show
    }
}

class JKendoTreeList extends JKendoGridKind {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('kendoTreeList', props)
    }
}

class JKendoWindow extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('kendoWindow', props)
    }

    /**
     * @param {String} width
     */
    set width(width) {
        this.opt.width = width
    }
    /**
     * @param {String} height
     */
    set height(height) {
        this.opt.height = height
    }
    /**
     * @param {String} title
     */
    set title(title) {
        this.opt.title = title
    }

    // init() {
    //     if (this.opt['modal']) {
    //         function resizeDialog(DOM) {
    //             var h = DOM.height();
    //             var headH = $("#dialog .modal-header").outerHeight(true);
    //             var footH = $("#dialog .modal-footer").outerHeight(true);
    //             var contH = h - headH - footH;

    //             $("#dialog .container").height(contH).css("overflow", "auto");
    //         }

    //         let header = $(document.createElement('div')).addClass('.modal-header')
    //         let container = $(this.html).addClass('.container')
    //         let footer = $(document.createElement('div')).addClass('.modal-footer')
    //         this.DOM
    //             .html(header)
    //             .append(container)
    //             .append(footer)
    //         this.opt['open'] =
    //             this.opt['resize'] =
    //             () => {
    //                 resizeDialog(this.DOM)
    //             }
    //     }
    //     return super.init()
    // }
}

class JKendoTextbox extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('textbox', props)
    }

    /**
     * @param {boolean} enable
     */
    set enable(enable) {
        this.DOM.prop('disabled', !enable)
    }
}

class JKendoTextArea extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('textarea', props)
    }

    /**
     * @param {boolean} enable
     */
    set enable(enable) {
        this.DOM.prop('disabled', !enable)
    }
}

class JKendoComboBox extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('kendoComboBox', props)
    }
}

class JKendoDropDownList extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('kendoDropDownList', props)
    }
}

class JKendoRadioButton extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(name, label, value, props) {
        super('kendoRadioButton', props)
        this.DOM.attr({
            'value': value,
            'name': name
        })
        this._label = label
    }

    /**
     * @param {string} label
     */
    set label(label) {
        this.opt['label'] = label
    }

    get DisplayDOM() {
        return $(document.createElement('label')).html(this.DOM).append(' ' + this._label)
    }
}


class JKendoHTMLObj extends JKendoBase {
    /**
     * 
     * @param {string} componentType 
     * @param {string} text 
     * @param {{}} props set properties on init
     */
    constructor(componentType, text, props) {
        super(componentType, props)

        super.html = text

        if (props != null)
            Object.keys(props).forEach(prop => {
                if (prop.startsWith('data-') || ['name', 'id'].includes(prop))
                    this.obj.attr(prop, props[prop])
            })
    }
}

class JKendoLabel extends JKendoHTMLObj {
    /**
     *
     * @param {string} text
     * @param {{}} props set properties on init
     */
    constructor(text, props) {
        super('label', text, props)
    }
}

class JKendoButton extends JKendoHTMLObj {
    /**
     *
     * @param {string} buttonText
     * @param {{}} props set properties on init
     */
    constructor(buttonText, props) {
        super('button', buttonText, props)
    }
}

class JKendoLink extends JKendoHTMLObj {
    /**
     *
     * @param {string} text
     * @param {{}} props set properties on init
     */
    constructor(text, props) {
        super('link', text, props)
    }
}

class JKendoTab extends JKendoBase {
    /**
     *
     * @param {{}} props set properties on init
     */
    constructor(props) {
        super('kendoTabStrip', props)
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

class JKendoRadioButtonGroup extends JKendoBase {
    /**
     * 
     * @param {string} name 
     * @param {[]} labels 
     * @param {[]} values 
     * @param {object} props 
     */
    constructor(name, labels, values, props) {
        super('div')
        this._rbs = []
        if (labels.length == values.length) {
            labels.map((label, idx) => {
                let _rb = new JKendoRadioButton(name, label, values[idx], props)
                this._rbs.push(_rb)
                this.DOM.append(_rb.DisplayDOM)
                this.DOM.append(' ')
            })
        }
        this.objName = name
        return this
    }

    init() {
        this._rbs.forEach(_rb => _rb.init())
        return this
    }

    /**
     * @param {any} value
     */
    set val(value) {
        this._rbs.forEach(_rb => _rb.val = value)
    }
    get val() {
        this._rbs.filter(_rb => console.log(_rb.obj.prop('checked')))
        return this._rbs.filter(_rb => _rb.obj.prop('checked'))[0].val
    }
}