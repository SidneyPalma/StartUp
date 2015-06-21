//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.PersonPhone', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.PersonPhone',

    storeId: 'personphone',

    model: 'AppAnest.model.person.PersonPhone',

    url: 'business/Class/personphone.php',

    config: {
        extraParams: {
            params: Ext.encode(['personid'])
        }
    }

});