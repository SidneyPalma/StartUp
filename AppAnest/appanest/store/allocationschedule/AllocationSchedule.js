Ext.define( 'AppAnest.store.allocationschedule.AllocationSchedule', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AllocationSchedule',

    storeId: 'allocationschedule',

    url: 'business/Class/schedulingmonthlypartners.php',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'bordertop',
            type: 'int',
            defaultValue: 0
        }, {
            name:  'rownumber',
            type: 'int'
        }, {
            name: 'position',
            type: 'int'
        }, {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'contractorunit',
            type: 'auto'
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
            name: 'monschema',
            type: 'auto'
        }, {
            name: 'tueschema',
            type: 'auto'
        }, {
            name: 'wedschema',
            type: 'auto'
        }, {
            name: 'thuschema',
            type: 'auto'
        }, {
            name: 'frischema',
            type: 'auto'
        }, {
            name: 'satschema',
            type: 'auto'
        }, {
            name: 'sunschema',
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