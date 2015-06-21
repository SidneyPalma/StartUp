Ext.define( 'AppAnest.model.person.NaturalPersonPhone', {
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
            name: 'phonetype',
            type: 'auto'
        }, {
            name: 'phonetypedescription',
            type: 'auto'
        }, {
            name: 'linetype',
            type: 'auto'
        }, {
            name: 'linetypedescription',
            type: 'auto'
        }, {
            name: 'ddd',
            type: 'auto'
        }, {
            name: 'phonenumber',
            type: 'auto'
        }, {
            name: 'phoneoperator',
            type: 'auto'
        }, {
            name: 'phoneoperatordescription',
            type: 'auto'
        }, {
            name: 'isdefault',
            type: 'boolean',
            defaultValue: 0
        }
    ],

    business: [
        { type: 'presence', field: 'naturalpersonid' },
        { type: 'presence', field: 'phoneoperator' },
        { type: 'presence', field: 'phonenumber' },
        { type: 'presence', field: 'phonetype' },
        { type: 'presence', field: 'linetype' },
        { type: 'presence', field: 'ddd' }
    ]

});