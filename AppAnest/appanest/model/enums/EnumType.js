Ext.define( 'AppAnest.model.enums.EnumType', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'auto'
        }, {
            name: 'description',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }, {
            name: 'reserved',
            type: 'bool'
        }
    ],

    business: [
        { type: 'presence', field: 'name' },
        { type: 'presence', field: 'description' },
        { type: 'presence', field: 'reserved' }
    ]

});