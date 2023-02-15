'use strict'
class BSGrid {
    constructor() {
        this.DOM = $('<div>')
    }
    add(type) {
        switch (type) {
            case 'row':
                this.addRow()
                break;
            case 'col':
                if (!this.row)
                    console.log('please create row')
                else
                    addCol()
                break;
        }
    }
    addRow() {
        this.DOM.append(
            this.row = $('<div>').addClass('row')
        )
        return this.row
    }
    /**
     * 
     * @param {string} _size 
     */
    addCol(_size) {
        this.row.append(
            this.col = $('<div>').addClass('col')
        )
        if (_size)
            this.col.addClass(_size)
        return this.col
    }
    /**
     * 
     * @param {int} _size 
     */
    addNormalCol(_size) {
        this.addCol('col-xs-' + _size)
    }
    /**
     * 
     * @param {int} rowidx 
     * @param {int} colidx 
     * @param {any} content 
     */
    setContent(content, rowidx, colidx, className) {
        let tempRow = rowidx != null ?
            this.DOM.children('.row').eq(rowidx) :
            this.row
        let tempCol = colidx != null ?
            tempRow.children('.col').eq(colidx) :
            this.col

        tempCol.html(content)
        if (className)
            tempCol.addClass(className)
    }
    /**
     * 
     * @param {int} rowidx 
     * @param {int} colidx 
     */
    pointTo(rowidx, colidx) {
        this.row = this.DOM.children('.row').eq(rowidx)
        this.col = this.row.children('.col').eq(colidx)
    }
    toLast() {
        this.row = this.DOM.children('.row').last()
        this.col = this.row.children('.col').last()
    }
    setGrid(rows, cols) {
        if (rows && cols) {
            let r = 0
            while (r < rows) {
                this.addRow()
                let c = 0
                while (c < cols) {
                    this.addCol()
                    c++
                }
                r++
            }
        }
    }
}