Ext.define( 'Smart.store.Entity', {
    extend: 'Smart.store.Fields',

    alias: 'store.Entity',

    storeId: 'entity',

    fields: [
        {
            name: 'TABLE_NAME',
            type: 'auto'
        }
    ],

    config: {
        extraParams: {
            action: 'selectTables'
        }
    }

});