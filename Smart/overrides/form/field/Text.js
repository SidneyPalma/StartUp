Ext.define( 'Ext.overrides.form.field.Text', {
    override: 'Ext.form.field.Text',

    hasSearch: false,
    paramName: 'query',

    initComponent: function () {
        var me = this;

        me.callParent();

        if(me.hasSearch === true ) {
            me.emptyText = 'Pesquisar';
            me.setTriggers({
                clear: {
                    weight: 0,
                    hidden: true,
                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    handler: 'onSearchClear'
                },
                search: {
                    weight: 1,
                    cls: Ext.baseCSSPrefix + 'form-search-trigger',
                    handler: 'onSearchClick'
                }
            });

            me.addListener('specialkey', function (field, e, eOpts) {
                if (e.getKey() === e.ENTER) {
                    field.getTriggers().search.onClick();
                }
            },me);
        }

    }

});