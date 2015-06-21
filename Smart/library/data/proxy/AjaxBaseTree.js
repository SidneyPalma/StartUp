Ext.define( 'Smart.data.proxy.AjaxBaseTree', {
    extend: 'Smart.data.proxy.AjaxBase',

    alias: 'proxy.ajaxbasetree',

    reader: {
        rootProperty: 'children'
    },

    writer: {
        rootProperty: 'children'
    }

});