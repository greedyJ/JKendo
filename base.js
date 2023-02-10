'use strict';

class Formatter {
    constructor(type, value) {
        this.value = value
        this.format = ''
        switch (type) {
            case 'currency':
                this.format = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
                break;
        }
    }
    get val() {
        return this.format != '' ? this.value.replace(this.format, ',') : this.value
    }
}