Ext.define( 'AppAnest.model.person.NaturalPersonBank', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'naturalpersonid',
            type: 'int'
        }, {
            name: 'bank',
            type: 'int'
        }, {
            name: 'bankdescription',
            type: 'auto'
        }, {
            name: 'accounttype',
            type: 'auto'
        }, {
            name: 'accounttypedescription',
            type: 'auto'
        }, {
            name: 'agency',
            type: 'int'
        }, {
            name: 'accountnumber',
            type: 'int'
        }, {
            name: 'isdefault',
            type: 'boolean',
            defaultValue: 0
        }
    ],

    business: [
        { type: 'presence', field: 'naturalpersonid' },
        { type: 'presence', field: 'bank' },
        { type: 'presence', field: 'accounttype' },
        { type: 'presence', field: 'agency' },
        { type: 'presence', field: 'accountnumber' }
    ]

});