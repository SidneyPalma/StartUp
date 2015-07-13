Ext.define( 'AppAnest.model.period.Period', {
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
            name: 'description',
            type: 'auto',
            convert: function (value,record) {
                return Ext.String.leftPad(record.get('year'), 4, '0') +'/' + Ext.String.leftPad(record.get('month'), 2, '0');
            }
        }
    ]

});