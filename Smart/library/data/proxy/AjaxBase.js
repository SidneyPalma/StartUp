Ext.define( 'Smart.data.proxy.AjaxBase', {
    extend: 'Ext.data.proxy.Ajax',

    alias: 'proxy.ajaxbase',
    
    actionMethods: {
        read: 'POST'
    },

    reader: {
        type: 'json',
        idProperty: 'id',
        rootProperty: 'rows',
        messageProperty: 'text',
        totalProperty: 'records',
        successProperty: 'success'
    },

    writer: {
        type: 'json',
        encode: true,
        idProperty: 'id',
        rootProperty: 'rows',
        dateFormat: 'Y-m-d',
        writeAllFields: false
    },

    setApiUrl: function() {
        var me = this;
        if(me.getUrl() !== undefined && !Ext.Object.getValues(me.getApi()).length) {
            me.setApi({
                create: me.getUrl()  + '?action=update',
                update: me.getUrl()  + '?action=update',
                destroy: me.getUrl() + '?action=delete'
            });
        }
    },

    listeners: {
        exception: function (proxy, response, operation, eOpts) {
            var result = operation.getResultSet();
        }
    }

});