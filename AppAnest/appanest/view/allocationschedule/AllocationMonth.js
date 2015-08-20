//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationMonth', {
    extend: 'Ext.container.Container',

    xtype: 'allocationmonth',

    requires: [
    ],

    padding: 10,

    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

    }

});