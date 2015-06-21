//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.NaturalPersonPhone', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.NaturalPersonPhone',

    storeId: 'naturalpersonphone',

    model: 'AppAnest.model.person.NaturalPersonPhone',

    url: 'business/Class/naturalpersonphone.php',

    config: {
        extraParams: {
            params: Ext.encode(['naturalpersonid'])
        }
    }

});