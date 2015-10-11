//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.ContractorUnitSchemaSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.contractorunitschemasearch',

    requires: [
        'AppAnest.store.allocationschema.ContractorUnitSchemaSearch'
    ],

    displayField: 'shortname',

    store: 'AppAnest.store.allocationschema.ContractorUnitSchemaSearch',

    // template for the content List
    tpl: [
        '<tpl style:"font-size: 14px;" for=".">',
            '<div class="x-boundlist-item">' +
                '<span style="font-size: 17px; color:#3333FF; display: block; font-family: Monda;">{shortname}</span>' +
                '<span style="font-size: 14px; color:#990000; display: block; font-family: Monda;">{subunitdescription}</span>' +
            '</div>',
        '</tpl>'
    ]

});
