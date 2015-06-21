//@charset ISO-8859-1
Ext.define( 'AppAnest.store.contract.AdditiveShift', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AdditiveShift',

    storeId: 'additiveshift',

    url: 'business/Class/additiveshift.php',

    model: 'AppAnest.model.contract.AdditiveShift'

});