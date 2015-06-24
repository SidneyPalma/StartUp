//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorUnitSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.contractorunitsearch',

    requires: [
        'AppAnest.store.person.ContractorUnit',
    ],

    displayField: 'shortname',

    store: 'AppAnest.store.person.ContractorUnit'

});
