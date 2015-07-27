//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchemaSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.allocationschemasearch',

    pageSize: 0,
    editable: false,

    fieldLabel: 'Periodo',

    requires: [
        'AppAnest.store.allocationschema.AllocationSchema'
    ],

    displayField: 'month',

    store: 'AppAnest.store.allocationschema.AllocationSchema',

    // template for the content List
    tpl: [
        '<tpl style:"font-size: 14px;" for=".">',
            '<div class="x-boundlist-item">' +
                '<span style="font-size: 17px; color:#3333FF; display: block; font-family: Monda;">{perioddescription}</span>' +
                '<span style="font-size: 14px; color:#990000; display: block; font-family: Monda;">{periodof} - {periodto}</span>' +
            '</div>',
        '</tpl>'
    ],

    // template for the content displayField
    displayTpl: [
        '<tpl for=".">',
            '{periodof} - {periodto}',
        '</tpl>'
    ]

});
