//@charset ISO-8859-1
Ext.define( 'AppAnest.store.allocationschedule.AllocationSchedulePicker', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.AllocationSchedulePicker',

    storeId: 'allocationschedulepicker',

    url: 'business/Class/schedulingmonthlypartners.php',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'dutydate',
            type: 'auto'
        }, {
            name: 'dateof',
            type: 'auto'
        }, {
            name: 'dateto',
            type: 'auto'
        }, {
            name: 'periodof',
            type: 'auto'
        }, {
            name: 'periodto',
            type: 'auto'
        }, {
            name: 'sun',
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
        }
    ]

});