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
        }
    ]

});