//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorList', {
    extend: 'AppAnest.person.PersonList',

    xtype: 'contractorlist',

    requires: [
        'AppAnest.model.person.Contractor',
        'AppAnest.store.person.Contractor'
    ],

    controller: 'contractor',

    title: 'Listar Contratantes',

    glyph: 0xe959,

    store: 'AppAnest.store.person.Contractor'

});