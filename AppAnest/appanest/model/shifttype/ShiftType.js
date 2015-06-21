Ext.define( 'AppAnest.model.shifttype.ShiftType', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'shift',
            type: 'auto'
        }, {
            name: 'shiftdescription',
            type: 'auto'
        }, {
            name: 'hours',
            type: 'int'
        }, {
            name: 'dutytype',
            type: 'auto'
        }, {
            name: 'dutytypedescription',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }, {
            name: 'validityof',
            type: 'auto'
        }, {
            name: 'validityto',
            type: 'auto'
        }
    ],

    business: [
        { type: 'presence', field: 'shift' },
        { type: 'presence', field: 'hours' },
        { type: 'presence', field: 'dutytype' },
        { type: 'presence', field: 'validityof' },
        { type: 'presence', field: 'validityto' },
        { type: 'presence', field: 'shiftdescription' }
    ]

});