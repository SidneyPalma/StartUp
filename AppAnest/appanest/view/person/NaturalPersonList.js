//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.NaturalPersonList', {
    extend: 'AppAnest.person.PersonList',

    xtype: 'naturalpersonlist',

    requires: [
        'AppAnest.model.person.NaturalPerson',
        'AppAnest.store.person.NaturalPerson'
    ],

    controller: 'naturalperson',

    title: 'Listar profissionais',

    glyph: 0xe954,

    store: 'AppAnest.store.person.NaturalPerson'

});