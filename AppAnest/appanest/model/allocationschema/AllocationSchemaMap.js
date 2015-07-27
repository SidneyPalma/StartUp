Ext.define( 'AppAnest.model.allocationschema.AllocationSchemaMap', {
    extend: 'Ext.data.Model',


    idProperty: 'id',

    fields: [
        {
            name: 'id',
            type: 'int',
            convert: function (value, record) {
                return Ext.isNumber(parseInt(value)) ? value : '';
            }
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
        }
    ]

});