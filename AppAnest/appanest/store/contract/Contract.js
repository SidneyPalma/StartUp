//@charset ISO-8859-1
Ext.define( 'AppAnest.store.contract.Contract', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.Contract',

    storeId: 'contract',

    url: 'business/Class/contract.php',

    model: 'AppAnest.model.contract.Contract'

});