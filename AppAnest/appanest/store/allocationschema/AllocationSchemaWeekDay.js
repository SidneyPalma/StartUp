Ext.define( 'AppAnest.store.allocationschema.AllocationSchemaWeekDay', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AllocationSchemaWeekDay',

    storeId: 'allocationschemaweekday',

    url: 'business/Class/allocationschemamap.php',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'contractorunit',
            type: 'auto'
        }, {
            name: 'position',
            type: 'auto'
        }, {
            name: 'positioncute',
            type: 'int'
        }
    ]

});