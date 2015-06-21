Ext.define( 'AppAnest.model.contract.AdditiveTable', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'additiveid',
            type: 'int',
            critical: true
        }, {
            name: 'isactive',
            type: 'bool'
        }, {
            name: 'shiftvalue',
            type: 'auto'
        }, {
            name: 'shiftamount',
            type: 'auto',
            critical: true
        }, {
            name: 'shifttype',
            type: 'auto',
            critical: true
        }, {
            name: 'shifttypedescription',
            type: 'auto'
        }
    ]

});