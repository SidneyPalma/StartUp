Ext.define( 'AppAnest.model.allocationschedule.SchedulingMonthlyScore', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'schedulingmonthlypartnersid',
            type: 'int'
        }, {
            name: 'naturalpersonid',
            type: 'int'
        }, {
            name: 'naturalperson',
            type: 'auto'
        }, {
            name: 'scoretype',
            type: 'auto'
        }, {
            name: 'changedate',
            type: 'auto'
        }, {
            name: 'dutyfraction',
            type: 'auto'
        }, {
            name: 'username',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }
    ]

});