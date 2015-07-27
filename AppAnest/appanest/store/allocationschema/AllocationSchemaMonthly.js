Ext.define( 'AppAnest.store.allocationschema.AllocationSchemaMonthly', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AllocationSchemaMonthly',

    storeId: 'allocationschemamonthly',

    url: 'business/Class/allocationschema.php',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'position',
            type: 'int'
        }, {
            name: 'rownumber',
            type: 'int'
        }, {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'contractorunit',
            type: 'auto'
        }, {
            name: 'greatest',
            type: 'int'
        }, {
            name: 'shift',
            type: 'auto'
        }, {
            name: 'subunit',
            type: 'auto'
        }, {
            name: 'mon',
            type: 'auto'
        }, {
            name: 'tue',
            type: 'auto'
        }, {
            name: 'wed',
            type: 'auto'
        }, {
            name: 'thu',
            type: 'auto'
        }, {
            name: 'fri',
            type: 'auto'
        }, {
            name: 'sat',
            type: 'auto'
        }, {
            name: 'sun',
            type: 'auto'
        }, {
            name: 'mondescription',
            type: 'auto'
        }, {
            name: 'tuedescription',
            type: 'auto'
        }, {
            name: 'weddescription',
            type: 'auto'
        }, {
            name: 'thudescription',
            type: 'auto'
        }, {
            name: 'fridescription',
            type: 'auto'
        }, {
            name: 'satdescription',
            type: 'auto'
        }, {
            name: 'sundescription',
            type: 'auto'
        }
    ]

});