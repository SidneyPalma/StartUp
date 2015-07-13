//@charset ISO-8859-1
Ext.define( 'AppAnest.store.period.Period', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.Period',

    storeId: 'period',

    url: 'business/Class/period.php',

    model: 'AppAnest.model.period.Period',

    config: {
        extraParams: {
            params: Ext.encode(['month'])
        }
    }

});