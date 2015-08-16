//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.AllocationSchemaShift', {
    extend: 'Smart.form.field.ComboEnum',

    alias: 'widget.allocationschemasearchshift',

    hideTrigger: true,
    matchFieldWidth: false,
    listConfig: {  width: 160 },

    buildCombo: function () {
        var me = this;

        me.callParent();
        me.valueField = me.displayField;
    },

    listeners: {
        select: 'selectAllocationSchema'
        //change: 'changeAllocationSchema'
    }

});
