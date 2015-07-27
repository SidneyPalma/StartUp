//@charset ISO-8859-1
Ext.define( 'AppAnest.store.allocationschema.AllocationSchemaMap', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AllocationSchemaMap',

    storeId: 'allocationschemamap',

    url: 'business/Class/allocationschemamap.php',

    model: 'AppAnest.model.allocationschema.AllocationSchemaMap'

});