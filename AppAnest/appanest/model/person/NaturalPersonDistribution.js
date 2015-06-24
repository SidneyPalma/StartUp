Ext.define( 'AppAnest.model.person.NaturalPersonDistribution', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'naturalpersonid',
            type: 'int',
            critical: true
        }, {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'shift',
            type: 'auto'
        }, {
            name: 'shiftdescription',
            type: 'auto'
        }, {
            name: 'weekday',
            type: 'auto'
        }, {
            name: 'sun',
            type: 'int'
        }, {
            name: 'mon',
            type: 'int'
        }, {
            name: 'tue',
            type: 'int'
        }, {
            name: 'wed',
            type: 'int'
        }, {
            name: 'thu',
            type: 'int'
        }, {
            name: 'fri',
            type: 'int'
        }, {
            name: 'sat',
            type: 'int'
        }, {
            name: 'sunid',
            type: 'int'
        }, {
            name: 'monid',
            type: 'int'
        }, {
            name: 'tueid',
            type: 'int'
        }, {
            name: 'wedid',
            type: 'int'
        }, {
            name: 'thuid',
            type: 'int'
        }, {
            name: 'friid',
            type: 'int'
        }, {
            name: 'satid',
            type: 'int'
        }
    ]

});