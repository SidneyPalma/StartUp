Ext.define( 'Smart.form.field.SmartCombo', {
    extend: 'Ext.form.field.ComboBox',

    alias: 'widget.smartcombo',

    requires: [
        'Smart.data.StoreBase'
    ],

    config: {
        url: null,
        model: null,
        fields: null,
        params: {
            query: '%',
            action: 'selectTables',
            method: 'selectLike',
            field: 'description'
        }
    },

    initComponent: function () {
        var me = this;
        me.initConfig();
        me.buildStore();
        me.callParent();
    },

    buildStore: function () {
        var me = this;

        if(me.store) {
            me.store = Ext.create(me.store);
            me.store.setParams(me.getParams());
        } else {
            me.store = Ext.create(
                Ext.define( 'SmartComboStore', {
                    extend: 'Smart.data.StoreBase',
                    url: me.getUrl(),
                    //model: me.getModel(),
                    fields: me.getFields(),
                    config: {
                        extraParams: me.getParams()
                    }
                })
            );
            //me.store = Ext.create('Smart.data.StoreBase', {
            //    url: me.getUrl(),
            //    model: me.getModel(),
            //    fields: me.getFields(),
            //    params: me.getParams()
            //});
        }
    }

});