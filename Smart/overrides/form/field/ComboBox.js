Ext.define( 'Ext.overrides.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    minChars: 1,
    pageSize: 10,

    //typeAhead: true,
    selectRecord: false,
    defaultSelect: true,
    selectOnFocus: false,
    readOnlyColor: false,

    collapseOnSelect: false,

    triggerAction: 'all',

    valueField: 'id',
    displayField: 'description',
    hiddenNameId: false,

    foundRecord: function () {
        var me = this;
        return me.findRecord(me.valueField,me.getValue());
    },

    initComponent: function () {
        var me = this;
        me.on('focus', me.onFocusFn, me);
        me.callParent(arguments);
    },

    onFocusFn: function () {
        this.getEl().frame("yellowgreen");
    },

    listeners: {
        select: function (combo, records, eOpts) {
            var ct = combo.ownerCt,
                name = combo.hiddenNameId;
            if (name) {
                ct.down('hiddenfield[name=' + name + ']').setValue(combo.getValue());
            }
        },
        beforequery: function (queryEvent, eOpts) {
            //var cmb = queryEvent.combo
            //
            //if (cmb.getRawValue() == "") {
            //    cmb.clearValue();
            //}
        }
    },
    
    afterRender: function (combo, eOpts) {
        var me = this,
            ct = me.ownerCt,
            name = me.hiddenNameId;

        if (name) {
            ct.add(Ext.widget('hiddenfield', { name: name, itemId: name }));
        }

        me.callParent(arguments);
    },
    
    setValue: function (value, doSelect) {
        var me = this.callParent(arguments);

        if(Ext.isString(value) & !Ext.isNumeric(value)){
            me.setRawValue(value);
            me.validate();
        }

        return me;
    }

});