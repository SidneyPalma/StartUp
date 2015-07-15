Ext.define( 'AppAnest.model.scheduling.SchedulingShiftMap', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'contractorunit',
            type: 'auto'
        }, {
            name: 'position',
            type: 'int'
        }, {
            name: 'positioncute',
            type: 'int',
            defaultValue: 0
        }, {
            name: 'dutyamount',
            type: 'int',
            convert: function (value,record) {
                return (value) ? parseInt(value) : 0;
            }
        }
    ]

});