Ext.define( 'AppAnest.model.person.ContractorUnitSchema', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'naturalpersonid',
            type: 'int'
        }, {
            name: 'weekday',
            type: 'auto'
        }, {
            name: 'position',
            type: 'int'
        }, {
            name: 'shift',
            type: 'auto'
        }, {
            name: 'shiftdescription',
            type: 'auto'
        }, {
            name: 'mon',
            type: 'int'
        }, {
            name: 'monperson',
            type: 'auto'
        }, {
            name: 'tue',
            type: 'int'
        }, {
            name: 'tueperson',
            type: 'auto'
        }, {
            name: 'wed',
            type: 'int'
        }, {
            name: 'wedperson',
            type: 'auto'
        }, {
            name: 'thu',
            type: 'int'
        }, {
            name: 'thuperson',
            type: 'auto'
        }, {
            name: 'fri',
            type: 'int'
        }, {
            name: 'friperson',
            type: 'auto'
        }
    ]

});