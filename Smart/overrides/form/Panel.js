//@charset ISO-8859-1
Ext.define( 'Ext.overrides.form.Panel', {
    override: 'Ext.form.Panel',

    initComponent: function () {
        var me = this;
        
        if(me.showSmartTransparent === true) {
            me.bodyStyle = Ext.apply({backgroundColor: 'transparent'},me.bodyStyle);
        }

        me.callParent();
    }

});