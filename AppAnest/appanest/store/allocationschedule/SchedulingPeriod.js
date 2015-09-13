//@charset ISO-8859-1
Ext.define( 'AppAnest.store.allocationschedule.SchedulingPeriod', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.SchedulingPeriod',

    storeId: 'schedulingperiod',

    url: 'business/Class/schedulingperiod.php',

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
            name: 'status',
            type: 'auto'
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