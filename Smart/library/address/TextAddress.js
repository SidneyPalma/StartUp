//@charset ISO-8859-1
Ext.define( 'Smart.address.TextAddress', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.textaddress',

    name: 'address',

    initComponent: function () {
        var me = this;

        me.callParent();

        me.setTriggers({
            search: {
                weight: 0,
                cls: Ext.baseCSSPrefix + 'form-search-trigger',
                handler: 'onAddressSearchClick'
            }
        });
    }

});