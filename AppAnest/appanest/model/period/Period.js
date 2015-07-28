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
            name: 'periodof',
            type: 'auto',
            convert: function (value, record) {
                return Ext.util.Format.date(Ext.Date.parse(value,"Y-m-d"),'d/m/Y');
            }
        }, {
            name: 'periodto',
            type: 'auto',
            convert: function (value, record) {
                return Ext.util.Format.date(Ext.Date.parse(value,"Y-m-d"),'d/m/Y');
            }
        }, {
            name: 'description',
            type: 'auto',
            convert: function (value, record) {
                return Ext.String.leftPad(record.get('year'), 4, '0') + '/' + Ext.String.leftPad(record.get('month'), 2, '0');
            }
        }
    ]

});