//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.contractorsearch',

    requires: [
        'AppAnest.store.person.Contractor',
    ],

    displayField: 'name',

    store: 'AppAnest.store.person.Contractor'

});
