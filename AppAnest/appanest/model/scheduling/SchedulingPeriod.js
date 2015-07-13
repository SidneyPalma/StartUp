Ext.define( 'AppAnest.model.scheduling.SchedulingPeriod', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'year',
            type: 'int'
        }, {
            name: 'month',
            type: 'int'
        }, {
            name: 'periodid',
            type: 'int'
        }, {
            name: 'periodof',
            type: 'auto'
        }, {
            name: 'periodto',
            type: 'auto'
        }, {
            name: 'status',
            type: 'auto'
        }, {
            name: 'statusdescription',
            type: 'auto'
        }, {
            name: 'description',
            type: 'auto',
            convert: function (value,record) {
                return Ext.String.leftPad(record.get('year'), 4, '0') +'/' + Ext.String.leftPad(record.get('month'), 2, '0');
            }
        }
    ]

});