Ext.define( 'AppAnest.model.contract.AdditiveShift', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'shiftdescription',
            type: 'auto'
        }, {
            name: 'dutytypedescription',
            type: 'auto'
        }, {
            name: 'shift',
            type: 'auto'
        }, {
            name: 'dutytype',
            type: 'auto'
        }, {
            name: 'additiveid',
            type: 'int',
            critical: true
        }, {
            name: 'contractorsubunitid',
            type: 'int',
            critical: true
        }, {
            name: 'hours',
            type: 'int'
        }, {
            name: 'shifttypeid',
            type: 'int',
            critical: true
        }, {
            name: 'isactive',
            type: 'bool'
        }, {
            name: 'validityof',
            type: 'auto'
        }, {
            name: 'validityto',
            type: 'auto'
        }, {
            name: 'amountsun',
            type: 'int'
        }, {
            name: 'amountmon',
            type: 'int'
        }, {
            name: 'amounttue',
            type: 'int'
        }, {
            name: 'amountwed',
            type: 'int'
        }, {
            name: 'amountthu',
            type: 'int'
        }, {
            name: 'amountfri',
            type: 'int'
        }, {
            name: 'amountsat',
            type: 'int'
        }
    ]

});