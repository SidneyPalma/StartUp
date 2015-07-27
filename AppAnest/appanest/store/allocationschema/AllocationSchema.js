Ext.define( 'AppAnest.store.allocationschema.AllocationSchema', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AllocationSchema',

    storeId: 'allocationschema',

    url: 'business/Class/allocationschema.php',

    model: 'AppAnest.model.allocationschema.AllocationSchema'

});