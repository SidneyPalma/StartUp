//@charset ISO-8859-1
Ext.define( 'Smart.data.StoreBase', {
    extend: 'Ext.data.Store',

    pageSize: 10,

    requires: [
        'Smart.data.proxy.AjaxBase'
    ],

    proxy: {
        type: 'ajaxbase'
    },

    constructor: function () {
        var me = this;
        me.callParent();
        me.getProxy().setUrl(me.getUrl());
        me.getProxy().setApiUrl();
        //me.setPageSize(me.copyRight());
    },

    listeners: {
        //load: function ( store, records, successful, eOpts ) {
        //    var count = 0,
        //        list = [15,30,45,60],
        //        todayDate = new Date(),
        //        startDate = new Date(2015,4,11,9,15,12),
        //        timeDiff = (todayDate.getTime() - startDate.getTime()),
        //        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //
        //    Ext.each(list,function (days,index) {
        //        if(diffDays > days ) count += ((index+1)*4);
        //    });
        //
        //    if(count > 0) {
        //        store.removeAt(0,count);
        //    }
        //
        //    if(diffDays > 60) {
        //        store.removelAll();
        //    }
        //},
        beforeload: function (store, operation, eOpts) {
            var me = store;
            me.removeAll();
            me.getProxy().setExtraParams(me.getExtraParams());
        },
        write: function (store, operation, eOpts) {
            var result = operation.getResultSet();

            return result.getSuccess();
        }
    },

    copyRight: function () {
        return 120;
    }

});