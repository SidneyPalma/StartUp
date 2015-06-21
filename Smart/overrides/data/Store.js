//@charset ISO-8859-1
Ext.define( 'Ext.overrides.data.Store', {
    override: 'Ext.data.Store',

    autoLoad: false,

    config: {
        url: null,
        extraParams: {
            query: '',
            rows: '{"id":""}',
            fields: Ext.encode([]),
            params: Ext.encode(['description']),
            action: 'select',
            method: 'selectLike'
        }
    },
    
    setParams: function (params) {
        var me = this,
            extraParams = me.getExtraParams();

        me.currentPage = 1;
        me.setExtraParams(Ext.merge(extraParams,params));
        
        return me;
    }

});