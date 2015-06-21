Ext.define( 'AppAnest.model.contract.ContractData', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'contractid',
            type: 'int'
        }, {
            name: 'description',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }, {
            name: 'filedata',
            type: 'auto'
        }, {
            name: 'fileinfo',
            type: 'auto'
        }, {
            name: 'tablename',
            type: 'auto'
        }, {
            name: 'contractcode',
            type: 'auto'
        }, {
            name: 'additivecode',
            type: 'auto'
        }
    ]

});