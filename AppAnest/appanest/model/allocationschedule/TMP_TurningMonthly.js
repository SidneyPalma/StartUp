Ext.define( 'AppAnest.model.allocationschedule.TMP_TurningMonthly', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'schedulingmonthlyid',
            type: 'int'
        }, {
            name: 'naturalpersonid',
            type: 'int'
        }, {
            name: 'naturalperson',
            type: 'auto'
        }, {
            name: 'contractorunitid',
            type: 'int'
        }, {
            name: 'contractorunit',
            type: 'auto'
        }, {
            name: 'position',
            type: 'int'
        }, {
            name: 'shift',
            type: 'auto'
        }, {
            name: 'shiftdescription',
            type: 'auto'
        }, {
            name: 'subunit',
            type: 'auto'
        }, {
            name: 'subunitdescription',
            type: 'auto'
        }, {
            name: 'allocationschema',
            type: 'auto'
        }, {
            name: 'allocationschemadescription',
            type: 'auto'
        }, {
            name: 'releasetype',
            type: 'auto'
        }, {
            name: 'releasetypedescription',
            type: 'auto'
        }, {
            name: 'username',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }, {
            name: 'observationlog',
            type: 'auto'
        }
    ]

});