//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationDay', {
    extend: 'Ext.container.Container',

    xtype: 'allocationday',

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