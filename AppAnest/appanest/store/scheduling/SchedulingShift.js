Ext.define( 'AppAnest.store.scheduling.SchedulingShift', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.SchedulingShift',

    storeId: 'schedulingshift',

    url: 'business/Class/additiveshift.php',

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

    //model: 'AppAnest.model.scheduling.SchedulingShift'

});