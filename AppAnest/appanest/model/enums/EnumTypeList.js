Ext.define( 'AppAnest.model.enums.EnumTypeList', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'enumtypeid',
            type: 'int'
        }, {
            name: 'code',
            type: 'auto'
        }, {
            name: 'description',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }
    ],

    business: [
        { type: 'presence', field: 'code' },
        { type: 'presence', field: 'description' },
        { type: 'presence', field: 'enumtypeid' }
    ]

});