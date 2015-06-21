//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorUnitList', {
    extend: 'AppAnest.person.PersonList',

    xtype: 'contractorunitlist',

    requires: [
        'AppAnest.model.person.ContractorUnit',
        'AppAnest.store.person.ContractorUnit'
    ],

    controller: 'contractorunit',

    title: 'Listar Unidades Contratantes',

    glyph: 0xe959,

    store: 'AppAnest.store.person.ContractorUnit'

});