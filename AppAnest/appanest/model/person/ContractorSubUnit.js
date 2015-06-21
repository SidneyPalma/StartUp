Ext.define( 'AppAnest.model.person.ContractorSubUnit', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'reserved',
            type: 'boolean'
        }, {
            name: 'contractorunitid',
            type: 'int',
            critical: true
        }, {
            name: 'subunit',
            type: 'auto',
            critical: true
        }, {
            name: 'subunitdescription',
            type: 'auto'
        }, {
            name: 'isactive',
            type: 'boolean'
        }, {
            name: 'shiftstotal',
            type: 'int'
        }
    ],

    business: [
        { type: 'presence', field: 'contractorunitid' },
        { type: 'presence', field: 'subunit' }
    ]

    //fields: [
    //    { name: 'id', type: 'int', unique: true }
    //]

    //validators: {
    //    id: [
    //        {
    //            type: 'range',
    //            min: 1,
    //            minOnlyMessage: 'O código de identificação não pode ser menor que 1 (um).'
    //        }
    //    ]
    //}

});