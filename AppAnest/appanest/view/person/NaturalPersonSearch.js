//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.NaturalPersonSearch', {
    extend: 'Smart.form.field.ComboSearch',

    xtype: 'naturalpersonsearch',

    requires: [
        'AppAnest.store.person.NaturalPerson',
    ],

    displayField: 'shortname',

    store: 'AppAnest.store.person.NaturalPerson'

});
