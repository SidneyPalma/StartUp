Ext.define( 'AppAnest.store.contract.AdditiveTable', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AdditiveTable',

    storeId: 'additivetable',

    url: 'business/Class/additivetable.php',

    model: 'AppAnest.model.contract.AdditiveTable'

});