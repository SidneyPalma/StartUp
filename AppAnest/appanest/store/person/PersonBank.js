//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.PersonBank', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.PersonBank',

    storeId: 'personbank',

    model: 'AppAnest.model.person.PersonBank',

    url: 'business/Class/personbank.php',

    config: {
        extraParams: {
            params: Ext.encode(['personid'])
        }
    }

});