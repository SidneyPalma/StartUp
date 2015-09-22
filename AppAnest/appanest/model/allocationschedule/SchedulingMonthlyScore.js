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
            type: 'auto',
            critical: true
        }, {
            name: 'changedate',
            type: 'auto',
            convert: function (value,record) {
                return Ext.util.Format.dateRenderer('d/m/Y g:i:s A')(value);
            }
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