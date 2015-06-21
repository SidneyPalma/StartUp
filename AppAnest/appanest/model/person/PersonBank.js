Ext.define( 'AppAnest.model.person.PersonBank', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'personid',
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
            type: 'boolean'
        }
    ],

    business: [
        { type: 'presence', field: 'personid' },
        { type: 'presence', field: 'bank' },
        { type: 'presence', field: 'accounttype' },
        { type: 'presence', field: 'agency' },
        { type: 'presence', field: 'accountnumber' }
    ]

});