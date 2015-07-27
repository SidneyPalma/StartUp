Ext.define( 'AppAnest.model.allocationschema.AllocationSchema', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'periodid',
            type: 'int'
        }, {
            name: 'description',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }, {
            name: 'username',
            type: 'auto'
        }, {
            name: 'schemaweek',
            type: 'auto'
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
            name: 'perioddescription',
            type: 'auto',
            convert: function (value, record) {
                return Ext.String.leftPad(record.get('year'), 4, '0') + '/' + Ext.String.leftPad(record.get('month'), 2, '0');
            }
        }
    ]

});