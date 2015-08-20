//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationWeek', {
    extend: 'Ext.container.Container',

    xtype: 'allocationweek',

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