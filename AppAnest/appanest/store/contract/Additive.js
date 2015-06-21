//@charset ISO-8859-1
Ext.define( 'AppAnest.store.contract.Additive', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.Additive',

    storeId: 'additive',

    url: 'business/Class/additive.php',

    model: 'AppAnest.model.contract.Additive'

});