//@charset ISO-8859-1
Ext.define( 'Smart.data.TreeStoreBase', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'Smart.data.proxy.AjaxBaseTree'
    ],

    proxy: {
        type: 'ajaxbasetree'
    },

    root: {
        text: ".",
        children: [],
        expanded: true
    },

    constructor: function () {
        var me = this;
        me.callParent();
        me.getProxy().setUrl(me.getUrl());
        me.getProxy().setApiUrl();
    },

    listeners: {
        beforeload: function (store, operation, eOpts) {
            var me = store;
            me.removeAll();
            me.getProxy().setExtraParams(me.getExtraParams());
        },
        write: function (store, operation, eOpts) {
            var result = operation.getResultSet();

            if(result.getSuccess() === true) {
                return true;
            } else {
                return false;
            }
        }
    }

});