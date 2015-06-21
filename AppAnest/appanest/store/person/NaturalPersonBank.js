//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.NaturalPersonBank', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.NaturalPersonBank',

    storeId: 'naturalpersonbank',

    model: 'AppAnest.model.person.NaturalPersonBank',

    url: 'business/Class/naturalpersonbank.php',

    config: {
        extraParams: {
            params: Ext.encode(['naturalpersonid'])
        }
    }

});