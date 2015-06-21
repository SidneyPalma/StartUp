Ext.define( 'Smart.app.ViewControllerBase', {
    extend: 'Ext.app.ViewController',

    /**
     * For use in afterrender, from ContainerList(pesquisa)
     * @param panel
     * @param eOpts
     */
    onFocusSearch: function (container, eOpts) {
        var me = this;
        me.lookupReference('search').focus(false, 200);
    }

});