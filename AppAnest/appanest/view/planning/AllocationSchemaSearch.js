//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.AllocationSchemaSearch', {
    extend: 'Smart.form.field.ComboEnum',

    alias: 'widget.allocationschemasearch',

    hideTrigger: true,
    matchFieldWidth: false,
    listConfig: {  width: 150 },

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
