//@charset ISO-8859-1
Ext.define( 'Ext.overrides.panel.Table', {
    override: 'Ext.panel.Table',

    rowLines: false,
    hideHeaders: true,
    columnsRenderer: false,

    viewConfig: {
        deferEmptyText: false,
        loadMask: { msg: 'Carregando...!' },
        emptyText: '<div style="height: 100%;">Nenhum dado disponivel...</div>'
    },

    beforeRender: function (view, eOpts) {
        var me = this;
        if(me.columnsRenderer) {
            Ext.each(me.columns,function(column){
                if(column.renderer === false) {
                    column.renderer = me.columnsRenderer;
                };
            });
        }
        me.callParent();
    }

});