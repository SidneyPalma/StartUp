//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.LegalEntityList', {
    extend: 'AppAnest.person.PersonList',

    xtype: 'legalentitylist',

    requires: [
        'AppAnest.model.person.LegalEntity',
        'AppAnest.store.person.LegalEntity'
    ],

    controller: 'legalentity',

    title: 'Listar Empresas',

    glyph: 0xe959,

    store: 'AppAnest.store.person.LegalEntity'

});