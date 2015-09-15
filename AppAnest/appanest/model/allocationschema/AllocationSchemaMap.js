Ext.define( 'AppAnest.model.allocationschema.AllocationSchemaMap', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'allocationschemaid',
            type: 'int',
            critical: true
        }, {
            name: 'weekday',
            type: 'auto',
            critical: true
        }, {
            name: 'schemamap',
            type: 'auto',
            critical: true
        }, {
            name: 'weekdaydescription',
            type: 'auto'
        }, {
            name: 'isselected',
            type: 'boolean',
            persist: false,
            defaultValue: false
        }, {
            name: 'weekold',
            type: 'int'
        }, {
            name: 'weeknew',
            type: 'int'
        }, {
            name: 'weekmax',
            type: 'int'
        }
    ]

});